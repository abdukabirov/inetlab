import { ArrowRight, Boxes, Building2, Cable, Globe2, Laptop, Layers, Route as RouteIcon, Server, Shield, Sparkles, Waypoints } from 'lucide-react';
import { useApp } from '../app/state';
import { CONCEPTS, LEVELS, conceptsInLevel } from '../content/curriculum';
import { TOPOLOGIES } from '../content/topology';
import { InternetMap } from '../components/map/InternetMap';
import { Badge, Button, Card, Progress, Section, Stat } from '../components/ui';
import { cn } from '../utils/cn';

export function HomePage() {
  const { t, c, nav, progress } = useApp();
  const done = progress.done.length;
  const pct = done / CONCEPTS.length;

  const chain = [
    { key: 'device', icon: <Laptop size={17} />, to: '/learn/mac-ethernet' },
    { key: 'wifi', icon: <Waypoints size={17} />, to: '/learn/mac-ethernet' },
    { key: 'router', icon: <RouteIcon size={17} />, to: '/learn/router' },
    { key: 'isp', icon: <Building2 size={17} />, to: '/learn/isp' },
    { key: 'dns', icon: <Globe2 size={17} />, to: '/learn/dns' },
    { key: 'transport', icon: <Layers size={17} />, to: '/learn/tcp' },
    { key: 'internet', icon: <Shield size={17} />, to: '/learn/bgp' },
    { key: 'cdn', icon: <Boxes size={17} />, to: '/learn/cdn' },
    { key: 'server', icon: <Server size={17} />, to: '/learn/datacenter' },
  ] as const;

  const facts = [
    { t: t.home.facts.f1t, d: t.home.facts.f1d, icon: <Cable size={16} /> },
    { t: t.home.facts.f2t, d: t.home.facts.f2d, icon: <Waypoints size={16} /> },
    { t: t.home.facts.f3t, d: t.home.facts.f3d, icon: <Globe2 size={16} /> },
    { t: t.home.facts.f4t, d: t.home.facts.f4d, icon: <Shield size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-[1180px] space-y-16 pb-6">
      {/* Hero */}
      <section className="aurora relative overflow-hidden rounded-[22px] border border-slate-200 bg-white px-6 py-12 dark:border-hairline dark:bg-surface sm:px-10 sm:py-16">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative max-w-3xl">
          <Badge tone="brand" className="mb-4">
            <Sparkles size={11} /> {t.home.badge}
          </Badge>
          <h1 className="balance text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[46px]">{t.home.heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-ink/75 sm:text-[16.5px]">{t.home.heroLead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="primary" onClick={() => nav('/map')} trailing={<ArrowRight size={16} />}>
              {t.home.ctaPrimary}
            </Button>
            <Button size="lg" onClick={() => nav('/journey')}>{t.home.ctaSecondary}</Button>
            <Button size="lg" variant="ghost" onClick={() => nav('/learn')}>{t.home.ctaLearn}</Button>
          </div>

          {done > 0 && (
            <div className="mt-8 max-w-sm rounded-[14px] border border-slate-200 bg-white/70 p-3.5 backdrop-blur dark:border-hairline dark:bg-raised/70">
              <div className="mb-2 flex items-center justify-between text-[12px]">
                <span className="font-medium">{t.learn.yourProgress}</span>
                <span className="font-mono text-slate-500 dark:text-muted">{done}/{CONCEPTS.length}</span>
              </div>
              <Progress value={pct} label={t.a11y.progressBar} />
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat value={CONCEPTS.length} label={t.home.stats.concepts} />
        <Stat value={LEVELS.length} label={t.home.stats.levels} />
        <Stat value={16} label={t.home.stats.interactive} />
        <Stat value={3} label={t.home.stats.languages} />
      </section>

      {/* Chain */}
      <Section eyebrow="01" title={t.home.chainTitle} lead={t.home.chainLead}>
        <ol className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {chain.map((step, i) => (
            <li key={step.key}>
              <button
                onClick={() => nav(step.to)}
                className="lift group flex h-full w-full flex-col items-start gap-2 rounded-[14px] border border-slate-200 bg-white p-3.5 text-left hover:border-brand-400/60 dark:border-hairline dark:bg-surface"
              >
                <span className="flex w-full items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-brand-500/10 text-brand-500">{step.icon}</span>
                  <span className="font-mono text-[10px] text-slate-300 dark:text-faint">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className="text-[13.5px] font-medium leading-snug">{t.home.chain[step.key]}</span>
              </button>
            </li>
          ))}
        </ol>
      </Section>

      {/* Map preview */}
      <Section
        eyebrow="02"
        title={t.home.mapTitle}
        lead={t.home.mapLead}
        actions={<Button onClick={() => nav('/map')} trailing={<ArrowRight size={15} />}>{t.home.mapCta}</Button>}
      >
        <div className="overflow-hidden rounded-[16px]">
          <InternetMap
            topology={TOPOLOGIES.l1}
            selected={null}
            onSelect={(id) => nav(`/map/l1/${id}`)}
            pathIds={['device', 'router', 'isp', 'internet', 'server']}
            height={320}
            compact
          />
        </div>
      </Section>

      {/* Journey + Learn */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/12 text-amber-500">
            <RouteIcon size={19} />
          </span>
          <h3 className="mt-4 text-lg font-semibold tracking-tight">{t.home.journeyTitle}</h3>
          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-600 dark:text-muted">{t.home.journeyLead}</p>
          <Button className="mt-5 self-start" onClick={() => nav('/journey')} trailing={<ArrowRight size={15} />}>
            {t.home.journeyCta}
          </Button>
        </Card>

        <Card className="flex flex-col p-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/12 text-teal-500">
            <Layers size={19} />
          </span>
          <h3 className="mt-4 text-lg font-semibold tracking-tight">{t.home.learnTitle}</h3>
          <p className="mt-2 flex-1 text-[14px] leading-relaxed text-slate-600 dark:text-muted">{t.home.learnLead}</p>
          <Button className="mt-5 self-start" onClick={() => nav('/learn')} trailing={<ArrowRight size={15} />}>
            {t.home.learnCta}
          </Button>
        </Card>
      </div>

      {/* Levels */}
      <Section eyebrow="03" title={t.learn.title} lead={t.learn.lead}>
        <ol className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((lv, i) => {
            const items = conceptsInLevel(lv);
            const finished = items.filter((x) => progress.done.includes(x.id)).length;
            return (
              <li key={lv}>
                <button
                  onClick={() => nav(`/learn/${items[0].id}`)}
                  className="lift flex h-full w-full flex-col rounded-[14px] border border-slate-200 bg-white p-4 text-left hover:border-brand-400/60 dark:border-hairline dark:bg-surface"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-brand-500">{t.common.level} {i + 1}</span>
                    <span className={cn('font-mono text-[10.5px]', finished === items.length ? 'text-teal-500' : 'text-slate-400 dark:text-faint')}>
                      {finished}/{items.length}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[14.5px] font-semibold leading-snug">{t.levels[lv].title}</div>
                  <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-slate-500 dark:text-muted">{t.levels[lv].desc}</p>
                  <Progress className="mt-3" value={items.length ? finished / items.length : 0} />
                </button>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Facts */}
      <Section eyebrow="04" title={t.home.factsTitle}>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {facts.map((f) => (
            <Card key={f.t} className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-raised dark:text-muted">{f.icon}</span>
                <div>
                  <div className="text-[14px] font-semibold">{f.t}</div>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-muted">{f.d}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Honesty */}
      <section className="rounded-[18px] border border-violet-500/35 bg-violet-500/[0.06] px-6 py-7">
        <div className="eyebrow mb-2 text-violet-600 dark:text-violet-300">{t.common.simulated}</div>
        <h3 className="text-lg font-semibold tracking-tight">{t.home.honestTitle}</h3>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-slate-600 dark:text-ink/80">{t.home.honestBody}</p>
      </section>

      {/* Final CTA */}
      <section className="flex flex-col items-center gap-4 rounded-[18px] border border-slate-200 bg-white px-6 py-10 text-center dark:border-hairline dark:bg-surface">
        <h3 className="balance max-w-lg text-xl font-semibold tracking-tight sm:text-2xl">{c.concepts.internet.tagline}</h3>
        <Button size="lg" variant="primary" onClick={() => nav(`/learn/${progress.last ?? CONCEPTS[0].id}`)} trailing={<ArrowRight size={16} />}>
          {progress.done.length ? t.common.continue : t.common.startLearning}
        </Button>
      </section>
    </div>
  );
}
