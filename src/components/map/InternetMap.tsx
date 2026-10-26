import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cloud, Boxes, Globe2, Laptop, Network, Route as RouteIcon, Server, Shield, Shuffle, BookOpen, Anchor, Building2, Crosshair, Minus, Plus } from 'lucide-react';
import type { MapNode, MapTopology, NodeKind, LinkKind } from '../../content/topology';
import { nodeLabel } from '../../content/topology';
import { useApp } from '../../app/state';
import { cn } from '../../utils/cn';

export const NODE_ACCENT: Record<NodeKind, string> = {
  device: '#4e97ff',
  switch: '#2dd4bf',
  router: '#a78bfa',
  firewall: '#fb7185',
  isp: '#818cf8',
  internet: '#2dd4bf',
  dns: '#fbbf24',
  server: '#34d399',
  ixp: '#22d3ee',
  as: '#c084fc',
  cdn: '#f472b6',
  cloud: '#a78bfa',
  datacenter: '#34d399',
  landing: '#fbbf24',
};

const LINK_STYLE: Record<LinkKind, { stroke: string; dash?: string; w: number }> = {
  wifi: { stroke: '#64748b', dash: '2 5', w: 1.6 },
  lan: { stroke: '#64748b', w: 1.6 },
  access: { stroke: '#8ea0b5', w: 1.8 },
  fiber: { stroke: '#4e97ff', w: 1.8 },
  transit: { stroke: '#fbbf24', w: 2 },
  peer: { stroke: '#34d399', w: 2 },
  submarine: { stroke: '#22d3ee', dash: '9 6', w: 2.2 },
  logical: { stroke: '#8ea0b5', dash: '2 4', w: 1.3 },
};

export function NodeGlyph({ kind, size = 18 }: { kind: NodeKind; size?: number }) {
  const p = { size, strokeWidth: 1.7 };
  switch (kind) {
    case 'device': return <Laptop {...p} />;
    case 'switch': return <Shuffle {...p} />;
    case 'router': return <RouteIcon {...p} />;
    case 'firewall': return <Shield {...p} />;
    case 'isp': return <Building2 {...p} />;
    case 'internet': return <Globe2 {...p} />;
    case 'dns': return <BookOpen {...p} />;
    case 'server': return <Server {...p} />;
    case 'ixp': return <Network {...p} />;
    case 'as': return <Network {...p} />;
    case 'cdn': return <Boxes {...p} />;
    case 'cloud': return <Cloud {...p} />;
    case 'datacenter': return <Boxes {...p} />;
    case 'landing': return <Anchor {...p} />;
  }
}

export interface FlyingPacket {
  id: string;
  from: string;
  to: string;
  label?: string;
  tone?: string;
}

interface Props {
  topology: MapTopology;
  selected: string | null;
  onSelect: (id: string) => void;
  activeIds?: string[];
  pathIds?: string[];
  visitedIds?: string[];
  packet?: FlyingPacket | null;
  height?: number;
  className?: string;
  compact?: boolean;
}

const VB_W = 1040;
const VB_H = 500;
const MIN_K = 0.6;
const MAX_K = 3;

