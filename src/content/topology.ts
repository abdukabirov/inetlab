import type { ConceptId } from '../i18n/content-en';
import type { Dict } from '../i18n/en';
import type { ContentDict } from '../i18n/content-en';

export type MapLevel = 'l1' | 'l2' | 'l3' | 'l4';

export type NodeKind =
  | 'device'
  | 'switch'
  | 'router'
  | 'firewall'
  | 'isp'
  | 'internet'
  | 'dns'
  | 'server'
  | 'ixp'
  | 'as'
  | 'cdn'
  | 'cloud'
  | 'datacenter'
  | 'landing';

export type LinkKind = 'wifi' | 'lan' | 'access' | 'fiber' | 'transit' | 'peer' | 'submarine' | 'logical';

export interface MapNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  /** localized label source */
  concept?: ConceptId;
  place?: keyof Dict['places'];
  region?: keyof Dict['places'];
  ifaces?: { name: string; mac?: string; ip?: string }[];
  protocols?: string[];
}

export interface MapLink {
  id: string;
  a: string;
  b: string;
  kind: LinkKind;
  ms?: number;
}

export interface MapTopology {
  level: MapLevel;
  nodes: MapNode[];
  links: MapLink[];
  initial: string;
}

const link = (a: string, b: string, kind: LinkKind, ms?: number): MapLink => ({ id: `${a}~${b}`, a, b, kind, ms });

// ── L1 · Big picture ────────────────────────────────────────
const L1: MapTopology = {
  level: 'l1',
  initial: 'device',
  nodes: [
    { id: 'device', kind: 'device', x: 110, y: 250, place: 'yourDevice', ifaces: [{ name: 'wlan0', mac: '8C:85:90:1A:2B:3C', ip: '192.168.1.10' }], protocols: ['HTTP', 'TLS', 'TCP', 'IP'] },
    { id: 'router', kind: 'router', x: 320, y: 250, concept: 'router', place: 'homeRouter', ifaces: [{ name: 'LAN', ip: '192.168.1.1' }, { name: 'WAN', ip: '203.0.113.5' }], protocols: ['IP', 'NAT', 'DHCP'] },
    { id: 'isp', kind: 'isp', x: 530, y: 250, concept: 'isp', place: 'yourIsp', protocols: ['IP', 'BGP'] },
    { id: 'internet', kind: 'internet', x: 730, y: 250, concept: 'internet', protocols: ['BGP', 'IP'] },
    { id: 'server', kind: 'server', x: 920, y: 250, concept: 'datacenter', place: 'webServer', ifaces: [{ name: 'eth0', ip: '10.20.0.7' }], protocols: ['TCP', 'TLS', 'HTTP'] },
  ],
  links: [link('device', 'router', 'wifi', 1), link('router', 'isp', 'access', 8), link('isp', 'internet', 'transit', 20), link('internet', 'server', 'fiber', 40)],
};

