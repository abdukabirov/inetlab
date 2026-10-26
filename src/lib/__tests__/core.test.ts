import { describe, it, expect } from 'vitest';
import {
  parseIPv4, ipv4ToString, calculateSubnet, ipInCidr, classifyIPv4, maskToPrefix,
  longestPrefixMatch, NatTable, createTcpSim, tcpStep, resolveDns, buildEncapsulation, COMMON_PORTS,
} from '../network';
import { en } from '../../i18n/en';
import { ru } from '../../i18n/ru';
import { uz } from '../../i18n/uz';
import { contentEn } from '../../i18n/content-en';
import { contentRu } from '../../i18n/content-ru';
import { contentUz } from '../../i18n/content-uz';
import { CONCEPTS, CONCEPT_BY_ID, GLOSSARY_IDS, GLOSSARY_TO_CONCEPT, LEVELS, QUIZ_IDS, conceptsInLevel, nextConcept, prevConcept, shuffle } from '../../content/curriculum';
import { MAP_LEVELS, TOPOLOGIES, findPath } from '../../content/topology';
import { JOURNEY, JOURNEY_BY_LEVEL } from '../../content/journey';

// ── Networking engine ───────────────────────────────────────

describe('IPv4 helpers', () => {
  it('parses and formats addresses', () => {
    expect(parseIPv4('192.168.1.10')).toBe(3232235786);
    expect(ipv4ToString(3232235786)).toBe('192.168.1.10');
    expect(parseIPv4('256.1.1.1')).toBeNull();
    expect(parseIPv4('nope')).toBeNull();
  });
  it('classifies ranges', () => {
    expect(classifyIPv4('10.1.2.3')).toContain('private');
    expect(classifyIPv4('127.0.0.1')).toBe('loopback');
    expect(classifyIPv4('8.8.8.8')).toContain('public');
  });
  it('validates masks', () => {
    expect(maskToPrefix('255.255.255.0')).toBe(24);
    expect(maskToPrefix('255.0.255.0')).toBeNull();
  });
});

describe('subnetting', () => {
  it('computes /24 and /26 correctly', () => {
    const a = calculateSubnet('192.168.1.77/24')!;
    expect(a.network).toBe('192.168.1.0');
    expect(a.broadcast).toBe('192.168.1.255');
    expect(a.usableHosts).toBe(254);

    const b = calculateSubnet('192.168.1.130/26')!;
    expect(b.network).toBe('192.168.1.128');
    expect(b.usableHosts).toBe(62);
    expect(b.firstHost).toBe('192.168.1.129');
    expect(b.lastHost).toBe('192.168.1.190');
  });
  it('handles membership', () => {
    expect(ipInCidr('10.1.2.3', '10.0.0.0/8')).toBe(true);
    expect(ipInCidr('11.1.2.3', '10.0.0.0/8')).toBe(false);
  });
});

describe('longest-prefix matching', () => {
  const table = [
    { prefix: '0.0.0.0/0', nextHop: 'ISP', iface: 'wan' },
    { prefix: '10.0.0.0/8', nextHop: 'R1', iface: 'a' },
    { prefix: '10.1.0.0/16', nextHop: 'R2', iface: 'b' },
    { prefix: '10.1.2.0/24', nextHop: 'R3', iface: 'c' },
  ];
  it('selects the most specific route', () => {
    expect(longestPrefixMatch('10.1.2.9', table)!.route.nextHop).toBe('R3');
    expect(longestPrefixMatch('10.1.9.9', table)!.route.nextHop).toBe('R2');
    expect(longestPrefixMatch('10.9.9.9', table)!.route.nextHop).toBe('R1');
    expect(longestPrefixMatch('8.8.8.8', table)!.route.nextHop).toBe('ISP');
  });
  it('returns null without a default route', () => {
    expect(longestPrefixMatch('8.8.8.8', table.slice(1))).toBeNull();
  });
});

describe('NAT translation', () => {
  it('creates stable mappings and reverses them', () => {
    const nat = new NatTable('203.0.113.5', 60000);
    const a = nat.translateOutbound('192.168.1.10', 53124, '93.184.215.14', 443);
    const b = nat.translateOutbound('192.168.1.11', 41000, '93.184.215.14', 443);
    expect(a.publicPort).toBe(60000);
    expect(b.publicPort).toBe(60001);
    expect(nat.translateOutbound('192.168.1.10', 53124, '93.184.215.14', 443)).toBe(a);
    expect(nat.translateInbound(60001, '93.184.215.14', 443)!.privateIp).toBe('192.168.1.11');
    expect(nat.translateInbound(60999, '198.51.100.9', 80)).toBeNull();
  });
});

