import type { Route, ProtocolHeader, Packet } from '../types';

// ── IPv4 helpers ──────────────────────────────────────────────

export function parseIPv4(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = parseInt(p, 10);
    if (v < 0 || v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function ipv4ToString(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function ipv4ToBinary(ip: string): string[] {
  const n = parseIPv4(ip);
  if (n === null) return [];
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map((o) => o.toString(2).padStart(8, '0'));
}

export function prefixToMask(prefix: number): number {
  if (prefix <= 0) return 0;
  if (prefix >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function maskToPrefix(mask: string): number | null {
  const n = parseIPv4(mask);
  if (n === null) return null;
  const bin = n.toString(2).padStart(32, '0');
  if (!/^1*0*$/.test(bin)) return null;
  return bin.split('1').length - 1;
}

export interface SubnetInfo {
  cidr: string;
  network: string;
  broadcast: string;
  mask: string;
  prefix: number;
  hostBits: number;
  totalAddresses: number;
  usableHosts: number;
  firstHost: string;
  lastHost: string;
  networkBinary: string;
}

export function calculateSubnet(cidr: string): SubnetInfo | null {
  const [ipStr, prefixStr] = cidr.trim().split('/');
  const ip = parseIPv4(ipStr ?? '');
  const prefix = parseInt(prefixStr ?? '', 10);
  if (ip === null || isNaN(prefix) || prefix < 0 || prefix > 32) return null;
  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hostBits = 32 - prefix;
  const total = 2 ** hostBits;
  const usable = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, total - 2);
  return {
    cidr: `${ipv4ToString(network)}/${prefix}`,
    network: ipv4ToString(network),
    broadcast: ipv4ToString(broadcast),
    mask: ipv4ToString(mask),
    prefix,
    hostBits,
    totalAddresses: total,
    usableHosts: usable,
    firstHost: ipv4ToString(prefix >= 31 ? network : network + 1),
    lastHost: ipv4ToString(prefix >= 31 ? broadcast : broadcast - 1),
    networkBinary: network.toString(2).padStart(32, '0'),
  };
}

export function ipInCidr(ip: string, cidr: string): boolean {
  const n = parseIPv4(ip);
  const [netStr, prefixStr] = cidr.split('/');
  const net = parseIPv4(netStr ?? '');
  const prefix = parseInt(prefixStr ?? '', 10);
  if (n === null || net === null || isNaN(prefix)) return false;
  const mask = prefixToMask(prefix);
  return ((n & mask) >>> 0) === ((net & mask) >>> 0);
}

export function isPrivateIPv4(ip: string): boolean {
  return ipInCidr(ip, '10.0.0.0/8') || ipInCidr(ip, '172.16.0.0/12') || ipInCidr(ip, '192.168.0.0/16');
}

export function classifyIPv4(ip: string): string {
  if (parseIPv4(ip) === null) return 'invalid';
  if (ipInCidr(ip, '127.0.0.0/8')) return 'loopback';
  if (isPrivateIPv4(ip)) return 'private (RFC 1918)';
  if (ipInCidr(ip, '169.254.0.0/16')) return 'link-local';
  if (ipInCidr(ip, '100.64.0.0/10')) return 'shared address space (CGNAT)';
  if (ipInCidr(ip, '224.0.0.0/4')) return 'multicast';
  if (ipInCidr(ip, '0.0.0.0/8')) return 'this network';
  return 'public (globally routable)';
}

// ── Routing: longest prefix match ─────────────────────────────

export interface RouteMatch {
  route: Route;
  prefixLength: number;
}

export function longestPrefixMatch(destination: string, table: Route[]): RouteMatch | null {
  let best: RouteMatch | null = null;
  for (const route of table) {
    if (ipInCidr(destination, route.prefix)) {
      const len = parseInt(route.prefix.split('/')[1] ?? '0', 10);
      if (!best || len > best.prefixLength || (len === best.prefixLength && (route.metric ?? 0) < (best.route.metric ?? 0))) {
        best = { route, prefixLength: len };
      }
    }
  }
  return best;
}

export function matchingRoutes(destination: string, table: Route[]): Route[] {
  return table.filter((r) => ipInCidr(destination, r.prefix));
}

// ── NAT model (simplified NAPT / port-address translation) ────

export interface NatEntry {
  privateIp: string;
  privatePort: number;
  publicIp: string;
  publicPort: number;
  destIp: string;
  destPort: number;
  protocol: 'TCP' | 'UDP';
}

export class NatTable {
  entries: NatEntry[] = [];
  private nextPort: number;
  constructor(public publicIp: string, startPort = 60000) {
    this.nextPort = startPort;
  }
  translateOutbound(privateIp: string, privatePort: number, destIp: string, destPort: number, protocol: 'TCP' | 'UDP' = 'TCP'): NatEntry {
    const existing = this.entries.find(
      (e) => e.privateIp === privateIp && e.privatePort === privatePort && e.destIp === destIp && e.destPort === destPort && e.protocol === protocol,
    );
    if (existing) return existing;
    const entry: NatEntry = { privateIp, privatePort, publicIp: this.publicIp, publicPort: this.nextPort++, destIp, destPort, protocol };
    this.entries.push(entry);
    return entry;
  }
  translateInbound(publicPort: number, fromIp: string, fromPort: number, protocol: 'TCP' | 'UDP' = 'TCP'): NatEntry | null {
    return (
      this.entries.find((e) => e.publicPort === publicPort && e.destIp === fromIp && e.destPort === fromPort && e.protocol === protocol) ?? null
    );
  }
}

// ── TCP state model (simplified, client + server) ─────────────

export type TcpState =
  | 'CLOSED'
  | 'LISTEN'
  | 'SYN_SENT'
  | 'SYN_RECEIVED'
  | 'ESTABLISHED'
  | 'FIN_WAIT_1'
  | 'FIN_WAIT_2'
  | 'CLOSE_WAIT'
  | 'LAST_ACK'
  | 'TIME_WAIT';

export interface TcpSegment {
  id: number;
  direction: 'c2s' | 's2c';
  flags: string[];
  seq: number;
  ack: number;
  len: number;
  srcPort: number;
  dstPort: number;
  lost: boolean;
  retransmission: boolean;
  label: string;
}

export interface TcpSimState {
  client: TcpState;
  server: TcpState;
  clientSeq: number;
  serverSeq: number;
  clientAck: number;
  serverAck: number;
  segments: TcpSegment[];
  log: { simple: string; technical: string }[];
  phase: 'idle' | 'handshake' | 'established' | 'closing' | 'closed';
  pendingData: number[]; // sizes of data chunks still to send
  unacked: TcpSegment | null;
  clientPort: number;
  serverPort: number;
}

export function createTcpSim(dataChunks: number[] = [100, 100, 100], clientPort = 53124, serverPort = 443): TcpSimState {
  return {
    client: 'CLOSED',
    server: 'LISTEN',
    clientSeq: 1000,
    serverSeq: 5000,
    clientAck: 0,
    serverAck: 0,
    segments: [],
    log: [],
    phase: 'idle',
    pendingData: [...dataChunks],
    unacked: null,
    clientPort,
    serverPort,
  };
}

let segId = 1;
function seg(partial: Omit<TcpSegment, 'id'>): TcpSegment {
  return { id: segId++, ...partial };
}

/**
 * Advance the TCP simulation by one step. `lose` marks the next transmitted
 * segment as lost so retransmission can be demonstrated.
 */
export function tcpStep(s: TcpSimState, lose = false): TcpSimState {
  const n: TcpSimState = { ...s, segments: [...s.segments], log: [...s.log], pendingData: [...s.pendingData] };
  const push = (segment: TcpSegment, simple: string, technical: string) => {
    n.segments.push(segment);
    n.log.push({ simple, technical });
  };
  const ports = { srcPort: n.clientPort, dstPort: n.serverPort };
  const rports = { srcPort: n.serverPort, dstPort: n.clientPort };

  // Retransmission of an unacknowledged lost segment
  if (n.unacked) {
    const r = n.unacked;
    const rt = seg({ ...r, lost: lose, retransmission: true, label: r.label + ' (retransmit)' });
    n.unacked = lose ? rt : null;
    push(
      rt,
      lose ? 'The retransmitted copy was also lost. TCP will try again.' : 'No acknowledgement arrived in time, so the sender sends the same data again.',
      lose
        ? `Retransmission timer expired again; resend seq=${r.seq} (RTO backs off exponentially).`
        : `RTO expired for seq=${r.seq}; retransmitting ${r.len} byte(s) with the same sequence number so the receiver can place them in order.`,
    );
    if (!lose) {
      if (rt.len > 0) return applyDelivery(n, rt); // data delivered → cumulative ACK
      // Control segment delivered: advance the handshake state machine accordingly.
      if (rt.flags.includes('SYN') && rt.direction === 'c2s') {
        n.log.push({ simple: 'The SYN finally reached the server.', technical: 'SYN received; server will respond with SYN-ACK.' });
      } else if (rt.flags.includes('SYN') && rt.direction === 's2c') {
        n.log.push({ simple: 'The SYN-ACK finally reached the client.', technical: 'SYN-ACK received; client will complete the handshake with ACK.' });
      } else if (rt.flags.includes('ACK') && n.phase === 'handshake') {
        n.server = 'ESTABLISHED';
        n.serverSeq += 1;
        n.serverAck = n.clientSeq;
        n.phase = 'established';
        n.log.push({ simple: 'The final ACK arrived; both sides are connected.', technical: 'Server enters ESTABLISHED. (Real stacks also accept the ACK piggybacked on the first data segment.)' });
      }
      return n;
    }
    return n;
  }

  switch (n.phase) {
    case 'idle': {
      const syn = seg({ direction: 'c2s', flags: ['SYN'], seq: n.clientSeq, ack: 0, len: 0, ...ports, lost: lose, retransmission: false, label: 'SYN' });
      n.client = 'SYN_SENT';
      n.phase = 'handshake';
      if (lose) n.unacked = syn;
      push(syn, 'Client: "Hello, I want to talk. Here is my starting number."', `SYN seq=${n.clientSeq}. Client enters SYN_SENT. The ISN is randomised in real stacks.`);
      return n;
    }
    case 'handshake': {
      if (n.client === 'SYN_SENT' && n.server === 'LISTEN') {
        const sa = seg({ direction: 's2c', flags: ['SYN', 'ACK'], seq: n.serverSeq, ack: n.clientSeq + 1, len: 0, ...rports, lost: lose, retransmission: false, label: 'SYN-ACK' });
        n.server = 'SYN_RECEIVED';
        if (lose) {
          n.unacked = sa;
        }
        push(sa, 'Server: "Got it! I want to talk too. Here is MY starting number."', `SYN-ACK seq=${n.serverSeq} ack=${n.clientSeq + 1}. Server enters SYN_RECEIVED. SYN consumes one sequence number.`);
        return n;
      }
      if (n.server === 'SYN_RECEIVED') {
        n.clientSeq += 1;
        n.clientAck = n.serverSeq + 1;
        const ack = seg({ direction: 'c2s', flags: ['ACK'], seq: n.clientSeq, ack: n.clientAck, len: 0, ...ports, lost: lose, retransmission: false, label: 'ACK' });
        n.client = 'ESTABLISHED';
        if (!lose) {
          n.server = 'ESTABLISHED';
          n.serverSeq += 1;
          n.serverAck = n.clientSeq;
          n.phase = 'established';
        } else {
          n.unacked = ack;
        }
        push(ack, 'Client: "Great, I heard you. Let\'s go!" Both sides are now connected.', `ACK seq=${n.clientSeq} ack=${n.clientAck}. Both endpoints enter ESTABLISHED. Handshake complete after 1 RTT.`);
        return n;
      }
      return n;
    }
    case 'established': {
      if (n.pendingData.length > 0) {
        const len = n.pendingData.shift()!;
        const d = seg({ direction: 'c2s', flags: ['PSH', 'ACK'], seq: n.clientSeq, ack: n.clientAck, len, ...ports, lost: lose, retransmission: false, label: `DATA ${len}B` });
        push(d, `Client sends ${len} bytes of data.`, `Segment seq=${n.clientSeq} len=${len}. Receiver will ACK ${n.clientSeq + len} (next expected byte).`);
        if (lose) {
          n.unacked = d;
          n.log.push({ simple: 'This segment was lost in the network. The client waits for an ACK that never comes.', technical: 'Segment dropped. No ACK arrives; retransmission timer (RTO) is armed.' });
          return n;
        }
        return applyDelivery(n, d);
      }
      // start closing
      const fin = seg({ direction: 'c2s', flags: ['FIN', 'ACK'], seq: n.clientSeq, ack: n.clientAck, len: 0, ...ports, lost: false, retransmission: false, label: 'FIN' });
      n.client = 'FIN_WAIT_1';
      n.phase = 'closing';
      push(fin, 'Client: "I have nothing more to send."', `FIN seq=${n.clientSeq}. Client enters FIN_WAIT_1.`);
      return n;
    }
    case 'closing': {
      if (n.client === 'FIN_WAIT_1') {
        n.serverAck = n.clientSeq + 1;
        const a = seg({ direction: 's2c', flags: ['ACK'], seq: n.serverSeq, ack: n.serverAck, len: 0, ...rports, lost: false, retransmission: false, label: 'ACK' });
        n.server = 'CLOSE_WAIT';
        n.client = 'FIN_WAIT_2';
        push(a, 'Server: "Understood." The server may still send remaining data.', `ACK ack=${n.serverAck}. Server enters CLOSE_WAIT, client FIN_WAIT_2 (half-closed).`);
        return n;
      }
      if (n.server === 'CLOSE_WAIT') {
        const f = seg({ direction: 's2c', flags: ['FIN', 'ACK'], seq: n.serverSeq, ack: n.serverAck, len: 0, ...rports, lost: false, retransmission: false, label: 'FIN' });
        n.server = 'LAST_ACK';
        push(f, 'Server: "I am done too."', `FIN seq=${n.serverSeq}. Server enters LAST_ACK.`);
        return n;
      }
      if (n.server === 'LAST_ACK') {
        n.clientSeq += 1;
        n.clientAck = n.serverSeq + 1;
        const a = seg({ direction: 'c2s', flags: ['ACK'], seq: n.clientSeq, ack: n.clientAck, len: 0, ...ports, lost: false, retransmission: false, label: 'ACK' });
        n.server = 'CLOSED';
        n.client = 'TIME_WAIT';
        n.phase = 'closed';
        push(a, 'Client: "Bye!" The connection is closed. The client waits briefly in case anything arrives late.', `Final ACK. Server → CLOSED. Client → TIME_WAIT (2×MSL) to absorb delayed segments, then CLOSED.`);
        return n;
      }
      return n;
    }
    case 'closed':
      return n;
  }
}

function applyDelivery(n: TcpSimState, d: TcpSegment): TcpSimState {
  n.clientSeq = d.seq + d.len;
  n.serverAck = n.clientSeq;
  const ack = seg({ direction: 's2c', flags: ['ACK'], seq: n.serverSeq, ack: n.serverAck, len: 0, srcPort: n.serverPort, dstPort: n.clientPort, lost: false, retransmission: false, label: `ACK ${n.serverAck}` });
  n.segments.push(ack);
  n.log.push({ simple: `Server: "Received! Send me byte number ${n.serverAck} next."`, technical: `ACK ack=${n.serverAck} (cumulative acknowledgement). Sender may slide its window forward.` });
  return n;
}

// ── DNS simplified resolution model ───────────────────────────

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT';

export interface DnsRecord {
  name: string;
  type: DnsRecordType;
  value: string;
  ttl: number;
}

export interface DnsZoneData {
  [domain: string]: DnsRecord[];
}

export const DEMO_ZONES: DnsZoneData = {
  'example.com': [
    { name: 'example.com', type: 'A', value: '93.184.215.14', ttl: 3600 },
    { name: 'example.com', type: 'AAAA', value: '2606:2800:21f:cb07:6820:80da:af6b:8b2c', ttl: 3600 },
    { name: 'www.example.com', type: 'CNAME', value: 'example.com', ttl: 300 },
    { name: 'example.com', type: 'MX', value: '10 mail.example.com', ttl: 3600 },
    { name: 'example.com', type: 'NS', value: 'a.iana-servers.net', ttl: 86400 },
    { name: 'example.com', type: 'TXT', value: 'v=spf1 -all', ttl: 3600 },
  ],
  'learn.net': [
    { name: 'learn.net', type: 'A', value: '203.0.113.10', ttl: 600 },
    { name: 'learn.net', type: 'NS', value: 'ns1.learn.net', ttl: 86400 },
  ],
  'shop.org': [
    { name: 'shop.org', type: 'A', value: '198.51.100.7', ttl: 120 },
    { name: 'shop.org', type: 'AAAA', value: '2001:db8::7', ttl: 120 },
    { name: 'shop.org', type: 'NS', value: 'ns.shop.org', ttl: 86400 },
  ],
};

export interface DnsStep {
  from: string;
  to: string;
  simple: string;
  technical: string;
  cached?: boolean;
}

/** Split a hostname into registered domain and TLD (very simplified: last two labels). */
export function splitDomain(host: string): { tld: string; domain: string; sub: string } {
  const labels = host.toLowerCase().replace(/\.$/, '').split('.').filter(Boolean);
  const tld = labels[labels.length - 1] ?? '';
  const domain = labels.slice(-2).join('.');
  const sub = labels.slice(0, -2).join('.');
  return { tld, domain, sub };
}

export function resolveDns(host: string, type: DnsRecordType, cache: Set<string>): { steps: DnsStep[]; answer: DnsRecord[] } {
  const { tld, domain } = splitDomain(host);
  const steps: DnsStep[] = [];
  const zone = DEMO_ZONES[domain];
  const key = `${host}|${type}`;

  steps.push({ from: 'app', to: 'stub', simple: 'The browser asks the operating system: "What is the address of ' + host + '?"', technical: `getaddrinfo("${host}") → OS stub resolver checks /etc/hosts and the local cache.` });

  if (cache.has(key)) {
    steps.push({ from: 'stub', to: 'app', cached: true, simple: 'The answer was already remembered (cached), so no network query is needed.', technical: `Cache hit for ${key}; TTL not yet expired. Answer returned immediately.` });
    return { steps, answer: findRecords(host, type, zone) };
  }

  steps.push({ from: 'stub', to: 'resolver', simple: 'Not in cache. The OS asks the recursive resolver (usually your ISP\'s or a public one such as 1.1.1.1 / 8.8.8.8).', technical: `UDP/53 (or DoH/DoT) query to configured recursive resolver: QNAME=${host} QTYPE=${type} RD=1.` });
  steps.push({ from: 'resolver', to: 'root', simple: 'The resolver asks a root server: "Who handles .' + tld + '?"', technical: `Query to a root server (one of 13 root identities, anycast worldwide). Resolvers usually have the .${tld} NS cached and skip this.` });
  steps.push({ from: 'root', to: 'resolver', simple: 'Root: "I don\'t know ' + host + ', but here are the .' + tld + ' servers."', technical: `Referral: NS records for ${tld}. + glue A/AAAA records in the additional section.` });
  steps.push({ from: 'resolver', to: 'tld', simple: 'Resolver asks the .' + tld + ' server: "Who handles ' + domain + '?"', technical: `Query to .${tld} TLD server: QNAME=${host} QTYPE=${type}.` });
  steps.push({ from: 'tld', to: 'resolver', simple: 'TLD: "Here are the authoritative name servers for ' + domain + '."', technical: `Referral: NS records for ${domain}. (delegation) + glue.` });
  steps.push({ from: 'resolver', to: 'auth', simple: 'Resolver asks the authoritative server for ' + domain + ' directly.', technical: `Query to authoritative NS for ${domain}: QNAME=${host} QTYPE=${type}.` });

  const answer = findRecords(host, type, zone);
  if (!zone) {
    steps.push({ from: 'auth', to: 'resolver', simple: 'This demo only knows a few domains. In reality the authoritative server would answer or return NXDOMAIN.', technical: `Demo zone data not available for ${domain}; a real resolver would receive an answer, NODATA or NXDOMAIN (RCODE=3).` });
  } else if (answer.length === 0) {
    steps.push({ from: 'auth', to: 'resolver', simple: 'The name exists but has no record of that type.', technical: `NOERROR with empty answer section (NODATA) for QTYPE=${type}.` });
  } else {
    steps.push({ from: 'auth', to: 'resolver', simple: 'Authoritative server: "Here is the answer."', technical: `Authoritative answer (AA=1): ${answer.map((r) => `${r.name} ${r.ttl} IN ${r.type} ${r.value}`).join('; ')}` });
  }
  steps.push({ from: 'resolver', to: 'stub', simple: 'Resolver passes the answer back and remembers it for the TTL period.', technical: `Response cached by resolver for TTL seconds (${answer[0]?.ttl ?? 'n/a'} s). Also cached by the OS stub and often by the browser.` });
  steps.push({ from: 'stub', to: 'app', simple: 'The browser now knows where to connect.', technical: 'Application receives the socket address list and picks one (Happy Eyeballs may try IPv6 and IPv4 in parallel).' });
  cache.add(key);
  return { steps, answer };
}

function findRecords(host: string, type: DnsRecordType, zone?: DnsRecord[]): DnsRecord[] {
  if (!zone) return [];
  const h = host.toLowerCase();
  const direct = zone.filter((r) => r.name === h && r.type === type);
  if (direct.length) return direct;
  // Follow a CNAME
  const cname = zone.find((r) => r.name === h && r.type === 'CNAME');
  if (cname) {
    return [cname, ...zone.filter((r) => r.name === cname.value && r.type === type)];
  }
  return [];
}

// ── Packet encapsulation model ────────────────────────────────

export interface EncapsulationParams {
  srcMac: string;
  dstMac: string;
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  transport: 'TCP' | 'UDP';
  tls: boolean;
  httpRequest: string;
}

export function buildEncapsulation(p: EncapsulationParams): Packet {
  const appBytes = new TextEncoder().encode(p.httpRequest).length;
  const tlsBytes = p.tls ? appBytes + 5 + 16 : appBytes;
  const transportHeader = p.transport === 'TCP' ? 20 : 8;
  const ipBytes = tlsBytes + transportHeader + 20;
  const headers: ProtocolHeader[] = [
    {
      protocol: 'HTTP',
      layer: 'application',
      unit: 'message',
      fields: [
        { name: 'Request line', value: p.httpRequest.split('\n')[0] ?? '' },
        { name: 'Headers', value: p.httpRequest.split('\n').slice(1).join(' | ') || '(none)' },
        { name: 'Size', value: `${appBytes} bytes` },
      ],
    },
  ];
  if (p.tls) {
    headers.push({
      protocol: 'TLS',
      layer: 'presentation',
      unit: 'record',
      fields: [
        { name: 'Content type', value: '23 (application_data)', bits: 8 },
        { name: 'Legacy version', value: '0x0303 (TLS 1.2 for compatibility)', bits: 16 },
        { name: 'Length', value: `${appBytes + 16}`, bits: 16 },
        { name: 'Encrypted payload', value: `${appBytes} bytes ciphertext + 16-byte AEAD tag`, note: 'The HTTP request is encrypted; intermediaries cannot read it.' },
      ],
    });
  }
  headers.push(
    p.transport === 'TCP'
      ? {
          protocol: 'TCP',
          layer: 'transport',
          unit: 'segment',
          fields: [
            { name: 'Source port', value: String(p.srcPort), bits: 16 },
            { name: 'Destination port', value: String(p.dstPort), bits: 16 },
            { name: 'Sequence number', value: '1001', bits: 32 },
            { name: 'Acknowledgement number', value: '5001', bits: 32 },
            { name: 'Flags', value: 'PSH ACK', bits: 9 },
            { name: 'Window', value: '65535', bits: 16 },
            { name: 'Checksum', value: '0x1c46', bits: 16 },
          ],
        }
      : {
          protocol: 'UDP',
          layer: 'transport',
          unit: 'datagram',
          fields: [
            { name: 'Source port', value: String(p.srcPort), bits: 16 },
            { name: 'Destination port', value: String(p.dstPort), bits: 16 },
            { name: 'Length', value: String(tlsBytes + 8), bits: 16 },
            { name: 'Checksum', value: '0x8a3f', bits: 16 },
          ],
        },
  );
  headers.push({
    protocol: 'IPv4',
    layer: 'network',
    unit: 'packet',
    fields: [
      { name: 'Version', value: '4', bits: 4 },
      { name: 'IHL', value: '5 (20 bytes)', bits: 4 },
      { name: 'Total length', value: String(ipBytes), bits: 16 },
      { name: 'TTL', value: '64', bits: 8, note: 'Decremented by each router; prevents endless loops.' },
      { name: 'Protocol', value: p.transport === 'TCP' ? '6 (TCP)' : '17 (UDP)', bits: 8 },
      { name: 'Header checksum', value: '0x3f2a', bits: 16 },
      { name: 'Source IP', value: p.srcIp, bits: 32 },
      { name: 'Destination IP', value: p.dstIp, bits: 32 },
    ],
  });
  headers.push({
    protocol: 'Ethernet',
    layer: 'link',
    unit: 'frame',
    fields: [
      { name: 'Destination MAC', value: p.dstMac, bits: 48, note: 'Next hop on this link (e.g. the router), NOT the final server.' },
      { name: 'Source MAC', value: p.srcMac, bits: 48 },
      { name: 'EtherType', value: '0x0800 (IPv4)', bits: 16 },
      { name: 'Payload', value: `${ipBytes} bytes` },
      { name: 'FCS', value: 'CRC-32', bits: 32, note: 'Detects corrupted frames.' },
    ],
  });
  return {
    id: 'pkt-1',
    source: p.srcIp,
    destination: p.dstIp,
    protocol: 'HTTP',
    layer: 'application',
    payload: p.httpRequest,
    headers,
  };
}

// ── Reference data ────────────────────────────────────────────

export const COMMON_PORTS: { port: number; protocol: string; service: string; note: string }[] = [
  { port: 20, protocol: 'TCP', service: 'FTP data', note: 'Legacy file transfer' },
  { port: 21, protocol: 'TCP', service: 'FTP control', note: 'Legacy file transfer' },
  { port: 22, protocol: 'TCP', service: 'SSH', note: 'Secure remote shell, file copy, tunnels' },
  { port: 25, protocol: 'TCP', service: 'SMTP', note: 'Mail transfer between servers' },
  { port: 53, protocol: 'UDP/TCP', service: 'DNS', note: 'Name resolution' },
  { port: 67, protocol: 'UDP', service: 'DHCP server', note: 'Address assignment' },
  { port: 68, protocol: 'UDP', service: 'DHCP client', note: 'Address assignment' },
  { port: 80, protocol: 'TCP', service: 'HTTP', note: 'Unencrypted web' },
  { port: 123, protocol: 'UDP', service: 'NTP', note: 'Time synchronisation' },
  { port: 143, protocol: 'TCP', service: 'IMAP', note: 'Mail retrieval' },
  { port: 443, protocol: 'TCP/UDP', service: 'HTTPS / HTTP/3', note: 'TLS over TCP, or QUIC over UDP' },
  { port: 853, protocol: 'TCP', service: 'DNS over TLS', note: 'Encrypted DNS' },
  { port: 3306, protocol: 'TCP', service: 'MySQL', note: 'Database (should not be public)' },
  { port: 5432, protocol: 'TCP', service: 'PostgreSQL', note: 'Database (should not be public)' },
];
