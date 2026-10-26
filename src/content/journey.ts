import type { ContentDict } from '../i18n/content-en';
import type { MapLevel } from './topology';

export type LayerId = 'app' | 'tls' | 'transport' | 'network' | 'link' | 'physical';

export interface JourneyStep {
  /** key into content.journey */
  key: keyof ContentDict['journey'];
  from: string;
  to: string;
  layers: LayerId[];
  /** technical field rows — values are language-neutral */
  fields?: { k: string; v: string }[];
  /** before → after transformations at this hop */
  changes?: { field: string; before: string; after: string }[];
  /** deep link target */
  concept?: string;
}

export const LAYER_ORDER: { id: LayerId; label: string; hint: string }[] = [
  { id: 'app', label: 'APPLICATION', hint: 'HTTP · DNS' },
  { id: 'tls', label: 'TLS', hint: 'encryption' },
  { id: 'transport', label: 'TRANSPORT', hint: 'TCP · UDP · QUIC' },
  { id: 'network', label: 'NETWORK', hint: 'IP' },
  { id: 'link', label: 'LINK', hint: 'Ethernet · Wi-Fi' },
  { id: 'physical', label: 'PHYSICAL', hint: 'signals' },
];

/** The canonical journey, expressed on the L2 (home network) topology. */
export const JOURNEY: JourneyStep[] = [
  {
    key: 'request',
    from: 'device',
    to: 'device',
    layers: ['app'],
    fields: [
      { k: 'Method', v: 'GET /' },
      { k: 'Host', v: 'example.com' },
      { k: 'Scheme', v: 'https · port 443' },
    ],
    concept: 'http',
  },
  {
    key: 'dns',
    from: 'device',
    to: 'dns',
    layers: ['app', 'transport', 'network', 'link'],
    fields: [
      { k: 'Query', v: 'A example.com' },
      { k: 'Resolver', v: '1.1.1.1:53 · UDP' },
      { k: 'Answer', v: '93.184.215.14 · TTL 3600' },
    ],
    concept: 'dns',
  },
  {
    key: 'connect',
    from: 'device',
    to: 'switch',
    layers: ['app', 'tls', 'transport', 'network'],
    fields: [
      { k: 'Handshake', v: 'SYN · SYN-ACK · ACK' },
      { k: 'TLS', v: 'ClientHello → Certificate → Finished' },
      { k: 'Cipher', v: 'TLS_AES_128_GCM_SHA256' },
    ],
    concept: 'tls',
  },
  {
    key: 'frame',
    from: 'switch',
    to: 'router',
    layers: ['transport', 'network', 'link', 'physical'],
    fields: [
      { k: 'Src MAC', v: '8C:85:90:1A:2B:3C' },
      { k: 'Dst MAC', v: 'AA:BB:CC:DD:EE:FF' },
      { k: 'EtherType', v: '0x0800 · IPv4' },
    ],
    concept: 'packet',
  },
  {
    key: 'route',
    from: 'router',
    to: 'nat',
    layers: ['network', 'link'],
    fields: [
      { k: 'Route', v: '0.0.0.0/0 → 203.0.113.1' },
      { k: 'Match', v: 'default · no local prefix' },
    ],
    changes: [{ field: 'TTL', before: '64', after: '63' }],
    concept: 'routing',
  },
  {
    key: 'nat',
    from: 'nat',
    to: 'firewall',
    layers: ['network', 'transport'],
    changes: [
      { field: 'Source IP', before: '192.168.1.10', after: '203.0.113.5' },
      { field: 'Source port', before: '53124', after: '60231' },
      { field: 'Destination', before: '93.184.215.14:443', after: '93.184.215.14:443' },
    ],
    concept: 'nat',
  },
  {
    key: 'isp',
    from: 'router',
    to: 'isp',
    layers: ['network', 'link', 'physical'],
    fields: [
      { k: 'Src', v: '203.0.113.5:60231' },
      { k: 'Dst', v: '93.184.215.14:443' },
    ],
    changes: [{ field: 'TTL', before: '63', after: '58' }],
    concept: 'isp',
  },
  {
    key: 'edge',
    from: 'isp',
    to: 'server',
    layers: ['app', 'tls', 'network'],
    fields: [
      { k: 'Edge', v: 'cache lookup · hit or miss' },
      { k: 'Saved', v: '~150 ms if served locally' },
    ],
    concept: 'cdn',
  },
  {
    key: 'server',
    from: 'isp',
    to: 'server',
    layers: ['app', 'tls', 'transport'],
    fields: [
      { k: 'Status', v: '200 OK' },
      { k: 'Content-Type', v: 'text/html' },
      { k: 'Backend', v: '10.20.0.7' },
    ],
    concept: 'datacenter',
  },
  {
    key: 'render',
    from: 'server',
    to: 'device',
    layers: ['app', 'tls', 'transport', 'network', 'link', 'physical'],
    changes: [
      { field: 'Dst IP', before: '203.0.113.5', after: '192.168.1.10' },
      { field: 'Dst port', before: '60231', after: '53124' },
    ],
    concept: 'packet',
  },
];

