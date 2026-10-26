import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Send, Trash2 } from 'lucide-react';
import {
  calculateSubnet, classifyIPv4, ipInCidr, ipv4ToBinary, longestPrefixMatch, matchingRoutes,
  NatTable, parseIPv4, resolveDns, createTcpSim, tcpStep, type TcpSimState, COMMON_PORTS, buildEncapsulation,
} from '../../lib/network';
import { useApp } from '../../app/state';
import { Badge, Button, KeyValue, Note, Pill, Progress, Select, TextInput } from '../ui';
import { cn } from '../../utils/cn';

/* Shared layout for every interactive model. */
export function VizFrame({
  title, lead, children, actions, onReset,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onReset?: () => void;
}) {
  const { t } = useApp();
  return (
    <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white dark:border-hairline dark:bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-3 dark:border-hairline/80">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone="brand">{t.common.interactive}</Badge>
            <h3 className="truncate text-[13.5px] font-semibold tracking-tight">{title}</h3>
          </div>
          {lead && <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-muted">{lead}</p>}
        </div>
        {(actions || onReset) && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            {onReset && (
              <Button size="sm" variant="ghost" onClick={onReset} aria-label={t.common.reset} leading={<RotateCcw size={13} />}>
                <span className="hidden sm:inline">{t.common.reset}</span>
              </Button>
            )}
          </div>
        )}
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ── IP address explorer ─────────────────────────────────── */

export function IpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [ip, setIp] = useState('192.168.1.10');
  const octets = ipv4ToBinary(ip);
  const valid = parseIPv4(ip) !== null;
  const category = useMemo(() => {
    if (!valid) return v.ipInvalid;
    if (ipInCidr(ip, '127.0.0.0/8')) return v.ipLoopback;
    if (ipInCidr(ip, '169.254.0.0/16')) return v.ipLinkLocal;
    if (ipInCidr(ip, '224.0.0.0/4')) return v.ipMulticast;
    return classifyIPv4(ip).includes('private') ? v.ipPrivate : v.ipPublic;
  }, [ip, valid, v]);

  return (
    <VizFrame title={v.ipTitle} lead={v.ipLead}>
      <div className="flex flex-wrap items-center gap-2">
        <TextInput value={ip} onChange={(e) => setIp(e.target.value)} aria-label={v.ipAddress} className={cn('w-44', !valid && 'border-rose-500')} />
        {['192.168.1.10', '10.0.0.5', '127.0.0.1', '8.8.8.8', '203.0.113.5'].map((s) => (
          <Pill key={s} active={ip === s} onClick={() => setIp(s)}>
            <span className="font-mono text-[11px]">{s}</span>
          </Pill>
        ))}
      </div>
      {valid ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ip.split('.').map((o, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-2.5 text-center dark:border-hairline">
                <div className="font-mono text-xl font-bold text-brand-600 dark:text-brand-300">{o}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wider text-slate-500 dark:text-muted">{octets[i]}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[13px] dark:bg-raised">
            <span className="text-slate-500 dark:text-muted">{v.ipCategory}: </span>
            <span className="font-medium">{category}</span>
          </div>
        </>
      ) : (
        <p className="mt-3 text-[13px] text-rose-500">{v.ipInvalid}</p>
      )}
    </VizFrame>
  );
}

/* ── Subnet calculator ───────────────────────────────────── */

export function SubnetViz() {
  const { c } = useApp();
  const v = c.viz;
  const [prefix, setPrefix] = useState(24);
  const [base] = useState('192.168.1.0');
  const info = calculateSubnet(`${base}/${prefix}`);
  if (!info) return null;
  const bits = info.networkBinary;
  return (
    <VizFrame title={v.subnetTitle} lead={v.subnetLead}>
      <label className="flex items-center gap-3 text-sm">
        <span className="font-mono text-brand-600 dark:text-brand-300">/{prefix}</span>
        <input
          type="range" min={8} max={30} value={prefix}
          onChange={(e) => setPrefix(parseInt(e.target.value))}
          className="h-1.5 flex-1 accent-brand-500"
          aria-label={v.subnetMask}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {[0, 1, 2, 3].map((oi) => (
          <span key={oi} className="flex">
            {bits.slice(oi * 8, oi * 8 + 8).split('').map((b, i) => {
              const idx = oi * 8 + i;
              return (
                <span
                  key={i}
                  className={cn(
                    'flex h-7 w-[18px] items-center justify-center border-y border-l font-mono text-[11px] first:rounded-l-md last:rounded-r-md last:border-r',
                    idx < prefix
                      ? 'border-violet-400/60 bg-violet-500/15 text-violet-700 dark:text-violet-200'
                      : 'border-teal-400/60 bg-teal-500/15 text-teal-700 dark:text-teal-200',
                  )}
                >
                  {b}
                </span>
              );
            })}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-[11px]">
        <span className="text-violet-600 dark:text-violet-300">■ {prefix} {v.subnetNetBits}</span>
        <span className="text-teal-600 dark:text-teal-300">■ {32 - prefix} {v.subnetHostBits}</span>
      </div>
      <KeyValue
        className="mt-4"
        rows={[
          { k: v.subnetNetwork, v: info.network },
          { k: v.subnetMask, v: info.mask },
          { k: v.subnetBroadcast, v: info.broadcast },
          { k: v.subnetHosts, v: info.usableHosts.toLocaleString() },
          { k: v.subnetRange, v: `${info.firstHost} – ${info.lastHost}` },
        ]}
      />
    </VizFrame>
  );
}

/* ── DNS resolution ──────────────────────────────────────── */

export function DnsViz() {
  const { c, reduceMotion } = useApp();
  const v = c.viz;
  const cache = useRef(new Set<string>());
  const [host, setHost] = useState('example.com');
  const [steps, setSteps] = useState<{ from: string; to: string; text: string; cached?: boolean }[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [idx, setIdx] = useState(-1);

  const nodeName: Record<string, string> = { app: v.dnsStub, stub: v.dnsStub, resolver: v.dnsResolver, root: v.dnsRoot, tld: v.dnsTld, auth: v.dnsAuth };

  const run = () => {
    const r = resolveDns(host.trim() || 'example.com', 'A', cache.current);
    setSteps(r.steps.map((s) => ({ from: s.from, to: s.to, text: `${nodeName[s.from] ?? s.from} → ${nodeName[s.to] ?? s.to}`, cached: s.cached })));
    setAnswer(r.answer.find((x) => x.type === 'A')?.value ?? null);
    setIdx(0);
  };

  useEffect(() => {
    if (idx < 0 || idx >= steps.length - 1) return;
    const id = window.setTimeout(() => setIdx((i) => i + 1), reduceMotion ? 60 : 520);
    return () => window.clearTimeout(id);
  }, [idx, steps.length, reduceMotion]);

  const chain = [
    { id: 'stub', label: v.dnsStub },
    { id: 'resolver', label: v.dnsResolver },
    { id: 'root', label: v.dnsRoot },
    { id: 'tld', label: v.dnsTld },
    { id: 'auth', label: v.dnsAuth },
  ];
  const reached = new Set(steps.slice(0, idx + 1).flatMap((s) => [s.from, s.to]));
  const wasCached = steps.some((s) => s.cached);

  return (
    <VizFrame
      title={v.dnsTitle}
      lead={v.dnsLead}
      actions={
        <Button size="sm" variant="ghost" onClick={() => { cache.current.clear(); setSteps([]); setIdx(-1); setAnswer(null); }} leading={<Trash2 size={13} />}>
          {v.dnsFlush}
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <TextInput value={host} onChange={(e) => setHost(e.target.value)} aria-label={v.dnsQuery} className="w-52" />
        <Button size="sm" variant="primary" onClick={run} leading={<Send size={13} />}>{v.dnsResolve}</Button>
      </div>

      <ol className="mt-4 space-y-1.5">
        {chain.map((n, i) => {
          const on = reached.has(n.id) || (n.id === 'stub' && idx >= 0);
          const skipped = wasCached && i > 1;
          return (
            <li
              key={n.id}
              style={{ marginInlineStart: `${i * 14}px` }}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                on && !skipped ? 'border-brand-500/60 bg-brand-500/10' : 'border-slate-200 text-slate-400 dark:border-hairline dark:text-faint',
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', on && !skipped ? 'bg-brand-500' : 'bg-slate-300 dark:bg-edge')} />
              {n.label}
              {skipped && <span className="ml-auto font-mono text-[10px] uppercase text-teal-600 dark:text-teal-300">{v.dnsCached}</span>}
            </li>
          );
        })}
      </ol>

      {idx >= steps.length - 1 && answer && (
        <div className="rise mt-3 rounded-xl border border-teal-500/45 bg-teal-500/[0.08] px-3 py-2.5">
          <div className="eyebrow mb-1 text-teal-700 dark:text-teal-300">{v.dnsAnswer}</div>
          <div className="font-mono text-sm">{host} → {answer}</div>
        </div>
      )}
    </VizFrame>
  );
}

/* ── TCP handshake ───────────────────────────────────────── */

export function TcpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [sim, setSim] = useState<TcpSimState>(() => createTcpSim([120]));
  const [drop, setDrop] = useState(false);

  const step = () => {
    setSim((s) => tcpStep(s, drop));
    setDrop(false);
  };

  return (
    <VizFrame
      title={v.tcpTitle}
      lead={v.tcpLead}
      onReset={() => { setSim(createTcpSim([120])); setDrop(false); }}
      actions={
        <>
          <Button size="sm" variant={drop ? 'danger' : 'secondary'} onClick={() => setDrop((d) => !d)} aria-pressed={drop}>
            {v.tcpDropNext}
          </Button>
          <Button size="sm" variant="primary" onClick={step} disabled={sim.phase === 'closed'}>
            {v.tcpSend}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-hairline">
          <div className="eyebrow text-slate-500 dark:text-faint">{v.tcpClient}</div>
          <div className="mt-1 font-mono text-[12px] font-semibold text-brand-600 dark:text-brand-300">{sim.client}</div>
        </div>
        <div className="rounded-xl border border-slate-200 px-3 py-2 dark:border-hairline">
          <div className="eyebrow text-slate-500 dark:text-faint">{v.tcpServer}</div>
          <div className="mt-1 font-mono text-[12px] font-semibold text-teal-600 dark:text-teal-300">{sim.server}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {sim.segments.slice(-7).map((seg) => (
          <li
            key={seg.id}
            className={cn(
              'rise flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-[11.5px]',
              seg.lost ? 'bg-rose-500/12 text-rose-600 line-through dark:text-rose-300' : seg.direction === 'c2s' ? 'bg-brand-500/10' : 'bg-teal-500/10',
            )}
          >
            <span className="w-6 shrink-0 text-center">{seg.direction === 'c2s' ? '→' : '←'}</span>
            <span className="font-semibold">{seg.label}</span>
            <span className="ml-auto text-slate-500 dark:text-muted">seq={seg.seq} ack={seg.ack}</span>
          </li>
        ))}
        {sim.segments.length === 0 && <li className="text-[13px] text-slate-400 dark:text-faint">—</li>}
      </ul>

      {sim.log.length > 0 && (
        <Note tone="brand" className="mt-3">
          {sim.log[sim.log.length - 1].simple}
        </Note>
      )}
    </VizFrame>
  );
}

/* ── NAT table ───────────────────────────────────────────── */

export function NatViz() {
  const { c } = useApp();
  const v = c.viz;
  const natRef = useRef(new NatTable('203.0.113.5', 60231));
  const [rows, setRows] = useState(natRef.current.entries);
  const [blocked, setBlocked] = useState(false);
  const devices = [
    { ip: '192.168.1.10', port: 53124 },
    { ip: '192.168.1.11', port: 41002 },
    { ip: '192.168.1.12', port: 50220 },
  ];
  return (
    <VizFrame
      title={v.natTitle}
      lead={v.natLead}
      onReset={() => { natRef.current = new NatTable('203.0.113.5', 60231); setRows([]); setBlocked(false); }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{v.natPrivate}</div>
          <div className="space-y-1.5">
            {devices.map((d) => (
              <div key={d.ip} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-hairline">
                <span className="font-mono text-[11.5px]">{d.ip}:{d.port}</span>
                <Button
                  size="sm"
                  onClick={() => {
                    natRef.current.translateOutbound(d.ip, d.port, '93.184.215.14', 443);
                    setRows([...natRef.current.entries]);
                  }}
                >
                  {v.natSend}
                </Button>
              </div>
            ))}
            <Button size="sm" variant="secondary" className="w-full" onClick={() => setBlocked(true)}>
              {v.natInbound}
            </Button>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{v.natTable} · {v.natPublic} 203.0.113.5</div>
          {rows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-[12px] text-slate-400 dark:border-edge dark:text-faint">—</div>
          ) : (
            <ul className="space-y-1">
              {rows.map((e) => (
                <li key={e.publicPort} className="rise flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] dark:bg-raised">
                  <span className="text-brand-600 dark:text-brand-300">{e.privateIp}:{e.privatePort}</span>
                  <ArrowRight size={10} className="text-slate-400" />
                  <span className="text-teal-600 dark:text-teal-300">{e.publicIp}:{e.publicPort}</span>
                </li>
              ))}
            </ul>
          )}
          {blocked && (
            <Note tone="amber" className="mt-2">
              203.0.113.5:60999 — no matching entry, dropped.
            </Note>
          )}
        </div>
      </div>
    </VizFrame>
  );
}

/* ── Routing table / longest prefix ──────────────────────── */

const ROUTES = [
  { prefix: '0.0.0.0/0', nextHop: '203.0.113.1', iface: 'wan0' },
  { prefix: '192.168.1.0/24', nextHop: 'direct', iface: 'lan0' },
  { prefix: '10.0.0.0/8', nextHop: '10.255.0.1', iface: 'vpn0' },
  { prefix: '10.1.0.0/16', nextHop: '10.1.255.1', iface: 'vpn1' },
  { prefix: '10.1.2.0/24', nextHop: '10.1.2.254', iface: 'eth2' },
];

export function RoutingViz() {
  const { c } = useApp();
  const v = c.viz;
  const [dest, setDest] = useState('10.1.2.9');
  const valid = parseIPv4(dest) !== null;
  const matches = valid ? matchingRoutes(dest, ROUTES) : [];
  const best = valid ? longestPrefixMatch(dest, ROUTES) : null;
  return (
    <VizFrame title={v.routingTitle} lead={v.routingLead}>
      <div className="flex flex-wrap items-center gap-2">
        <TextInput value={dest} onChange={(e) => setDest(e.target.value)} aria-label={v.routingDest} className={cn('w-40', !valid && 'border-rose-500')} />
        {['10.1.2.9', '10.1.9.9', '10.9.9.9', '8.8.8.8'].map((d) => (
          <Pill key={d} active={dest === d} onClick={() => setDest(d)}>
            <span className="font-mono text-[11px]">{d}</span>
          </Pill>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-hairline">
        <table className="w-full text-left font-mono text-[11.5px]">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-raised dark:text-faint">
            <tr>
              <th className="px-3 py-2">{v.routingPrefix}</th>
              <th className="px-3 py-2">{v.routingNextHop}</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {[...ROUTES].sort((a, b) => parseInt(b.prefix.split('/')[1]) - parseInt(a.prefix.split('/')[1])).map((r) => {
              const isMatch = matches.includes(r);
              const isBest = best?.route === r;
              return (
                <tr key={r.prefix} className={cn('border-t border-slate-100 dark:border-hairline/70', isBest ? 'bg-teal-500/12' : isMatch ? 'bg-amber-500/10' : '')}>
                  <td className="px-3 py-1.5">{r.prefix}</td>
                  <td className="px-3 py-1.5 text-slate-500 dark:text-muted">{r.nextHop}</td>
                  <td className="px-3 py-1.5 text-right">
                    {isBest && <Badge tone="teal">{v.routingSelected}</Badge>}
                    {!isBest && isMatch && <span className="text-[10px] text-amber-600 dark:text-amber-300">{v.routingMatches}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Note tone={best ? 'teal' : 'amber'} className="mt-3">
        {best ? `${v.routingWinner} — ${best.route.prefix} → ${best.route.nextHop}` : v.routingNoRoute}
      </Note>
    </VizFrame>
  );
}

/* ── BGP policy ──────────────────────────────────────────── */

type Rel = 'customer' | 'peer' | 'provider';
const PREF: Record<Rel, number> = { customer: 200, peer: 100, provider: 80 };

export function BgpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [relA, setRelA] = useState<Rel>('provider');
  const [relB, setRelB] = useState<Rel>('peer');
  const relLabel: Record<Rel, string> = { customer: v.bgpCustomer, peer: v.bgpPeer, provider: v.bgpProvider };
  const routes = [
    { via: 'AS200', path: [200, 400, 600], pref: PREF[relA] },
    { via: 'AS300', path: [300, 500, 600], pref: PREF[relB] },
  ];
  const maxPref = Math.max(...routes.map((r) => r.pref));
  const top = routes.filter((r) => r.pref === maxPref);
  const best = top.length === 1 ? top[0] : [...top].sort((a, b) => a.path.length - b.path.length)[0];
  const reason = top.length === 1 ? v.bgpReasonPref : v.bgpReasonPath;

  return (
    <VizFrame title={v.bgpTitle} lead={v.bgpLead}>
      <div className="flex flex-wrap gap-3">
        <Select
          label="AS200"
          value={relA}
          onChange={setRelA}
          options={(['customer', 'peer', 'provider'] as Rel[]).map((r) => ({ value: r, label: `${relLabel[r]} (${PREF[r]})` }))}
        />
        <Select
          label="AS300"
          value={relB}
          onChange={setRelB}
          options={(['customer', 'peer', 'provider'] as Rel[]).map((r) => ({ value: r, label: `${relLabel[r]} (${PREF[r]})` }))}
        />
      </div>
      <div className="mt-4 space-y-2">
        {routes.map((r) => (
          <div
            key={r.via}
            className={cn(
              'flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-3 py-2.5 text-[12.5px]',
              best === r ? 'border-teal-500/60 bg-teal-500/[0.09]' : 'border-slate-200 dark:border-hairline',
            )}
          >
            <span className="font-mono font-semibold">{r.via}</span>
            <span className="font-mono text-slate-500 dark:text-muted">{v.bgpPath}: [{r.path.join(' ')}]</span>
            <span className="font-mono text-slate-500 dark:text-muted">{v.bgpPref}: {r.pref}</span>
            {best === r && <Badge tone="teal" className="ml-auto">{v.bgpChosen}</Badge>}
          </div>
        ))}
      </div>
      <Note tone="teal" className="mt-3">{reason}</Note>
    </VizFrame>
  );
}

/* ── CDN cache ───────────────────────────────────────────── */

export function CdnViz() {
  const { c, t } = useApp();
  const v = c.viz;
  const [cached, setCached] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<{ region: string; hit: boolean; ms: number }[]>([]);
  const regions = [
    { id: 'eu', label: t.places.europe, rtt: 90 },
    { id: 'na', label: t.places.northAmerica, rtt: 20 },
    { id: 'as', label: t.places.asia, rtt: 160 },
  ];
  const request = (id: string, label: string, rtt: number) => {
    const hit = !!cached[id];
    if (!hit) setCached((s) => ({ ...s, [id]: true }));
    setLog((l) => [{ region: label, hit, ms: hit ? 10 : 10 + rtt }, ...l].slice(0, 5));
  };
  return (
    <VizFrame
      title={v.cdnTitle}
      lead={v.cdnLead}
      onReset={() => { setCached({}); setLog([]); }}
    >
      <div className="grid gap-2 sm:grid-cols-3">
        {regions.map((r) => (
          <button
            key={r.id}
            onClick={() => request(r.id, r.label, r.rtt)}
            className={cn(
              'rounded-xl border px-3 py-3 text-left transition-colors',
              cached[r.id] ? 'border-teal-500/60 bg-teal-500/[0.09]' : 'border-slate-200 hover:border-slate-300 dark:border-hairline dark:hover:border-edge',
            )}
          >
            <div className="text-[13px] font-medium">{v.cdnUser} {r.label}</div>
            <div className="mt-1 font-mono text-[10.5px] text-slate-500 dark:text-muted">
              {cached[r.id] ? v.cdnEdge : v.cdnOrigin} · {r.rtt} ms
            </div>
            <div className="mt-2 text-[11px] text-brand-600 dark:text-brand-300">{v.cdnRequest} →</div>
          </button>
        ))}
      </div>
      {log.length > 0 && (
        <ul className="mt-3 space-y-1">
          {log.map((l, i) => (
            <li key={i} className={cn('rise rounded-lg px-3 py-1.5 text-[12px]', l.hit ? 'bg-teal-500/10' : 'bg-amber-500/10')}>
              <span className="font-medium">{l.region}</span>: {l.hit ? v.cdnHit : v.cdnMiss} · {v.cdnLatency} ≈ {l.ms} ms
            </li>
          ))}
        </ul>
      )}
    </VizFrame>
  );
}

/* ── Encapsulation ───────────────────────────────────────── */

const LAYER_TONES = ['#4e97ff', '#a78bfa', '#34d399', '#fbbf24', '#fb7185'];

export function PacketViz() {
  const { c } = useApp();
  const v = c.viz;
  const packet = useMemo(
    () =>
      buildEncapsulation({
        srcMac: '8C:85:90:1A:2B:3C', dstMac: 'AA:BB:CC:DD:EE:FF',
        srcIp: '192.168.1.10', dstIp: '93.184.215.14',
        srcPort: 53124, dstPort: 443, transport: 'TCP', tls: true,
        httpRequest: 'GET / HTTP/1.1\nHost: example.com',
      }),
    [],
  );
  const [depth, setDepth] = useState(packet.headers.length);
  const shown = packet.headers.slice(0, depth).reverse();

  return (
    <VizFrame
      title={v.packetTitle}
      lead={v.packetLead}
      actions={
        <>
          <Button size="sm" onClick={() => setDepth((d) => Math.max(1, d - 1))} disabled={depth <= 1}>{v.packetRemove}</Button>
          <Button size="sm" variant="primary" onClick={() => setDepth((d) => Math.min(packet.headers.length, d + 1))} disabled={depth >= packet.headers.length}>
            {v.packetAdd}
          </Button>
        </>
      }
    >
      <div className="space-y-1.5">
        {shown.map((h, i) => (
          <div key={h.protocol} style={{ marginInlineStart: `${i * 14}px` }} className="rise">
            <div className="flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-white" style={{ background: LAYER_TONES[(shown.length - 1 - i) % LAYER_TONES.length] }}>
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">{h.layer}</span>
              <span className="text-[13px] font-semibold">{h.protocol}</span>
              <span className="ml-auto font-mono text-[10.5px] opacity-85">{h.unit}</span>
            </div>
          </div>
        ))}
        <div style={{ marginInlineStart: `${shown.length * 14}px` }} className="rounded-lg border border-dashed border-slate-300 px-3 py-2 font-mono text-[11px] text-slate-500 dark:border-edge dark:text-muted">
          {v.packetPayload}
        </div>
      </div>
      <KeyValue className="mt-4" rows={shown[0]?.fields.slice(0, 4).map((f) => ({ k: f.name, v: f.value })) ?? []} />
    </VizFrame>
  );
}

/* ── Ports table ─────────────────────────────────────────── */

export function PortsViz() {
  const { c } = useApp();
  const v = c.viz;
  return (
    <VizFrame title={v.portsTitle} lead={v.portsLead}>
      <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 thin-scroll dark:border-hairline">
        <table className="w-full text-left text-[12px]">
          <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 dark:bg-raised dark:text-faint">
            <tr>
              <th className="px-3 py-2">{v.portsPort}</th>
              <th className="px-3 py-2">{v.portsService}</th>
              <th className="px-3 py-2">{v.portsNote}</th>
            </tr>
          </thead>
          <tbody>
            {COMMON_PORTS.map((p) => (
              <tr key={`${p.port}-${p.service}`} className="border-t border-slate-100 dark:border-hairline/70">
                <td className="px-3 py-1.5 font-mono font-semibold">{p.port}</td>
                <td className="px-3 py-1.5">{p.service}</td>
                <td className="px-3 py-1.5 text-slate-500 dark:text-muted">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VizFrame>
  );
}

/* ── Switch MAC learning ─────────────────────────────────── */

const HOSTS = [
  { id: 'A', mac: '8C:85:90:1A:2B:3C', port: 1 },
  { id: 'B', mac: 'A4:83:E7:2F:9B:11', port: 2 },
  { id: 'C', mac: '30:05:5C:7A:88:01', port: 3 },
];

export function SwitchViz() {
  const { c } = useApp();
  const v = c.viz;
  const [table, setTable] = useState<Record<string, number>>({});
  const [last, setLast] = useState<{ flood: boolean; from: string; to: string } | null>(null);
  const [from, setFrom] = useState('A');
  const [to, setTo] = useState('B');

  const send = () => {
    const src = HOSTS.find((h) => h.id === from)!;
    const dst = HOSTS.find((h) => h.id === to)!;
    const known = table[dst.mac] !== undefined;
    setTable((tb) => ({ ...tb, [src.mac]: src.port }));
    setLast({ flood: !known, from: src.id, to: dst.id });
  };

  return (
    <VizFrame
      title={v.switchTitle}
      lead={v.switchLead}
      onReset={() => { setTable({}); setLast(null); }}
    >
      <div className="flex flex-wrap items-end gap-2">
        <Select
          label={v.switchSendFrom}
          value={from}
          onChange={(next) => {
            setFrom(next);
            if (next === to) setTo(HOSTS.find((h) => h.id !== next)!.id);
          }}
          options={HOSTS.map((h) => ({ value: h.id, label: h.id }))}
        />
        <Select label={v.switchSendTo} value={to} onChange={setTo} options={HOSTS.filter((h) => h.id !== from).map((h) => ({ value: h.id, label: h.id }))} />
        <Button size="sm" variant="primary" onClick={send} leading={<Send size={13} />}>{v.natSend}</Button>
      </div>
      {last && (
        <Note tone={last.flood ? 'amber' : 'teal'} className="mt-3">
          {last.flood ? v.switchFlood : v.switchDirect}
        </Note>
      )}
      <div className="mt-3">
        <div className="eyebrow mb-1.5 text-slate-500 dark:text-faint">{v.switchTable}</div>
        {Object.keys(table).length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-[12px] text-slate-400 dark:border-edge dark:text-faint">—</div>
        ) : (
          <ul className="space-y-1">
            {Object.entries(table).map(([mac, port]) => (
              <li key={mac} className="rise flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[11px] dark:bg-raised">
                <span>{mac}</span>
                <span className="text-slate-500 dark:text-muted">{v.switchPort} {port}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </VizFrame>
  );
}

/* ── DHCP flow ───────────────────────────────────────────── */

export function DhcpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [step, setStep] = useState(0);
  const msgs = ['DISCOVER', 'OFFER', 'REQUEST', 'ACK'];
  const done = step >= 4;
  return (
    <VizFrame
      title={v.dhcpTitle}
      lead={v.dhcpLead}
      onReset={() => setStep(0)}
      actions={
        <Button size="sm" variant="primary" onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={done}>
          {msgs[Math.min(step, 3)]}
        </Button>
      }
    >
      <ul className="space-y-1.5">
        {msgs.map((m, i) => (
          <li
            key={m}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2 font-mono text-[12px] transition-colors',
              i < step ? 'border-brand-500/60 bg-brand-500/10' : 'border-slate-200 text-slate-400 dark:border-hairline dark:text-faint',
            )}
          >
            <span className="w-6 text-center">{i % 2 === 0 ? '→' : '←'}</span>
            {m}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <div className="eyebrow mb-1.5 text-slate-500 dark:text-faint">{v.dhcpConfig}</div>
        {done ? (
          <KeyValue
            rows={[
              { k: 'IP', v: '192.168.1.10' },
              { k: 'Mask', v: '255.255.255.0 (/24)' },
              { k: 'Gateway', v: '192.168.1.1' },
              { k: 'DNS', v: '192.168.1.1' },
            ]}
          />
        ) : (
          <p className="text-[12px] text-slate-400 dark:text-faint">{v.dhcpNone}</p>
        )}
      </div>
    </VizFrame>
  );
}

/* ── TLS handshake ───────────────────────────────────────── */

export function TlsViz() {
  const { c } = useApp();
  const v = c.viz;
  const [step, setStep] = useState(0);
  const steps = ['ClientHello', 'ServerHello', 'Certificate', 'Key agreement', 'Encrypted data'];
  const props = [
    { label: v.tlsConf, on: step >= 4 },
    { label: v.tlsAuth, on: step >= 3 },
    { label: v.tlsInt, on: step >= 5 },
  ];
  return (
    <VizFrame
      title={v.tlsTitle}
      lead={v.tlsLead}
      onReset={() => setStep(0)}
      actions={
        <Button size="sm" variant="primary" onClick={() => setStep((s) => Math.min(steps.length, s + 1))} disabled={step >= steps.length}>
          {steps[Math.min(step, steps.length - 1)]}
        </Button>
      }
    >
      <ul className="space-y-1.5">
        {steps.map((s, i) => (
          <li
            key={s}
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-[12.5px] transition-colors',
              i < step ? 'border-rose-500/50 bg-rose-500/[0.08]' : 'border-slate-200 text-slate-400 dark:border-hairline dark:text-faint',
            )}
          >
            <span className="w-6 text-center font-mono">{i % 2 === 0 ? '→' : '←'}</span>
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <div className="eyebrow mb-2 text-slate-500 dark:text-faint">{v.tlsProps}</div>
        <div className="flex flex-wrap gap-2">
          {props.map((p) => (
            <span key={p.label} className={cn('rounded-full px-3 py-1 text-[12px]', p.on ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300' : 'bg-slate-100 text-slate-400 dark:bg-raised dark:text-faint')}>
              {p.on ? '✓ ' : '○ '}{p.label}
            </span>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}

/* ── HTTP exchange ───────────────────────────────────────── */

const RESOURCES: Record<string, { status: number; text: string; body: string }> = {
  '/': { status: 200, text: 'OK', body: '<!doctype html><html>…</html>' },
  '/api/users': { status: 200, text: 'OK', body: '[{"id":1,"name":"Ada"}]' },
  '/old': { status: 301, text: 'Moved Permanently', body: '' },
  '/private': { status: 403, text: 'Forbidden', body: '' },
  '/missing': { status: 404, text: 'Not Found', body: '' },
  '/broken': { status: 500, text: 'Internal Server Error', body: '' },
};

export function HttpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [path, setPath] = useState('/');
  const [sent, setSent] = useState(false);
  const res = RESOURCES[path];
  const status = method === 'POST' && res.status === 200 ? 201 : res.status;
  const tone = status < 300 ? 'text-teal-600 dark:text-teal-300' : status < 400 ? 'text-amber-600 dark:text-amber-300' : 'text-rose-600 dark:text-rose-300';

  return (
    <VizFrame title={v.httpTitle} lead={v.httpLead}>
      <div className="flex flex-wrap items-end gap-2">
        <Select label={v.httpMethod} value={method} onChange={(m) => { setMethod(m); setSent(false); }} options={(['GET', 'POST', 'PUT', 'DELETE'] as const).map((m) => ({ value: m, label: m }))} />
        <Select label={v.httpPath} value={path} onChange={(p) => { setPath(p); setSent(false); }} options={Object.keys(RESOURCES).map((p) => ({ value: p, label: p }))} />
        <Button size="sm" variant="primary" onClick={() => setSent(true)} leading={<Send size={13} />}>{v.httpSend}</Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-1.5 text-slate-500 dark:text-faint">{v.httpRequest}</div>
          <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-[11.5px] leading-relaxed text-slate-100 thin-scroll">
            <span className="text-brand-300">{method} {path} HTTP/2</span>{'\n'}Host: example.com{'\n'}Accept: */*
          </pre>
        </div>
        <div>
          <div className="eyebrow mb-1.5 text-slate-500 dark:text-faint">{v.httpResponse}</div>
          {sent ? (
            <pre className="rise overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-[11.5px] leading-relaxed text-slate-100 thin-scroll">
              <span className={tone}>HTTP/2 {status} {status === 201 ? 'Created' : res.text}</span>{'\n'}
              Content-Type: text/html{'\n'}
              {res.body ? `\n${res.body}` : ''}
            </pre>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-[12px] text-slate-400 dark:border-edge dark:text-faint">—</div>
          )}
        </div>
      </div>
    </VizFrame>
  );
}

/* ── UDP vs TCP ──────────────────────────────────────────── */

export function UdpViz() {
  const { c } = useApp();
  const v = c.viz;
  const [sent, setSent] = useState<{ id: number; lost: boolean }[]>([]);
  return (
    <VizFrame
      title="UDP"
      lead={c.concepts.udp.tagline}
      onReset={() => setSent([])}
      actions={
        <Button size="sm" variant="primary" onClick={() => setSent((s) => [...s, { id: s.length + 1, lost: Math.random() < 0.25 }].slice(-16))} leading={<Send size={13} />}>
          {v.natSend}
        </Button>
      }
    >
      <div className="flex flex-wrap gap-1.5">
        {sent.length === 0 && <p className="text-[13px] text-slate-400 dark:text-faint">—</p>}
        {sent.map((d) => (
          <span
            key={d.id}
            className={cn(
              'rise flex h-9 w-9 items-center justify-center rounded-lg font-mono text-[11px]',
              d.lost ? 'bg-rose-500/15 text-rose-500 line-through' : 'bg-brand-500 text-white',
            )}
          >
            {d.id}
          </span>
        ))}
      </div>
      {sent.length > 0 && (
        <Progress className="mt-4" value={sent.filter((s) => !s.lost).length / sent.length} showValue label="delivered" />
      )}
    </VizFrame>
  );
}