describe('TCP state model', () => {
  it('completes the handshake', () => {
    let s = createTcpSim([100]);
    s = tcpStep(s);
    expect(s.client).toBe('SYN_SENT');
    s = tcpStep(s);
    expect(s.server).toBe('SYN_RECEIVED');
    s = tcpStep(s);
    expect(s.client).toBe('ESTABLISHED');
    expect(s.server).toBe('ESTABLISHED');
  });
  it('retransmits lost data', () => {
    let s = createTcpSim([100]);
    s = tcpStep(s); s = tcpStep(s); s = tcpStep(s);
    const seq = s.clientSeq;
    s = tcpStep(s, true);
    expect(s.unacked).not.toBeNull();
    s = tcpStep(s);
    expect(s.unacked).toBeNull();
    expect(s.serverAck).toBe(seq + 100);
    expect(s.segments.some((x) => x.retransmission)).toBe(true);
  });
  it('recovers from a lost SYN', () => {
    let s = createTcpSim([]);
    s = tcpStep(s, true);
    s = tcpStep(s);
    s = tcpStep(s);
    s = tcpStep(s);
    expect(s.client).toBe('ESTABLISHED');
    expect(s.server).toBe('ESTABLISHED');
  });
});

describe('DNS resolution model', () => {
  it('walks the hierarchy then serves from cache', () => {
    const cache = new Set<string>();
    const first = resolveDns('example.com', 'A', cache);
    expect(first.answer[0].value).toBe('93.184.215.14');
    expect(first.steps.some((s) => s.to === 'root')).toBe(true);
    const second = resolveDns('example.com', 'A', cache);
    expect(second.steps.some((s) => s.cached)).toBe(true);
    expect(second.steps.some((s) => s.to === 'root')).toBe(false);
  });
});

describe('encapsulation', () => {
  it('nests headers outward', () => {
    const p = buildEncapsulation({
      srcMac: 'a', dstMac: 'b', srcIp: '192.168.1.10', dstIp: '93.184.215.14',
      srcPort: 53124, dstPort: 443, transport: 'TCP', tls: true, httpRequest: 'GET / HTTP/1.1',
    });
    expect(p.headers.map((h) => h.protocol)).toEqual(['HTTP', 'TLS', 'TCP', 'IPv4', 'Ethernet']);
  });
  it('exposes well-known ports', () => {
    expect(COMMON_PORTS.find((p) => p.port === 443)).toBeTruthy();
    expect(COMMON_PORTS.find((p) => p.port === 53)).toBeTruthy();
  });
});

// ── Curriculum integrity ────────────────────────────────────

describe('curriculum', () => {
  it('has unique concept ids covering every level', () => {
    const ids = new Set(CONCEPTS.map((x) => x.id));
    expect(ids.size).toBe(CONCEPTS.length);
    for (const lv of LEVELS) expect(conceptsInLevel(lv).length, lv).toBeGreaterThan(0);
  });
  it('links related concepts and glossary terms that exist', () => {
    for (const meta of CONCEPTS) {
      for (const r of meta.related) expect(CONCEPT_BY_ID.has(r), `${meta.id} → ${r}`).toBe(true);
      for (const g of meta.glossary) expect(GLOSSARY_IDS.includes(g), `${meta.id} → ${g}`).toBe(true);
    }
  });
  it('maps every glossary term to a real concept', () => {
    for (const g of GLOSSARY_IDS) {
      const target = GLOSSARY_TO_CONCEPT[g]!;
      expect(CONCEPT_BY_ID.has(target), `${g} → ${target}`).toBe(true);
    }
  });
  it('navigates forward and back', () => {
    expect(prevConcept(CONCEPTS[0].id)).toBeUndefined();
    expect(nextConcept(CONCEPTS[0].id)?.id).toBe(CONCEPTS[1].id);
    expect(nextConcept(CONCEPTS[CONCEPTS.length - 1].id)).toBeUndefined();
  });
  it('shuffles deterministically for a given seed', () => {
    expect(shuffle(QUIZ_IDS, 42)).toEqual(shuffle(QUIZ_IDS, 42));
    expect(shuffle(QUIZ_IDS, 42)).toHaveLength(QUIZ_IDS.length);
  });
});

// ── Topology + journey ──────────────────────────────────────

