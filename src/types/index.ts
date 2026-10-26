/**
 * Shared types for the network engine in `src/lib/network.ts`.
 * Educational/curriculum types live in `src/content` and `src/i18n`.
 */

export type Layer = 'application' | 'presentation' | 'transport' | 'network' | 'link' | 'physical';

export type Protocol = 'HTTP' | 'TLS' | 'TCP' | 'UDP' | 'IPv4' | 'Ethernet';

export interface HeaderField {
  name: string;
  value: string;
  bits?: number;
  note?: string;
}

/** One protocol header in an encapsulated packet. */
export interface ProtocolHeader {
  protocol: Protocol;
  layer: Layer;
  /** Unit name at this layer: frame, packet, segment, datagram, record, message. */
  unit: string;
  fields: HeaderField[];
}

/** A fully encapsulated packet, outermost header last. */
export interface Packet {
  id: string;
  source: string;
  destination: string;
  protocol: Protocol;
  layer: Layer;
  payload: string;
  headers: ProtocolHeader[];
}

/** A routing table entry. */
export interface Route {
  prefix: string;
  nextHop: string;
  iface: string;
  metric?: number;
}
