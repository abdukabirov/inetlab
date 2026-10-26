import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookMarked, Check, Clock, GraduationCap } from 'lucide-react';
import { useApp } from '../app/state';
import {
  CONCEPTS, CONCEPT_BY_ID, LEVELS, conceptsInLevel, nextConcept, prevConcept, type VizId,
} from '../content/curriculum';
import type { ConceptId } from '../i18n/content-en';
import { Badge, Button, Card, EmptyState, Note, Progress, Section, Tabs } from '../components/ui';
import {
  BgpViz, CdnViz, DhcpViz, DnsViz, HttpViz, IpViz, NatViz, PacketViz, PortsViz, RoutingViz, SubnetViz, SwitchViz, TcpViz, TlsViz, UdpViz, VizFrame,
} from '../components/viz/NetworkViz';
import { InternetMap } from '../components/map/InternetMap';
import { TOPOLOGIES } from '../content/topology';
import { cn } from '../utils/cn';

/* ── Learning path overview ──────────────────────────────── */

export function LearnPage() {
  const { t, c, nav, progress } = useApp();
  const done = progress.done.length;

  return (
    <div className="mx-auto max-w-[1180px] space-y-8">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.learn.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-muted">{t.learn.lead}</p>
      </header>

      <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
        <div className="min-w-[180px] flex-1">
          <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
            <span className="font-medium">{t.learn.yourProgress}</span>
            <span className="font-mono text-slate-500 dark:text-muted">{done} / {CONCEPTS.length}</span>
          </div>
          <Progress value={done / CONCEPTS.length} label={t.a11y.progressBar} />
        </div>
        <Button variant="primary" onClick={() => nav(`/learn/${progress.last ?? CONCEPTS[0].id}`)} trailing={<ArrowRight size={15} />}>
          {done ? t.learn.resume : t.common.startLearning}
        </Button>
      </Card>

      {LEVELS.map((lv, li) => {
        const items = conceptsInLevel(lv);
        const finished = items.filter((x) => progress.done.includes(x.id)).length;
        return (
          <Section
            key={lv}
            id={lv}
            eyebrow={`${t.common.level} ${li + 1}`}
            title={t.levels[lv].title}
            lead={t.levels[lv].desc}
            actions={<Badge tone={finished === items.length ? 'teal' : 'neutral'}>{finished}/{items.length}</Badge>}
          >
            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((meta) => {
                const cc = c.concepts[meta.id];
                const isDone = progress.done.includes(meta.id);
                return (
                  <li key={meta.id}>
                    <button
                      onClick={() => nav(`/learn/${meta.id}`)}
                      className={cn(
                        'lift flex h-full w-full flex-col rounded-[14px] border p-4 text-left',
                        isDone
                          ? 'border-teal-500/45 bg-teal-500/[0.05]'
                          : 'border-slate-200 bg-white hover:border-brand-400/60 dark:border-hairline dark:bg-surface',
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[14.5px] font-semibold leading-snug">{cc.title}</span>
                        {isDone && (
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-500 text-white">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-muted">{cc.tagline}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 dark:text-faint">
                        <Clock size={11} />
                        {meta.minutes} {t.common.minutes}
                        <Badge tone="brand" className="ml-auto">{t.common.interactive}</Badge>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        );
      })}
    </div>
  );
}

/* ── Visualisation registry ──────────────────────────────── */

function VizFor({ id }: { id: VizId }) {
  const { t, nav } = useApp();
  switch (id) {
    case 'ip': return <IpViz />;
    case 'subnet': return <SubnetViz />;
    case 'dns': return <DnsViz />;
    case 'tcp': return <TcpViz />;
    case 'udp': return <UdpViz />;
    case 'nat': return <NatViz />;
    case 'routing': return <RoutingViz />;
    case 'bgp': return <BgpViz />;
    case 'cdn': return <CdnViz />;
    case 'packet': return <PacketViz />;
    case 'ports': return <PortsViz />;
    case 'switch': return <SwitchViz />;
    case 'dhcp': return <DhcpViz />;
    case 'tls': return <TlsViz />;
    case 'http': return <HttpViz />;
    case 'frame': return <PacketViz />;
    case 'quic': return <TlsViz />;
    case 'map':
    case 'as':
    case 'isp':
    case 'ixp':
    case 'datacenter':
    case 'submarine':
    case 'journey': {
      const level = id === 'submarine' || id === 'journey' ? 'l4' : id === 'isp' ? 'l1' : 'l3';
      return (
        <VizFrame title={t.map.title} lead={t.map.levelHint[level]}>
          <InternetMap topology={TOPOLOGIES[level]} selected={null} onSelect={(nid) => nav(`/map/${level}/${nid}`)} height={300} compact />
          <Button size="sm" className="mt-3" onClick={() => nav(`/map/${level}`)} trailing={<ArrowRight size={14} />}>
            {t.home.mapCta}
          </Button>
        </VizFrame>
      );
    }
    default:
      return null;
  }
}

/* ── Concept page ────────────────────────────────────────── */

export function ConceptPage({ id }: { id: string }) {
  const { t, c, nav, detail, setDetail, progress, toggleDone, setLast } = useApp();
  const meta = CONCEPT_BY_ID.get(id as ConceptId);

  useEffect(() => {
    if (meta) setLast(meta.id);
  }, [meta, setLast]);

  if (!meta) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <EmptyState
          title={t.notFound.title}
          body={t.notFound.body}
          action={<Button variant="primary" onClick={() => nav('/learn')}>{t.learn.title}</Button>}
        />
      </div>
    );
  }

  const cc = c.concepts[meta.id];
  const isDone = progress.done.includes(meta.id);
  const next = nextConcept(meta.id);
  const prev = prevConcept(meta.id);
  const levelIndex = LEVELS.indexOf(meta.level);
  const siblings = conceptsInLevel(meta.level);

  return (
    <div className="mx-auto max-w-[1180px]">
      <nav aria-label={t.learn.title} className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px]">
        <button onClick={() => nav('/learn')} className="text-brand-600 hover:underline dark:text-brand-300">
          {t.learn.title}
        </button>
        <span className="text-slate-300 dark:text-faint">/</span>
        <span className="text-slate-500 dark:text-muted">
          {t.common.level} {levelIndex + 1} · {t.levels[meta.level].title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0 space-y-8">
          <header>
            <h1 className="balance text-[27px] font-bold leading-tight tracking-tight sm:text-[34px]">{cc.title}</h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600 dark:text-ink/75">{cc.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="brand">{t.common.level} {levelIndex + 1}</Badge>
              <Badge tone="neutral">
                <Clock size={10} /> {meta.minutes} {t.common.minutes}
              </Badge>
              <Tabs
                size="sm"
                value={detail}
                onChange={setDetail}
                className="ml-auto"
                tabs={[
                  { id: 'simple', label: t.common.simple },
                  { id: 'technical', label: t.common.technical },
                ]}
              />
            </div>
          </header>

          <section className="reading">
            {(detail === 'simple' ? cc.simple : cc.technical).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          <section>
            <div className="eyebrow mb-3 text-brand-500 dark:text-brand-300">{t.common.tryIt}</div>
            <VizFor id={meta.viz} />
          </section>

          <Note tone="teal" title={t.common.example}>
            {cc.example}
          </Note>

          <section>
            <h2 className="mb-3 text-[15px] font-semibold tracking-tight">{t.common.terminology}</h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              {cc.terms.map((term) => (
                <div key={term.t} className="rounded-[12px] border border-slate-200 p-3 dark:border-hairline">
                  <dt className="font-mono text-[12px] font-semibold text-brand-600 dark:text-brand-300">{term.t}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-muted">{term.d}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Note tone="violet" title={t.common.takeaway}>
            {cc.takeaway}
          </Note>

          {/* Footer actions */}
          <section className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-hairline">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={isDone ? 'secondary' : 'primary'}
                onClick={() => toggleDone(meta.id)}
                leading={isDone ? <Check size={15} /> : undefined}
              >
                {isDone ? t.common.markIncomplete : t.common.markComplete}
              </Button>
              <Button variant="ghost" onClick={() => nav('/quiz')} leading={<GraduationCap size={15} />}>
                {t.learn.quizCta}
              </Button>
            </div>

            <div className="flex flex-wrap items-stretch justify-between gap-3">
              {prev ? (
                <button onClick={() => nav(`/learn/${prev.id}`)} className="lift flex min-w-[45%] flex-1 items-center gap-3 rounded-[12px] border border-slate-200 p-3 text-left dark:border-hairline">
                  <ArrowLeft size={15} className="shrink-0 text-slate-400" />
                  <span className="min-w-0">
                    <span className="eyebrow block text-slate-400 dark:text-faint">{t.learn.prevConcept}</span>
                    <span className="block truncate text-[13.5px] font-medium">{c.concepts[prev.id].title}</span>
                  </span>
                </button>
              ) : (
                <span className="min-w-[45%] flex-1" />
              )}
              {next && (
                <button onClick={() => nav(`/learn/${next.id}`)} className="lift flex min-w-[45%] flex-1 items-center justify-end gap-3 rounded-[12px] border border-slate-200 p-3 text-right dark:border-hairline">
                  <span className="min-w-0">
                    <span className="eyebrow block text-slate-400 dark:text-faint">{t.learn.nextConcept}</span>
                    <span className="block truncate text-[13.5px] font-medium">{c.concepts[next.id].title}</span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-brand-500" />
                </button>
              )}
            </div>
          </section>
        </article>

        {/* Aside */}
        <aside className="space-y-4 lg:sticky lg:top-[5.5rem] lg:self-start">
          <Card className="p-4">
            <div className="eyebrow mb-2.5 text-slate-500 dark:text-faint">{t.learn.inThisLevel}</div>
            <ul className="space-y-0.5">
              {siblings.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => nav(`/learn/${s.id}`)}
                    aria-current={s.id === meta.id ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors',
                      s.id === meta.id ? 'bg-brand-500/12 font-medium text-brand-700 dark:text-brand-200' : 'text-slate-600 hover:bg-slate-100 dark:text-muted dark:hover:bg-raised',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', progress.done.includes(s.id) ? 'bg-teal-500' : 'bg-slate-300 dark:bg-edge')} />
                    <span className="min-w-0 truncate">{c.concepts[s.id].title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <div className="eyebrow mb-2.5 text-slate-500 dark:text-faint">{t.common.related}</div>
            <div className="flex flex-wrap gap-1.5">
              {meta.related.map((r) => (
                <button
                  key={r}
                  onClick={() => nav(`/learn/${r}`)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] transition-colors hover:bg-slate-200 dark:bg-raised dark:hover:bg-overlay"
                >
                  {c.concepts[r].title}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="eyebrow mb-2.5 text-slate-500 dark:text-faint">{t.glossary.title}</div>
            <ul className="space-y-1">
              {meta.glossary.map((g) => (
                <li key={g}>
                  <button onClick={() => nav(`/glossary/${g}`)} className="flex w-full items-center gap-2 text-left text-[13px] text-slate-600 hover:text-brand-600 dark:text-muted dark:hover:text-brand-300">
                    <BookMarked size={12} className="shrink-0 opacity-60" />
                    <span className="min-w-0 truncate">{c.glossary[g].term}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