// ── L2 · Home network ───────────────────────────────────────
const L2: MapTopology = {
  level: 'l2',
  initial: 'device',
  nodes: [
    { id: 'device', kind: 'device', x: 100, y: 300, place: 'yourDevice', ifaces: [{ name: 'wlan0', mac: '8C:85:90:1A:2B:3C', ip: '192.168.1.10' }], protocols: ['HTTP', 'TLS', 'TCP', 'IP', 'Wi-Fi'] },
    { id: 'switch', kind: 'switch', x: 260, y: 300, concept: 'switch', place: 'localSwitch', protocols: ['Ethernet', 'Wi-Fi'] },
    { id: 'dns', kind: 'dns', x: 260, y: 130, concept: 'dns', place: 'dnsResolver', ifaces: [{ name: 'resolver', ip: '1.1.1.1' }], protocols: ['DNS', 'UDP'] },
    { id: 'router', kind: 'router', x: 430, y: 300, concept: 'router', place: 'homeRouter', ifaces: [{ name: 'LAN', mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.1.1' }, { name: 'WAN', ip: '203.0.113.5' }], protocols: ['IP', 'ARP', 'DHCP'] },
    { id: 'nat', kind: 'router', x: 430, y: 150, concept: 'nat', protocols: ['NAT'] },
    { id: 'firewall', kind: 'firewall', x: 600, y: 150, place: 'firewall', protocols: ['stateful filter'] },
    { id: 'isp', kind: 'isp', x: 700, y: 300, concept: 'isp', place: 'yourIsp', protocols: ['IP', 'BGP'] },
    { id: 'server', kind: 'server', x: 900, y: 300, concept: 'datacenter', place: 'webServer', ifaces: [{ name: 'eth0', ip: '10.20.0.7' }], protocols: ['TCP 443', 'TLS', 'HTTP'] },
  ],
  links: [
    link('device', 'switch', 'wifi', 1),
    link('switch', 'router', 'lan'),
    link('device', 'dns', 'logical', 12),
    link('router', 'nat', 'logical'),
    link('nat', 'firewall', 'logical'),
    link('router', 'isp', 'access', 8),
    link('isp', 'server', 'fiber', 55),
  ],
};

// ── L3 · Internet architecture ──────────────────────────────
const L3: MapTopology = {
  level: 'l3',
  initial: 'isp',
  nodes: [
    { id: 'home', kind: 'device', x: 90, y: 240, place: 'yourDevice' },
    { id: 'isp', kind: 'isp', x: 270, y: 240, concept: 'isp', place: 'yourIsp', protocols: ['BGP', 'IP'] },
    { id: 'transit', kind: 'as', x: 480, y: 110, concept: 'as', place: 'transitProvider', protocols: ['BGP'] },
    { id: 'ixp', kind: 'ixp', x: 480, y: 360, concept: 'ixp', protocols: ['BGP', 'Ethernet fabric'] },
    { id: 'cdn', kind: 'cdn', x: 700, y: 240, concept: 'cdn', place: 'contentNetwork', protocols: ['HTTP', 'TLS', 'anycast'] },
    { id: 'cloud', kind: 'cloud', x: 890, y: 150, concept: 'datacenter', place: 'cloudRegion', protocols: ['BGP', 'IP'] },
    { id: 'dc', kind: 'datacenter', x: 890, y: 340, concept: 'datacenter', protocols: ['ECMP', 'L4/L7 balancing'] },
  ],
  links: [
    link('home', 'isp', 'access', 8),
    link('isp', 'transit', 'transit', 15),
    link('isp', 'ixp', 'peer', 3),
    link('transit', 'ixp', 'peer'),
    link('ixp', 'cdn', 'peer', 2),
    link('transit', 'cloud', 'transit', 30),
    link('cdn', 'cloud', 'peer', 40),
    link('cloud', 'dc', 'fiber', 1),
  ],
};

// ── L4 · Global infrastructure ──────────────────────────────
const L4: MapTopology = {
  level: 'l4',
  initial: 'userEu',
  nodes: [
    { id: 'userEu', kind: 'device', x: 640, y: 150, place: 'userEurope', region: 'europe' },
    { id: 'edgeEu', kind: 'cdn', x: 640, y: 265, concept: 'cdn', place: 'localEdge', region: 'europe' },
    { id: 'fra', kind: 'ixp', x: 700, y: 60, concept: 'ixp', place: 'frankfurt', region: 'europe' },
    { id: 'lon', kind: 'ixp', x: 520, y: 90, concept: 'ixp', place: 'london', region: 'europe' },
    { id: 'nyc', kind: 'landing', x: 250, y: 150, concept: 'submarine', place: 'newYork', region: 'northAmerica' },
    { id: 'ash', kind: 'datacenter', x: 230, y: 280, concept: 'datacenter', place: 'ashburn', region: 'northAmerica' },
    { id: 'mrs', kind: 'landing', x: 620, y: 370, concept: 'submarine', place: 'marseille', region: 'europe' },
    { id: 'sgp', kind: 'ixp', x: 830, y: 400, concept: 'ixp', place: 'singapore', region: 'asia' },
    { id: 'tky', kind: 'cloud', x: 930, y: 210, concept: 'datacenter', place: 'tokyo', region: 'asia' },
    { id: 'userAs', kind: 'device', x: 930, y: 330, place: 'userAsia', region: 'asia' },
  ],
  links: [
    link('userEu', 'edgeEu', 'fiber', 2),
    link('userEu', 'fra', 'fiber', 10),
    link('fra', 'lon', 'fiber', 8),
    link('lon', 'nyc', 'submarine', 30),
    link('nyc', 'ash', 'fiber', 2),
    link('fra', 'mrs', 'fiber', 6),
    link('mrs', 'sgp', 'submarine', 90),
    link('sgp', 'tky', 'submarine', 25),
    link('tky', 'userAs', 'fiber', 10),
    link('sgp', 'userAs', 'fiber', 5),
  ],
};

export const TOPOLOGIES: Record<MapLevel, MapTopology> = { l1: L1, l2: L2, l3: L3, l4: L4 };
export const MAP_LEVELS: MapLevel[] = ['l1', 'l2', 'l3', 'l4'];

/** Resolve a node's display label in the active locale. */
export function nodeLabel(node: MapNode, t: Dict, c: ContentDict): string {
  if (node.place) return t.places[node.place];
  if (node.concept) return c.concepts[node.concept].title;
  return node.id;
}

/** Resolve a node's short role description in the active locale. */
export function nodeRole(node: MapNode, c: ContentDict): string | undefined {
  return node.concept ? c.concepts[node.concept].tagline : undefined;
}

export function findPath(topo: MapTopology, from: string, to: string): string[] {
  const adj = new Map<string, string[]>();
  for (const l of topo.links) {
    adj.set(l.a, [...(adj.get(l.a) ?? []), l.b]);
    adj.set(l.b, [...(adj.get(l.b) ?? []), l.a]);
  }
  const prev = new Map<string, string | null>([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === to) break;
    for (const n of adj.get(cur) ?? []) {
      if (!prev.has(n)) {
        prev.set(n, cur);
        queue.push(n);
      }
    }
  }
  if (!prev.has(to)) return [];
  const out: string[] = [];
  let cur: string | null = to;
  while (cur) {
    out.unshift(cur);
    cur = prev.get(cur) ?? null;
  }
  return out;
}