/** Journey used on the map, per abstraction level (subset of hops that exist there). */
export const JOURNEY_BY_LEVEL: Record<MapLevel, JourneyStep[]> = {
  l1: [
    { key: 'request', from: 'device', to: 'device', layers: ['app'], fields: [{ k: 'Request', v: 'GET https://example.com/' }] },
    { key: 'frame', from: 'device', to: 'router', layers: ['link', 'physical'] },
    {
      key: 'nat',
      from: 'router',
      to: 'isp',
      layers: ['network', 'transport'],
      changes: [{ field: 'Source', before: '192.168.1.10:53124', after: '203.0.113.5:60231' }],
    },
    { key: 'isp', from: 'isp', to: 'internet', layers: ['network', 'physical'], changes: [{ field: 'TTL', before: '63', after: '58' }] },
    { key: 'server', from: 'internet', to: 'server', layers: ['app', 'tls'], fields: [{ k: 'Status', v: '200 OK' }] },
    { key: 'render', from: 'server', to: 'device', layers: ['app', 'transport', 'network'] },
  ],
  l2: JOURNEY,
  l3: [
    { key: 'request', from: 'home', to: 'isp', layers: ['app', 'network'] },
    { key: 'route', from: 'isp', to: 'ixp', layers: ['network'], fields: [{ k: 'Preference', v: 'peer 100 > transit 80' }], concept: 'bgp' },
    { key: 'edge', from: 'ixp', to: 'cdn', layers: ['app', 'tls'], fields: [{ k: 'Result', v: 'cache hit at the edge' }], concept: 'cdn' },
    { key: 'isp', from: 'cdn', to: 'cloud', layers: ['network'], fields: [{ k: 'On miss', v: 'shield tier → origin' }] },
    { key: 'server', from: 'cloud', to: 'dc', layers: ['app'], fields: [{ k: 'Status', v: '200 OK' }], concept: 'datacenter' },
  ],
  l4: [
    { key: 'request', from: 'userEu', to: 'edgeEu', layers: ['app'], fields: [{ k: 'Round trip', v: '≈2–5 ms' }], concept: 'cdn' },
    { key: 'route', from: 'userEu', to: 'fra', layers: ['network'], fields: [{ k: 'On a miss', v: 'toward the exchange' }], concept: 'ixp' },
    { key: 'isp', from: 'fra', to: 'lon', layers: ['network', 'physical'] },
    {
      key: 'edge',
      from: 'lon',
      to: 'nyc',
      layers: ['physical'],
      fields: [
        { k: 'Distance', v: '≈6,000 km' },
        { k: 'One way', v: '≈30 ms' },
      ],
      concept: 'submarine',
    },
    { key: 'server', from: 'nyc', to: 'ash', layers: ['app'], fields: [{ k: 'Status', v: '200 OK' }], concept: 'datacenter' },
    { key: 'render', from: 'ash', to: 'userEu', layers: ['app', 'network', 'physical'] },
  ],
};
