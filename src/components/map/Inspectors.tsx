import { ArrowRight, Package } from 'lucide-react';
import type { MapNode, MapTopology } from '../../content/topology';
import { nodeLabel, nodeRole } from '../../content/topology';
import type { JourneyStep } from '../../content/journey';
import { LAYER_ORDER } from '../../content/journey';
import { useApp } from '../../app/state';
import { Button, KeyValue } from '../ui';
import { NodeGlyph, NODE_ACCENT } from './InternetMap';
import { cn } from '../../utils/cn';
import { CONCEPT_BY_ID } from '../../content/curriculum';
import type { ConceptId } from '../../i18n/content-en';

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-1.5 text-slate-500 dark:text-faint">{label}</div>
      {children}
    </div>
  );
}

export function NodeInspector({ node, topology }: { node: MapNode; topology: MapTopology }) {
  const { t, c, nav } = useApp();
  const color = NODE_ACCENT[node.kind];
  const label = nodeLabel(node, t, c);
  const role = nodeRole(node, c);
  const neighbours = topology.links
    .filter((l) => l.a === node.id || l.b === node.id)
    .map((l) => {
      const peer = topology.nodes.find((n) => n.id === (l.a === node.id ? l.b : l.a));
      return peer ? { label: nodeLabel(peer, t, c), kind: l.kind, ms: l.ms } : null;
    })
    .filter(Boolean) as { label: string; kind: string; ms?: number }[];

  const concept = node.concept ? CONCEPT_BY_ID.get(node.concept) : undefined;

  return (
    <div className="rise space-y-4 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" style={{ borderColor: color, color }}>
          <NodeGlyph kind={node.kind} size={19} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-tight tracking-tight">{label}</h3>
          {node.region && <div className="mt-1 text-xs text-slate-500 dark:text-muted">{t.places[node.region]}</div>}
        </div>
      </div>

      {role && (
        <Block label={t.map.role}>
          <p className="text-[13.5px] leading-relaxed text-slate-700 dark:text-ink/85">{role}</p>
        </Block>
      )}

      {node.ifaces?.length ? (
        <Block label={t.map.interfaces}>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-hairline">
            <table className="w-full font-mono text-[11px]">
              <tbody>
                {node.ifaces.map((i) => (
                  <tr key={i.name} className="border-b border-slate-100 last:border-0 dark:border-hairline/70">
                    <td className="bg-slate-50 px-2 py-1.5 align-top text-slate-500 dark:bg-raised dark:text-muted">{i.name}</td>
                    <td className="px-2 py-1.5">
                      {i.mac && <div className="text-slate-700 dark:text-ink/80">{i.mac}</div>}
                      {i.ip && <div className="text-brand-600 dark:text-brand-300">{i.ip}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      ) : null}

      {node.protocols?.length ? (
        <Block label={t.map.protocols}>
          <div className="flex flex-wrap gap-1">
            {node.protocols.map((p) => (
              <span key={p} className="rounded-md border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:border-edge dark:text-muted">
                {p}
              </span>
            ))}
          </div>
        </Block>
      ) : null}

      {neighbours.length > 0 && (
        <Block label={t.map.connections}>
          <ul className="space-y-1">
            {neighbours.map((n, i) => (
              <li key={i} className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-muted">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-edge" aria-hidden />
                <span className="min-w-0 truncate">{n.label}</span>
                {n.ms !== undefined && <span className="ml-auto shrink-0 font-mono text-[10px]">{n.ms} ms</span>}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {concept && (
        <Button variant="primary" className="w-full" onClick={() => nav(`/learn/${concept.id}`)} trailing={<ArrowRight size={14} />}>
          {t.common.seeConcept}
        </Button>
      )}
    </div>
  );
}

export function PacketInspector({ step, topology }: { step: JourneyStep | null; topology: MapTopology }) {
  const { t, c, nav, detail } = useApp();
  if (!step) {
    return <p className="p-6 text-center text-[13px] text-slate-500 dark:text-muted">{t.map.noPacket}</p>;
  }
  const copy = c.journey[step.key];
  const from = topology.nodes.find((n) => n.id === step.from);
  const to = topology.nodes.find((n) => n.id === step.to);

  return (
    <div className="rise space-y-4 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/60 text-amber-500">
          <Package size={18} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-tight tracking-tight">{copy.title}</h3>
          <div className="mt-1 truncate font-mono text-[11px] text-slate-500 dark:text-muted">
            {from ? nodeLabel(from, t, c) : step.from}
            {step.from !== step.to && ` → ${to ? nodeLabel(to, t, c) : step.to}`}
          </div>
        </div>
      </div>

      <Block label={t.journey.whatHappens}>
        <p className="text-[13.5px] leading-relaxed text-slate-700 dark:text-ink/85">{detail === 'technical' ? copy.why : copy.what}</p>
      </Block>

      {detail === 'simple' && (
        <Block label={t.journey.whyHop}>
          <p className="text-[13px] leading-relaxed text-slate-600 dark:text-muted">{copy.why}</p>
        </Block>
      )}

      <Block label={t.journey.layers}>
        <div className="space-y-0.5">
          {LAYER_ORDER.map((l) => {
            const on = step.layers.includes(l.id);
            return (
              <div
                key={l.id}
                className={cn(
                  'flex items-center gap-2 rounded-md border-l-2 px-2 py-1 font-mono text-[10.5px]',
                  on ? 'border-brand-500 bg-brand-500/10 text-slate-900 dark:text-ink' : 'border-transparent text-slate-400 dark:text-faint/70',
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', on ? 'bg-brand-500' : 'bg-slate-300 dark:bg-edge')} />
                <span className="w-24">{l.label}</span>
                <span className="truncate opacity-70">{l.hint}</span>
              </div>
            );
          })}
        </div>
      </Block>

      {step.fields?.length ? (
        <Block label={t.journey.headers}>
          <KeyValue rows={step.fields.map((f) => ({ k: f.k, v: f.v }))} />
        </Block>
      ) : null}

      {step.changes?.length ? (
        <div className="rounded-xl border border-l-[3px] border-amber-500/45 bg-amber-500/[0.07] px-3 py-2.5">
          <div className="eyebrow mb-2 text-amber-700 dark:text-amber-300">{t.journey.changes}</div>
          <div className="space-y-1.5">
            {step.changes.map((ch) => (
              <div key={ch.field} className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-2 gap-y-0.5 font-mono text-[11px]">
                <span className="text-slate-500 dark:text-muted">{ch.field}</span>
                <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="truncate rounded bg-rose-500/12 px-1.5 py-0.5 text-rose-600 dark:text-rose-300">{ch.before}</span>
                  <ArrowRight size={10} className="shrink-0 text-slate-400" />
                  <span className="truncate rounded bg-emerald-500/12 px-1.5 py-0.5 text-emerald-600 dark:text-emerald-300">{ch.after}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {step.concept && (
        <Button variant="secondary" className="w-full" onClick={() => nav(`/learn/${step.concept}`)} trailing={<ArrowRight size={14} />}>
          {c.concepts[step.concept as ConceptId]?.title ?? t.common.learnMore}
        </Button>
      )}
    </div>
  );
}

export function InspectorShell({ tab, onTab, children }: { tab: 'node' | 'packet'; onTab: (v: 'node' | 'packet') => void; children: React.ReactNode }) {
  const { t } = useApp();
  return (
    <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white dark:border-hairline dark:bg-surface">
      <div className="flex border-b border-slate-100 dark:border-hairline/80" role="tablist" aria-label={t.map.inspector}>
        {([['node', t.map.node], ['packet', t.map.packet]] as const).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={cn(
              'flex-1 border-b-2 px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors',
              tab === id ? 'border-brand-500 text-slate-900 dark:text-ink' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-muted dark:hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
