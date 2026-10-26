import type { ConceptId, GlossaryId, QuizId } from '../i18n/content-en';

/** Interactive visualisation bound to a concept. */
export type VizId =
  | 'ip'
  | 'subnet'
  | 'packet'
  | 'dns'
  | 'tcp'
  | 'udp'
  | 'quic'
  | 'http'
  | 'tls'
  | 'nat'
  | 'dhcp'
  | 'routing'
  | 'bgp'
  | 'cdn'
  | 'switch'
  | 'ports'
  | 'frame'
  | 'map'
  | 'journey'
  | 'datacenter'
  | 'submarine'
  | 'ixp'
  | 'as'
  | 'isp';

export type LevelId = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6' | 'l7' | 'l8' | 'l9';

export interface ConceptMeta {
  id: ConceptId;
  level: LevelId;
  viz: VizId;
  /** minutes to read + play */
  minutes: number;
  related: ConceptId[];
  glossary: GlossaryId[];
  /** accent colour token used in cards and the map */
  accent: 'brand' | 'teal' | 'violet' | 'amber' | 'rose' | 'lime';
}

const m = (
  id: ConceptId,
  level: LevelId,
  viz: VizId,
  minutes: number,
  related: ConceptId[],
  glossary: GlossaryId[],
  accent: ConceptMeta['accent'],
): ConceptMeta => ({ id, level, viz, minutes, related, glossary, accent });

/** Ordered curriculum. Order defines prev/next navigation. */
export const CONCEPTS: ConceptMeta[] = [
  m('internet', 'l1', 'map', 4, ['isp', 'as', 'global'], ['ip', 'packet', 'as'], 'brand'),
  m('isp', 'l1', 'isp', 4, ['internet', 'bgp', 'ixp'], ['isp', 'as'], 'brand'),

  m('mac-ethernet', 'l2', 'frame', 5, ['switch', 'router', 'packet'], ['mac', 'packet'], 'teal'),
  m('switch', 'l2', 'switch', 4, ['mac-ethernet', 'router'], ['switch', 'mac'], 'teal'),
  m('router', 'l2', 'routing', 5, ['switch', 'ip', 'nat'], ['router', 'ip'], 'teal'),
  m('dhcp', 'l2', 'dhcp', 4, ['ip', 'router', 'dns'], ['dhcp', 'ip'], 'teal'),

  m('ip', 'l3', 'ip', 5, ['subnet', 'packet', 'router'], ['ip', 'packet'], 'violet'),
  m('packet', 'l3', 'packet', 5, ['ip', 'tcp', 'mac-ethernet'], ['packet', 'port'], 'violet'),
  m('subnet', 'l3', 'subnet', 5, ['ip', 'router'], ['ip', 'router'], 'violet'),
  m('nat', 'l3', 'nat', 5, ['ip', 'router', 'ports'], ['nat', 'ip', 'port'], 'violet'),

  m('dns', 'l4', 'dns', 6, ['ip', 'cdn', 'http'], ['dns', 'ip'], 'amber'),

  m('ports', 'l5', 'ports', 4, ['tcp', 'udp', 'nat'], ['port', 'socket'], 'brand'),
  m('tcp', 'l5', 'tcp', 6, ['udp', 'quic', 'ports'], ['tcp', 'port'], 'brand'),
  m('udp', 'l5', 'udp', 4, ['tcp', 'quic', 'dns'], ['udp', 'packet'], 'brand'),
  m('quic', 'l5', 'quic', 5, ['tcp', 'udp', 'http'], ['quic', 'udp', 'tls'], 'brand'),

  m('http', 'l6', 'http', 5, ['tls', 'quic', 'cdn'], ['http', 'https'], 'rose'),
  m('tls', 'l6', 'tls', 6, ['http', 'quic'], ['tls', 'https'], 'rose'),

  m('routing', 'l7', 'routing', 5, ['router', 'bgp', 'as'], ['router', 'ip'], 'lime'),
  m('bgp', 'l7', 'bgp', 6, ['routing', 'as', 'ixp'], ['bgp', 'as'], 'lime'),
  m('as', 'l7', 'as', 4, ['bgp', 'isp', 'ixp'], ['as', 'bgp'], 'lime'),

  m('cdn', 'l8', 'cdn', 5, ['dns', 'datacenter', 'http'], ['cdn', 'dns'], 'teal'),
  m('datacenter', 'l8', 'datacenter', 5, ['cdn', 'ixp'], ['datacenter', 'server'], 'teal'),
  m('ixp', 'l8', 'ixp', 5, ['bgp', 'isp', 'as'], ['ixp', 'as'], 'teal'),

  m('submarine', 'l9', 'submarine', 5, ['global', 'ixp', 'cdn'], ['cable', 'isp'], 'violet'),
  m('global', 'l9', 'journey', 5, ['internet', 'submarine', 'cdn'], ['ip', 'as', 'cdn'], 'violet'),
];

export const CONCEPT_BY_ID = new Map<ConceptId, ConceptMeta>(CONCEPTS.map((c) => [c.id, c]));

export const LEVELS: LevelId[] = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9'];

export function conceptsInLevel(level: LevelId): ConceptMeta[] {
  return CONCEPTS.filter((c) => c.level === level);
}

export function conceptIndex(id: ConceptId): number {
  return CONCEPTS.findIndex((c) => c.id === id);
}

export function nextConcept(id: ConceptId): ConceptMeta | undefined {
  const i = conceptIndex(id);
  return i >= 0 ? CONCEPTS[i + 1] : undefined;
}

export function prevConcept(id: ConceptId): ConceptMeta | undefined {
  const i = conceptIndex(id);
  return i > 0 ? CONCEPTS[i - 1] : undefined;
}

/** Glossary term → concept that explains it in depth. */
export const GLOSSARY_TO_CONCEPT: Partial<Record<GlossaryId, ConceptId>> = {
  ip: 'ip',
  mac: 'mac-ethernet',
  dns: 'dns',
  tcp: 'tcp',
  udp: 'udp',
  quic: 'quic',
  tls: 'tls',
  http: 'http',
  https: 'tls',
  nat: 'nat',
  dhcp: 'dhcp',
  bgp: 'bgp',
  isp: 'isp',
  cdn: 'cdn',
  as: 'as',
  ixp: 'ixp',
  router: 'router',
  switch: 'switch',
  packet: 'packet',
  port: 'ports',
  socket: 'ports',
  server: 'datacenter',
  datacenter: 'datacenter',
  cable: 'submarine',
};

export const GLOSSARY_IDS = Object.keys(GLOSSARY_TO_CONCEPT) as GlossaryId[];

export const QUIZ_IDS: QuizId[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16'];

/** Deterministic shuffle helper used by the quiz. */
export function shuffle<T>(arr: readonly T[], seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
