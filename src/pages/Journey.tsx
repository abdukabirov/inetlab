import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { useApp } from '../app/state';
import { JOURNEY, LAYER_ORDER } from '../content/journey';
import { TOPOLOGIES, nodeLabel } from '../content/topology';
import { Badge, Button, Card, KeyValue, Note, Progress, Tabs } from '../components/ui';
import { NodeGlyph } from '../components/map/InternetMap';
import { cn } from '../utils/cn';
import type { ConceptId } from '../i18n/content-en';

const SPEEDS = { slow: 3200, normal: 2000, fast: 1100 } as const;
type Speed = keyof typeof SPEEDS;

export function JourneyPage() {
  const { t, c, nav, reduceMotion, detail, setDetail } = useApp();
  const topo = TOPOLOGIES.l2;
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('normal');

  const steps = JOURNEY;
  const step = steps[stage];
  const copy = c.journey[step.key];

  useEffect(() => {
    if (!playing) return;
    if (stage >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStage((s) => s + 1), reduceMotion ? 500 : SPEEDS[speed]);
    return () => window.clearTimeout(id);
  }, [playing, stage, steps.length, speed, reduceMotion]);

  const nodeName = (id: string) => {
    const n = topo.nodes.find((x) => x.id === id);
    return n ? nodeLabel(n, t, c) : id;
  };
  const nodeKind = (id: string) => topo.nodes.find((x) => x.id === id)?.kind ?? 'device';

  const finished = stage === steps.length - 1;
  const progressValue = (stage + 1) / steps.length;

  const timeline = useMemo(
    () =>
      steps.map((s, i) => ({
        i,
        title: c.journey[s.key].title,
        from: s.from,
        done: i < stage,
        active: i === stage,
      })),
    [steps, stage, c],
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">{t.journey.title}</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600 dark:text-muted">{t.journey.lead}</p>
        </div>
        <Badge tone="violet">{t.common.simulated}</Badge>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 dark:border-hairline dark:bg-surface">
        <Button size="sm" onClick={() => { setStage(0); setPlaying(false); }} aria-label={t.common.restart} leading={<RotateCcw size={13} />}>
          <span className="hidden sm:inline">{t.common.restart}</span>
        </Button>
        <Button size="sm" onClick={() => { setPlaying(false); setStage((s) => Math.max(0, s - 1)); }} disabled={stage === 0} aria-label={t.common.previous}>
          <SkipBack size={14} />
        </Button>
        <Button size="sm" variant="primary" onClick={() => (finished ? (setStage(0), setPlaying(true)) : setPlaying((p) => !p))} aria-label={playing ? t.common.pause : t.common.play}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          <span className="hidden sm:inline">{playing ? t.common.pause : t.common.play}</span>
        </Button>
        <Button size="sm" onClick={() => setStage((s) => Math.min(steps.length - 1, s + 1))} disabled={finished} aria-label={t.common.next}>
          <SkipForward size={14} />
        </Button>

        <span className="ml-1 font-mono text-[11.5px] tabular-nums text-slate-500 dark:text-muted">
          {t.common.step} {stage + 1} {t.common.of} {steps.length}
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Tabs
            size="sm"
            value={speed}
            onChange={setSpeed}
            tabs={[
              { id: 'slow', label: t.journey.slow },
              { id: 'normal', label: t.journey.normal },
              { id: 'fast', label: t.journey.fast },
            ]}
          />
          <Tabs
            size="sm"
            value={detail}
            onChange={setDetail}
            tabs={[
              { id: 'simple', label: t.common.simple },
              { id: 'technical', label: t.common.technical },
            ]}
          />
        </div>
      </div>

      <Progress value={progressValue} label={t.journey.stage} />

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Timeline */}
        <ol className="order-2 space-y-1 lg:order-1">
          {timeline.map((item) => (
            <li key={item.i}>
              <button
                onClick={() => { setPlaying(false); setStage(item.i); }}
                aria-current={item.active ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[10px] border px-3 py-2 text-left text-[13px] transition-colors',
                  item.active
                    ? 'border-brand-500 bg-brand-500/10 font-medium'
                    : item.done
                      ? 'border-transparent text-slate-500 hover:bg-slate-50 dark:text-muted dark:hover:bg-raised'
                      : 'border-transparent text-slate-400 hover:bg-slate-50 dark:text-faint dark:hover:bg-raised',
                )}
              >
                <span
                  className={cn(
                    'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-mono',
                    item.active ? 'bg-brand-500 text-white' : item.done ? 'bg-teal-500/20 text-teal-600 dark:text-teal-300' : 'bg-slate-100 text-slate-400 dark:bg-raised dark:text-faint',
                  )}
                >
                  {item.done ? <Check size={11} /> : item.i + 1}
                </span>
                <span className="min-w-0 truncate">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Stage detail */}
        <div className="order-1 space-y-4 lg:order-2">
          <Card className="overflow-hidden">
            {/* hop visual */}
            <div className="dot-grid flex items-center justify-center gap-3 border-b border-slate-100 px-5 py-7 dark:border-hairline/80 sm:gap-6">
              <HopNode label={nodeName(step.from)} kind={nodeKind(step.from)} />
              <div className="relative flex min-w-[70px] flex-1 items-center sm:min-w-[120px]">
                <span className="h-px w-full bg-gradient-to-r from-brand-500/30 via-brand-500 to-brand-500/30" />
                <span
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 rounded-md bg-brand-500 px-2 py-1 font-mono text-[10px] font-semibold text-white shadow-[0_0_12px_rgba(43,116,245,0.6)]',
                    !reduceMotion && 'rise',
                  )}
                  key={stage}
                >
                  {step.key.toUpperCase()}
                </span>
              </div>
              <HopNode label={nodeName(step.to)} kind={nodeKind(step.to)} />
            </div>

            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{copy.title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-700 dark:text-ink/85">{detail === 'technical' ? copy.why : copy.what}</p>
              </div>

              {detail === 'simple' && (
                <Note tone="brand" title={t.journey.whyHop}>
                  {copy.why}
                </Note>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.journey.layers}</div>
                  <div className="space-y-0.5">
                    {LAYER_ORDER.map((l) => {
                      const on = step.layers.includes(l.id);
                      return (
                        <div
                          key={l.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md border-l-2 px-2 py-1 font-mono text-[10.5px]',
                            on ? 'border-brand-500 bg-brand-500/10' : 'border-transparent text-slate-400 dark:text-faint/70',
                          )}
                        >
                          <span className={cn('h-1.5 w-1.5 rounded-full', on ? 'bg-brand-500' : 'bg-slate-300 dark:bg-edge')} />
                          <span className="w-[86px]">{l.label}</span>
                          <span className="truncate opacity-70">{l.hint}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {step.fields?.length ? (
                    <div>
                      <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{t.journey.headers}</div>
                      <KeyValue rows={step.fields.map((f) => ({ k: f.k, v: f.v }))} />
                    </div>
                  ) : null}

                  {step.changes?.length ? (
                    <div className="rounded-xl border border-l-[3px] border-amber-500/45 bg-amber-500/[0.07] px-3 py-2.5">
                      <div className="eyebrow mb-2 text-amber-700 dark:text-amber-300">{t.journey.changes}</div>
                      <div className="space-y-1.5">
                        {step.changes.map((ch) => (
                          <div key={ch.field} className="font-mono text-[11px]">
                            <div className="mb-0.5 text-slate-500 dark:text-muted">{ch.field}</div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded bg-rose-500/12 px-1.5 py-0.5 text-rose-600 dark:text-rose-300">{ch.before}</span>
                              <ArrowRight size={10} className="text-slate-400" />
                              <span className="rounded bg-emerald-500/12 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-300">{ch.after}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {step.concept && (
                <Button variant="secondary" onClick={() => nav(`/learn/${step.concept}`)} trailing={<ArrowRight size={14} />}>
                  {c.concepts[step.concept as ConceptId]?.title ?? t.common.learnMore}
                </Button>
              )}
            </div>
          </Card>

          {finished && (
            <Note tone="teal" title={t.common.completed}>
              {t.journey.finished}
            </Note>
          )}
        </div>
      </div>
    </div>
  );
}

function HopNode({ label, kind }: { label: string; kind: Parameters<typeof NodeGlyph>[0]['kind'] }) {
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-28">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-brand-500 shadow-sm dark:border-edge dark:bg-raised">
        <NodeGlyph kind={kind} size={20} />
      </span>
      <span className="text-[11.5px] font-medium leading-tight">{label}</span>
    </div>
  );
}
