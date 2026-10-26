import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Pause, Play, RotateCcw, SkipBack, SkipForward, Square } from 'lucide-react';
import { useApp } from '../app/state';
import { MAP_LEVELS, TOPOLOGIES, findPath, nodeLabel, type MapLevel } from '../content/topology';
import { JOURNEY_BY_LEVEL } from '../content/journey';
import { InternetMap, type FlyingPacket } from '../components/map/InternetMap';
import { InspectorShell, NodeInspector, PacketInspector } from '../components/map/Inspectors';
import { Badge, Button, Tabs } from '../components/ui';
import { cn } from '../utils/cn';

const TONE_BY_KEY: Record<string, string> = {
  request: '#4e97ff',
  dns: '#fbbf24',
  connect: '#fb7185',
  frame: '#2dd4bf',
  route: '#a78bfa',
  nat: '#fbbf24',
  isp: '#818cf8',
  edge: '#f472b6',
  server: '#34d399',
  render: '#34d399',
};

export function MapExplorerPage({ level = 'l1', nodeId }: { level?: MapLevel; nodeId?: string }) {
  const { t, c, nav, reduceMotion } = useApp();
  const topology = TOPOLOGIES[level];
  const steps = JOURNEY_BY_LEVEL[level];

  const [selected, setSelected] = useState<string | null>(nodeId ?? topology.initial);
  const [stage, setStage] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState<'node' | 'packet'>('node');
  const [drawer, setDrawer] = useState(false);

  // Switching abstraction level resets the whole exploration…
  useEffect(() => {
    setSelected(topology.initial);
    setStage(-1);
    setPlaying(false);
    setTab('node');
  }, [level, topology.initial]);

  // …but selecting a node from the URL only moves the inspector.
  useEffect(() => {
    if (nodeId) setSelected(nodeId);
  }, [nodeId]);

  useEffect(() => {
    if (!playing) return;
    if (stage >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStage((s) => s + 1), reduceMotion ? 450 : 2000);
    return () => window.clearTimeout(id);
  }, [playing, stage, steps.length, reduceMotion]);

  const step = stage >= 0 ? steps[stage] : null;

  const packet: FlyingPacket | null = useMemo(() => {
    if (!step) return null;
    return { id: `${level}-${stage}`, from: step.from, to: step.to, label: step.key.toUpperCase().slice(0, 5), tone: TONE_BY_KEY[step.key] };
  }, [step, level, stage]);

  const pathIds = useMemo(() => {
    if (!step || step.from === step.to) return step ? [step.to] : [];
    const p = findPath(topology, step.from, step.to);
    return p.length ? p : [step.from, step.to];
  }, [step, topology]);

  const visited = stage >= 0 ? steps.slice(0, stage + 1).flatMap((s) => [s.from, s.to]) : [];
  const selectedNode = selected ? topology.nodes.find((n) => n.id === selected) ?? null : null;

  const start = () => {
    setStage(0);
    setPlaying(true);
    setTab('packet');
    setDrawer(true);
  };
  const stop = () => {
    setPlaying(false);
    setStage(-1);
    setTab('node');
  };

  const select = (id: string) => {
    setSelected(id);
    setTab('node');
    setDrawer(true);
    nav(`/map/${level}/${id}`);
  };

  const inspector = (
    <InspectorShell tab={tab} onTab={setTab}>
      {tab === 'node' ? (
        selectedNode ? (
          <NodeInspector node={selectedNode} topology={topology} />
        ) : (
          <p className="p-6 text-center text-[13px] text-slate-500 dark:text-muted">{t.map.selectNode}</p>
        )
      ) : (
        <PacketInspector step={step} topology={topology} />
      )}
    </InspectorShell>
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">{t.map.title}</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600 dark:text-muted">{t.map.lead}</p>
        </div>
        <Badge tone="violet">{t.common.simulated}</Badge>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={level}
          onChange={(lv) => nav(`/map/${lv}`)}
          tabs={MAP_LEVELS.map((lv) => ({ id: lv, label: <span className="whitespace-nowrap">{t.map.levels[lv]}</span> }))}
        />
        <div className="ml-auto flex items-center gap-1.5">
          {stage < 0 ? (
            <Button size="sm" variant="primary" onClick={start} leading={<Play size={13} />}>
              {t.journey.start}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={stop} leading={<Square size={12} />}>{t.journey.stop}</Button>
              <Button size="sm" onClick={() => { setPlaying(false); setStage((s) => Math.max(0, s - 1)); }} aria-label={t.common.previous}>
                <SkipBack size={13} />
              </Button>
              <Button size="sm" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t.common.pause : t.common.play}>
                {playing ? <Pause size={13} /> : <Play size={13} />}
              </Button>
              <Button size="sm" variant="primary" onClick={() => setStage((s) => Math.min(steps.length - 1, s + 1))} disabled={stage >= steps.length - 1} aria-label={t.common.next}>
                <SkipForward size={13} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setStage(0)} aria-label={t.common.restart}>
                <RotateCcw size={12} />
              </Button>
            </>
          )}
        </div>
      </div>

      <p className="text-[13px] text-slate-500 dark:text-muted">{t.map.levelHint[level]}</p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-3">
          <InternetMap
            topology={topology}
            selected={selected}
            onSelect={select}
            activeIds={step ? [step.from, step.to] : []}
            pathIds={pathIds}
            visitedIds={visited}
            packet={packet}
            height={480}
          />

          {stage >= 0 && (
            <ol className="flex gap-1.5 overflow-x-auto pb-1 thin-scroll" aria-label={t.journey.stage}>
              {steps.map((s, i) => (
                <li key={`${s.key}-${i}`} className="shrink-0">
                  <button
                    onClick={() => { setPlaying(false); setStage(i); setTab('packet'); }}
                    aria-current={i === stage ? 'step' : undefined}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] transition-colors',
                      i === stage
                        ? 'border-brand-500 bg-brand-500/10 font-medium text-slate-900 dark:text-ink'
                        : i < stage
                          ? 'border-teal-500/40 bg-teal-500/[0.06] text-slate-500 dark:text-muted'
                          : 'border-slate-200 text-slate-400 dark:border-hairline dark:text-faint',
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', i === stage ? 'bg-brand-500' : i < stage ? 'bg-teal-500' : 'bg-slate-300 dark:bg-edge')} />
                    {c.journey[s.key].title}
                  </button>
                </li>
              ))}
            </ol>
          )}

          {/* Mobile inspector */}
          <div className="lg:hidden">
            <button
              onClick={() => setDrawer((d) => !d)}
              aria-expanded={drawer}
              className="flex w-full items-center justify-between rounded-[14px] border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-medium dark:border-hairline dark:bg-surface"
            >
              <span>
                {t.map.inspector}
                {selectedNode && <span className="ml-2 text-slate-500 dark:text-muted">{nodeLabel(selectedNode, t, c)}</span>}
              </span>
              {drawer ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>
            {drawer && <div className="mt-2 max-h-[60vh] overflow-y-auto thin-scroll">{inspector}</div>}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[5.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto thin-scroll">{inspector}</div>
        </aside>
      </div>
    </div>
  );
}