function InternetMapInner({ topology, selected, onSelect, activeIds = [], pathIds = [], visitedIds = [], packet, height = 460, className, compact }: Props) {
  const { t, c, reduceMotion } = useApp();
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const byId = useMemo(() => new Map(topology.nodes.map((n) => [n.id, n])), [topology]);

  // reset the viewport when the level changes
  useEffect(() => setView({ x: 0, y: 0, k: 1 }), [topology.level]);

  const clamp = useCallback((v: { x: number; y: number; k: number }) => {
    const limit = 220;
    return { k: Math.min(MAX_K, Math.max(MIN_K, v.k)), x: Math.max(-limit, Math.min(limit, v.x)), y: Math.max(-limit, Math.min(limit, v.y)) };
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width;
      const fy = (e.clientY - r.top) / r.height;
      setView((v) => {
        const k2 = Math.min(MAX_K, Math.max(MIN_K, v.k * (e.deltaY < 0 ? 1.12 : 0.9)));
        // keep the graph point under the cursor stationary
        const gx = v.x + (VB_W - VB_W / v.k) / 2 + (fx * VB_W) / v.k;
        const gy = v.y + (VB_H - VB_H / v.k) / 2 + (fy * VB_H) / v.k;
        return clamp({ k: k2, x: gx - (VB_W - VB_W / k2) / 2 - (fx * VB_W) / k2, y: gy - (VB_H - VB_H / k2) / 2 - (fy * VB_H) / k2 });
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [clamp]);

  const viewBox = useMemo(() => {
    const w = VB_W / view.k;
    const h = VB_H / view.k;
    return `${view.x + (VB_W - w) / 2} ${view.y + (VB_H - h) / 2} ${w} ${h}`;
  }, [view]);

  const zoom = (f: number) => setView((v) => clamp({ ...v, k: v.k * f }));
  const pan = (dx: number, dy: number) => setView((v) => clamp({ ...v, x: v.x + dx / v.k, y: v.y + dy / v.k }));
  const reset = () => setView({ x: 0, y: 0, k: 1 });

  const pathEdges = useMemo(() => {
    const s = new Set<string>();
    for (let i = 0; i < pathIds.length - 1; i++) {
      s.add(`${pathIds[i]}~${pathIds[i + 1]}`);
      s.add(`${pathIds[i + 1]}~${pathIds[i]}`);
    }
    return s;
  }, [pathIds]);

  const packetPos = useMemo(() => {
    if (!packet) return null;
    const a = byId.get(packet.from);
    const b = byId.get(packet.to);
    if (!a || !b) return null;
    return a.id === b.id ? { x: a.x, y: a.y - 40 } : { x: b.x, y: b.y };
  }, [packet, byId]);

  return (
    <div className={cn('relative overflow-hidden rounded-[14px] border border-slate-200 bg-white dark:border-hairline dark:bg-surface', className)}>
      <div
        ref={wrap}
        className={cn('dot-grid relative touch-none select-none', drag.current ? 'cursor-grabbing' : 'cursor-grab')}
        style={{ height }}
        role="application"
        aria-label={t.a11y.mapRegion}
        tabIndex={0}
        onKeyDown={(e) => {
          const s = 70;
          if (e.key === 'ArrowLeft') pan(s, 0);
          else if (e.key === 'ArrowRight') pan(-s, 0);
          else if (e.key === 'ArrowUp') pan(0, s);
          else if (e.key === 'ArrowDown') pan(0, -s);
          else if (e.key === '+' || e.key === '=') zoom(1.2);
          else if (e.key === '-' || e.key === '_') zoom(1 / 1.2);
          else if (e.key === '0') reset();
          else return;
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          if ((e.target as Element).closest('[data-node]')) return;
          (e.currentTarget as Element).setPointerCapture(e.pointerId);
          drag.current = { px: e.clientX, py: e.clientY, ox: view.x, oy: view.y };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !wrap.current) return;
          const r = wrap.current.getBoundingClientRect();
          const scale = Math.min(r.width / (VB_W / view.k), r.height / (VB_H / view.k));
          setView((v) => clamp({ ...v, x: d.ox - (e.clientX - d.px) / scale, y: d.oy - (e.clientY - d.py) / scale }));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <svg viewBox={viewBox} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" className="text-slate-700 dark:text-ink">
          {/* links */}
          {topology.links.map((l) => {
            const a = byId.get(l.a);
            const b = byId.get(l.b);
            if (!a || !b) return null;
            const st = LINK_STYLE[l.kind];
            const on = pathEdges.has(l.id);
            const animate = !reduceMotion && (on || l.kind === 'submarine' || l.kind === 'peer');
            return (
              <g key={l.id}>
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={on ? '#2b74f5' : st.stroke}
                  strokeOpacity={on ? 1 : 0.55}
                  strokeWidth={on ? st.w + 1 : st.w}
                  strokeLinecap="round"
                  strokeDasharray={st.dash}
                  className={animate ? 'flow' : undefined}
                />
                {l.ms !== undefined && !compact && (
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="9.5" fontFamily="var(--font-mono)" fill={on ? '#2b74f5' : 'currentColor'} opacity={on ? 1 : 0.5}>
                    {l.ms} ms
                  </text>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {topology.nodes.map((n) => (
            <NodeMark
              key={n.id}
              node={n}
              label={nodeLabel(n, t, c)}
              region={n.region ? t.places[n.region] : undefined}
              selected={selected === n.id}
              active={activeIds.includes(n.id)}
              visited={visitedIds.includes(n.id)}
              onSelect={onSelect}
              showIp={view.k > 1.25 && !compact}
              reduceMotion={reduceMotion}
            />
          ))}

          {/* packet */}
          {packet && packetPos && (
            <g transform={`translate(${packetPos.x}, ${packetPos.y})`} className={cn(!reduceMotion && 'glide', 'packet-glow')}>
              <rect x={-17} y={-10} width={34} height={20} rx={6} fill={packet.tone ?? '#fbbf24'} />
              {packet.label && (
                <text y={-17} textAnchor="middle" fontSize="10.5" fontWeight={700} fontFamily="var(--font-mono)" fill="currentColor">
                  {packet.label}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>

      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <MapBtn label={t.map.zoomIn} onClick={() => zoom(1.25)}><Plus size={14} /></MapBtn>
        <MapBtn label={t.map.zoomOut} onClick={() => zoom(1 / 1.25)}><Minus size={14} /></MapBtn>
        <MapBtn label={t.map.resetView} onClick={reset}><Crosshair size={14} /></MapBtn>
      </div>

      <div className="pointer-events-none absolute bottom-2.5 left-3.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-faint">
        {topology.nodes.length} {t.map.nodes} · {topology.links.length} {t.map.links} · {t.map.panHint}
      </div>
    </div>
  );
}

function MapBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-slate-900 dark:border-edge dark:bg-raised/90 dark:text-muted dark:hover:text-ink"
    >
      {children}
    </button>
  );
}

const NodeMark = memo(function NodeMark({
  node, label, region, selected, active, visited, onSelect, showIp, reduceMotion,
}: {
  node: MapNode; label: string; region?: string; selected: boolean; active: boolean; visited: boolean; onSelect: (id: string) => void; showIp: boolean; reduceMotion: boolean;
}) {
  const color = NODE_ACCENT[node.kind];
  return (
    <g
      data-node
      transform={`translate(${node.x}, ${node.y})`}
      className="cursor-pointer outline-none"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={label}
      onClick={() => onSelect(node.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node.id);
        }
      }}
    >
      {active && !reduceMotion && <circle r={30} fill={color} opacity={0.2} className="ring" />}
      {selected && <circle r={28} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 4" opacity={0.8} />}
      <circle r={21} className="fill-white dark:fill-raised" stroke={color} strokeWidth={selected ? 2.6 : 1.6} />
      <g transform="translate(-9,-9)" color={color}>
        <NodeGlyph kind={node.kind} />
      </g>
      {visited && (
        <g transform="translate(15,-16)">
          <circle r={6.5} fill="#34d399" />
          <path d="M-2.6 0 L-0.8 2.2 L2.6 -2.2" stroke="#06281c" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <text y={33} textAnchor="middle" fontSize="10.5" fontWeight={600} fill="currentColor">
        {label.length > 26 ? label.slice(0, 25) + '…' : label}
      </text>
      {region && (
        <text y={44} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill="currentColor" opacity={0.5}>
          {region}
        </text>
      )}
      {showIp && node.ifaces?.[0]?.ip && (
        <text y={region ? 55 : 44} textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono)" fill="currentColor" opacity={0.5}>
          {node.ifaces[0].ip}
        </text>
      )}
    </g>
  );
});

export const InternetMap = memo(InternetMapInner);