describe('topology', () => {
  it('has valid links on every level', () => {
    for (const lv of MAP_LEVELS) {
      const topo = TOPOLOGIES[lv];
      const ids = new Set(topo.nodes.map((n) => n.id));
      expect(ids.size).toBe(topo.nodes.length);
      for (const l of topo.links) {
        expect(ids.has(l.a), `${lv}:${l.id}`).toBe(true);
        expect(ids.has(l.b), `${lv}:${l.id}`).toBe(true);
      }
      expect(ids.has(topo.initial)).toBe(true);
    }
  });
  it('finds paths between connected nodes', () => {
    expect(findPath(TOPOLOGIES.l1, 'device', 'server')).toEqual(['device', 'router', 'isp', 'internet', 'server']);
    expect(findPath(TOPOLOGIES.l1, 'device', 'ghost')).toEqual([]);
  });
  it('journeys reference nodes that exist and are reachable', () => {
    for (const lv of MAP_LEVELS) {
      const topo = TOPOLOGIES[lv];
      const ids = new Set(topo.nodes.map((n) => n.id));
      for (const step of JOURNEY_BY_LEVEL[lv]) {
        expect(ids.has(step.from), `${lv}:${step.key}:from`).toBe(true);
        expect(ids.has(step.to), `${lv}:${step.key}:to`).toBe(true);
        if (step.from !== step.to) expect(findPath(topo, step.from, step.to).length, `${lv}:${step.key}`).toBeGreaterThan(1);
      }
    }
  });
  it('the main journey covers every narrative key', () => {
    const keys = new Set(JOURNEY.map((s) => s.key));
    expect(keys.size).toBe(JOURNEY.length);
    for (const s of JOURNEY) expect(contentEn.journey[s.key]).toBeTruthy();
  });
});

// ── Localisation completeness ───────────────────────────────

type AnyRec = Record<string, unknown>;

function collectPaths(obj: AnyRec, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) out.push(path);
    else if (v && typeof v === 'object') out.push(...collectPaths(v as AnyRec, path));
    else out.push(path);
  }
  return out;
}

function valueAt(obj: AnyRec, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => (acc as AnyRec | undefined)?.[k], obj);
}

describe('localisation', () => {
  const uiRef = collectPaths(en as unknown as AnyRec);
  const contentRef = collectPaths(contentEn as unknown as AnyRec);

  it('ru and uz define every UI key', () => {
    for (const dict of [ru, uz]) {
      for (const p of uiRef) {
        const v = valueAt(dict as unknown as AnyRec, p);
        expect(v, `${(dict as { code: string }).code}: ${p}`).toBeDefined();
        if (typeof v === 'string') expect(v.length, `${(dict as { code: string }).code}: ${p}`).toBeGreaterThan(0);
      }
    }
  });

  it('ru and uz define every content key', () => {
    for (const [code, dict] of [['ru', contentRu], ['uz', contentUz]] as const) {
      for (const p of contentRef) {
        const v = valueAt(dict as unknown as AnyRec, p);
        expect(v, `${code}: ${p}`).toBeDefined();
        if (typeof v === 'string') expect(v.length, `${code}: ${p}`).toBeGreaterThan(0);
        if (Array.isArray(v)) expect(v.length, `${code}: ${p}`).toBeGreaterThan(0);
      }
    }
  });

  it('every concept, glossary term and quiz item is translated', () => {
    for (const [code, dict] of [['en', contentEn], ['ru', contentRu], ['uz', contentUz]] as const) {
      for (const meta of CONCEPTS) {
        const cc = dict.concepts[meta.id];
        expect(cc, `${code}: concept ${meta.id}`).toBeTruthy();
        expect(cc.simple.length, `${code}: ${meta.id}.simple`).toBeGreaterThan(0);
        expect(cc.technical.length, `${code}: ${meta.id}.technical`).toBeGreaterThan(0);
        expect(cc.terms.length, `${code}: ${meta.id}.terms`).toBeGreaterThan(0);
      }
      for (const g of GLOSSARY_IDS) expect(dict.glossary[g], `${code}: glossary ${g}`).toBeTruthy();
      for (const q of QUIZ_IDS) {
        const item = dict.quiz[q];
        expect(item, `${code}: quiz ${q}`).toBeTruthy();
        expect(item.a.length, `${code}: quiz ${q} options`).toBeGreaterThan(1);
        expect(item.correct, `${code}: quiz ${q} answer`).toBeLessThan(item.a.length);
      }
    }
  });

  it('quiz answers agree across locales and point at real concepts', () => {
    for (const q of QUIZ_IDS) {
      expect(contentRu.quiz[q].correct, `ru ${q}`).toBe(contentEn.quiz[q].correct);
      expect(contentUz.quiz[q].correct, `uz ${q}`).toBe(contentEn.quiz[q].correct);
      expect(CONCEPT_BY_ID.has(contentEn.quiz[q].concept as never), `${q} concept`).toBe(true);
    }
  });
});
