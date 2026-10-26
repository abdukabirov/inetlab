export const contentEn = {
  concepts: {
    internet: {
      title: 'What is the Internet?',
      tagline: 'Not one network — tens of thousands of them, agreeing to carry each other’s traffic.',
      simple: [
        'The Internet is not a single machine or company. It is roughly 75,000 independently owned networks — universities, phone companies, hosting providers, governments — that have agreed to pass data to each other.',
        'Nobody is in charge of the whole thing. What holds it together is a shared set of rules called protocols: agreements on how to address data, how to split it into pieces, and how to hand those pieces onward.',
      ],
      technical: [
        'Each independent network is an Autonomous System (AS) with its own number and its own routing policy. They interconnect through paid transit, settlement-free peering, and shared switching fabrics called Internet Exchange Points.',
        'The universal contract is the Internet Protocol: everything above it (web, email, video calls) and everything below it (fibre, copper, radio) can change independently, as long as both ends speak IP.',
      ],
      example:
        'When you load a page, your data may cross four or five different companies’ networks in under a tenth of a second — and none of them needed to know in advance that you existed.',
      terms: [
        { t: 'Protocol', d: 'An agreed set of rules two machines follow so they can understand each other.' },
        { t: 'Packet', d: 'A small chunk of data with addressing information attached.' },
        { t: 'Autonomous System', d: 'One independently operated network with its own routing policy.' },
      ],
      takeaway: 'The Internet is a voluntary agreement between many networks to forward each other’s packets using shared protocols.',
    },
    isp: {
      title: 'Your Internet provider',
      tagline: 'The company that connects your street to everyone else’s.',
      simple: [
        'An Internet Service Provider owns the cable, fibre or radio link that reaches your home, plus a large network behind it. You pay them to carry your traffic to the rest of the world.',
        'Your provider is itself a customer of, or a partner with, other networks. Traffic leaving your house travels up through their network and then out to whichever network can reach your destination.',
      ],
      technical: [
        'A typical ISP has four tiers: access (the last mile to you — DOCSIS, GPON, DSL, 5G), aggregation (thousands of customers combined), core (long-distance high-capacity links) and the edge, where they interconnect with other networks.',
        'At the edge the ISP buys transit from larger providers and peers directly with others. Routing policy usually prefers the cheapest valid path: customer routes first, then peers, then paid transit.',
      ],
      example:
        'Popular video is often served from a cache the content company installed inside the ISP’s own network — so it never crosses an expensive external link at all.',
      terms: [
        { t: 'Last mile', d: 'The final physical link from the provider’s network to your building.' },
        { t: 'Transit', d: 'Paying a bigger network to carry your traffic to the whole Internet.' },
        { t: 'Peering', d: 'Two networks exchanging traffic directly, usually without payment.' },
      ],
      takeaway: 'Your ISP is a network with a hierarchy: access, aggregation, core, and an edge where it meets other networks.',
    },
    'mac-ethernet': {
      title: 'MAC addresses, Ethernet and Wi-Fi',
      tagline: 'How devices on one local link identify each other.',
      simple: [
        'Before data can travel anywhere it has to get onto a wire or a radio channel. On that first link, devices identify each other with MAC addresses — a factory-assigned identifier on every network interface.',
        'The data is wrapped into a frame: the payload plus the sender’s MAC, the receiver’s MAC, and a checksum so corruption can be detected.',
      ],
      technical: [
        'A MAC address is 48 bits, usually written as twelve hexadecimal digits. It is only meaningful on the local link — every router strips the incoming frame and builds a new one with new MAC addresses for the next hop.',
        'Ethernet (IEEE 802.3) and Wi-Fi (IEEE 802.11) differ physically — one modulates voltage on copper, the other a radio carrier — but both deliver the same IP packets. A device with both has two MAC addresses; modern phones randomise theirs per network.',
      ],
      example:
        'A web server never learns your laptop’s MAC address. It only ever sees the MAC of the last router before it — the addresses are rewritten at every single hop.',
      terms: [
        { t: 'MAC address', d: 'A 48-bit identifier for a network interface, valid on the local link only.' },
        { t: 'Frame', d: 'The link-layer unit: payload plus MAC addresses and a checksum.' },
        { t: 'MTU', d: 'The largest payload a link will carry in one frame, typically 1500 bytes.' },
      ],
      takeaway: 'MAC addresses are local. They get you across one link, not across the Internet.',
    },
    switch: {
      title: 'Switches',
      tagline: 'The device that learns who is plugged in where.',
      simple: [
        'A switch connects the devices in one building or home. When a frame arrives, it looks at the destination MAC address and sends it out only the port where that device lives.',
        'It learns by watching: every time a frame arrives, it records which port the sender is on. Nobody configures it.',
      ],
      technical: [
        'The switch maintains a MAC address table mapping addresses to ports. Unknown destinations and broadcast frames are flooded out every port except the one they arrived on; the reply teaches the switch where that device is.',
        'A switch operates at the link layer and does not look at IP addresses. All ports in the same broadcast domain hear broadcasts — VLANs split one physical switch into several logical ones.',
      ],
      example:
        'Your laptop sends a file to a printer on the same network. The switch forwards it directly to the printer’s port. The router is never involved.',
      terms: [
        { t: 'MAC table', d: 'The switch’s learned map of which address is on which port.' },
        { t: 'Flooding', d: 'Sending a frame out every port because the destination is unknown.' },
        { t: 'Broadcast domain', d: 'The set of devices that receive each other’s broadcast frames.' },
      ],
      takeaway: 'Switches forward frames by MAC address and learn the topology automatically from traffic.',
    },
    router: {
      title: 'Routers',
      tagline: 'The device that decides which way is out.',
      simple: [
        'A router connects different networks. It looks at the destination IP address of each packet and decides which of its links leads that way.',
        'Your home router is really several devices in one box: a switch, a Wi-Fi access point, a router, an address server, an address translator and a basic firewall.',
      ],
      technical: [
        'Forwarding uses longest-prefix match: among all routes whose prefix matches the destination, the most specific one wins. A default route (0.0.0.0/0) catches everything else.',
        'At each hop the router decrements the packet’s TTL, recomputes the header checksum, discards the incoming frame and builds a new one addressed to the next hop’s MAC. The IP addresses stay the same end to end — unless NAT rewrites them.',
      ],
      example:
        'A router holding routes for 10.0.0.0/8 and 10.1.0.0/16 will send a packet for 10.1.5.5 down the /16 path — the more specific match always wins.',
      terms: [
        { t: 'Routing table', d: 'The list of destination prefixes with the next hop for each.' },
        { t: 'Longest-prefix match', d: 'The rule that the most specific matching route is chosen.' },
        { t: 'TTL', d: 'A counter decremented at each hop so lost packets cannot circulate forever.' },
      ],
      takeaway: 'Routers forward by IP prefix, always choosing the most specific matching route.',
    },
    dhcp: {
      title: 'DHCP: getting an address automatically',
      tagline: 'How a device that knows nothing gets everything it needs.',
      simple: [
        'When you join a network your device has no address and does not know who to ask. So it shouts to everyone: “does anyone have an address for me?”',
        'A server answers with an offer, your device accepts it, and the server confirms. Four messages, and you are configured.',
      ],
      technical: [
        'The exchange is Discover, Offer, Request, Acknowledge — often remembered as DORA. It runs over UDP: the client uses port 68, the server port 67. The first message is broadcast because the client has no address yet.',
        'The reply carries far more than an address: the subnet mask, the default gateway, and DNS server addresses. The address is a lease with an expiry, renewed at half its lifetime. IPv6 uses Router Advertisements and/or DHCPv6 instead.',
      ],
      example:
        'If no server answers, most devices assign themselves a 169.254.x.x address. You can reach other machines on the same cable, but nothing beyond it.',
      terms: [
        { t: 'Lease', d: 'A temporary address assignment that must be renewed before it expires.' },
        { t: 'Default gateway', d: 'The router address where everything non-local is sent.' },
        { t: 'Broadcast', d: 'A frame delivered to every device on the local network.' },
      ],
      takeaway: 'DHCP hands out an address plus the mask, gateway and DNS servers, as a lease that expires.',
    },
    ip: {
      title: 'IP addresses',
      tagline: 'The addressing system that makes global delivery possible.',
      simple: [
        'An IP address identifies where a device is attached to the network, so packets can be routed to it. An IPv4 address is four numbers between 0 and 255, like 192.168.1.10.',
        'Some ranges are special: addresses starting 192.168, 10, or 172.16–31 are private and used inside homes and companies. 127.0.0.1 always means “this very machine”.',
      ],
      technical: [
        'IPv4 addresses are 32 bits, which gives about 4.3 billion — not enough. IPv6 uses 128 bits, written as hexadecimal groups like 2001:db8::1, which removes the scarcity entirely and makes address translation unnecessary.',
        'Addresses are hierarchical: the leading bits identify a network, the rest identify a host inside it. That hierarchy is what lets a router hold one entry for millions of addresses instead of one per device.',
      ],
      example:
        'Private addresses are not “unroutable” — they route perfectly inside your home or company. They are simply filtered at the public Internet edge by convention.',
      terms: [
        { t: 'IPv4', d: 'The 32-bit address version, written as four decimal octets.' },
        { t: 'IPv6', d: 'The 128-bit version, written as hexadecimal groups.' },
        { t: 'Loopback', d: 'The address 127.0.0.1 (or ::1) meaning the local machine itself.' },
      ],
      takeaway: 'IP addresses are hierarchical location identifiers; IPv6 exists because IPv4 ran out of them.',
    },
    packet: {
      title: 'Packets and encapsulation',
      tagline: 'Every layer wraps the one above it in its own envelope.',
      simple: [
        'Data does not travel as one big lump. It is cut into packets, and each packet is wrapped in layers of addressing information — like a letter inside an envelope inside a delivery box.',
        'At the destination the wrapping is removed in reverse order, and the original data comes out intact.',
      ],
      technical: [
        'An HTTPS request is encrypted into a TLS record, which becomes the payload of a TCP segment (adding ports and sequence numbers), which becomes the payload of an IP packet (adding source and destination addresses), which becomes the payload of an Ethernet frame (adding MAC addresses and a checksum).',
        'Each header carries a key telling the receiver which protocol comes next: EtherType 0x0800 means IPv4, IP protocol 6 means TCP, TCP port 443 means the HTTPS service. The precise names differ per layer — message, segment, packet, frame — though people say “packet” for all of them.',
      ],
      example:
        'A 300-byte request becomes roughly 390 bytes on the wire once TLS, TCP, IP and Ethernet headers are added. Routers read only the IP part; the rest is opaque to them.',
      terms: [
        { t: 'Encapsulation', d: 'Wrapping data from a higher layer inside a lower layer’s header.' },
        { t: 'Segment', d: 'The TCP unit; UDP’s equivalent is called a datagram.' },
        { t: 'Header', d: 'The metadata a layer prepends to the data it is carrying.' },
      ],
      takeaway: 'Layering means each protocol solves one problem and can be replaced without touching the others.',
    },
    subnet: {
      title: 'Subnets and CIDR',
      tagline: 'Where the network part of an address ends and the host part begins.',
      simple: [
        'An address has two halves: which network, and which device on that network. The dividing line is the subnet mask — written compactly as /24, /26 and so on.',
        'In 192.168.1.0/24, the first 24 bits identify the network, leaving 8 bits for devices: 256 addresses, of which 254 are usable.',
      ],
      technical: [
        'Usable hosts equal 2 to the power of the host bits, minus two — the all-zeros network address and the all-ones broadcast address are reserved. A /26 therefore has 62 usable hosts.',
        'A host decides whether a destination is local by masking both its own address and the destination with its mask and comparing. Same result means deliver directly; different means send to the default gateway.',
      ],
      example:
        'Splitting 192.168.1.0/24 into four /26 blocks gives four separate networks of 62 hosts each — useful for separating departments, guests or security zones.',
      terms: [
        { t: 'CIDR', d: 'Writing a network as address plus prefix length, e.g. 10.0.0.0/8.' },
        { t: 'Subnet mask', d: 'The pattern of ones and zeros marking the network/host boundary.' },
        { t: 'Broadcast address', d: 'The last address in a subnet, reserved to reach all hosts.' },
      ],
      takeaway: 'The prefix length says how many leading bits are the network; the rest addresses hosts.',
    },
    nat: {
      title: 'NAT: sharing one public address',
      tagline: 'How a dozen devices appear on the Internet as one.',
      simple: [
        'Your provider usually gives your household a single public address, but you have many devices. Your router rewrites the sender address of outgoing packets to its public one, and remembers which device each conversation belongs to.',
        'When a reply comes back, the router looks up its notes and rewrites the address back to the right device.',
      ],
      technical: [
        'The common form rewrites both address and port, keyed by a five-part tuple: protocol, source address and port, destination address and port. Checksums are recomputed and entries expire after a period of inactivity.',
        'Two things NAT is not. It is not a firewall — dropping unmatched inbound packets is a side effect, not a policy decision. And it is not required for IPv4: a device with its own public address needs no translation at all.',
      ],
      example:
        'Two laptops loading the same site both appear to the server as one address, distinguished only by different translated port numbers.',
      terms: [
        { t: 'Translation table', d: 'The router’s record mapping private endpoints to public ones.' },
        { t: 'Port forwarding', d: 'A permanent inbound mapping created manually.' },
        { t: 'CGNAT', d: 'Carrier-grade NAT, where the ISP shares one address across many customers.' },
      ],
      takeaway: 'NAT rewrites addresses and ports at the network boundary and keeps a table to reverse it.',
    },
    dns: {
      title: 'DNS: names into addresses',
      tagline: 'The distributed directory that turns example.com into a number.',
      simple: [
        'People remember names; packets need addresses. DNS is the system that translates one into the other.',
        'Your device asks a resolver. If it does not already know the answer, the resolver asks a root server which servers handle .com, then asks those which servers handle example.com, then asks those for the actual address.',
      ],
      technical: [
        'That full walk is rare. Answers are cached at the browser, the operating system and the resolver for the record’s TTL, so most lookups never reach a root server at all.',
        'DNS carries more than addresses: A for IPv4, AAAA for IPv6, CNAME for aliases, MX for mail, NS for delegation, TXT for verification. It traditionally runs over UDP port 53, with encrypted variants over TLS, HTTPS and QUIC.',
      ],
      example:
        'Before moving a site to a new server, operators lower the TTL from a day to a few minutes so that caches worldwide pick up the change quickly.',
      terms: [
        { t: 'Resolver', d: 'The server that performs the lookup on your behalf and caches the result.' },
        { t: 'Authoritative server', d: 'The server that holds the real records for a domain.' },
        { t: 'TTL', d: 'How many seconds a cache may keep an answer before asking again.' },
      ],
      takeaway: 'DNS is a delegated, heavily cached directory — the hierarchy exists so no single server has to know everything.',
    },
    ports: {
      title: 'Ports',
      tagline: 'One address, many conversations.',
      simple: [
        'An IP address gets data to the right computer. But that computer runs a browser, a mail client, a game. The port number says which program should receive it.',
        'Servers listen on well-known ports so clients know where to knock: 443 for HTTPS, 53 for DNS, 22 for secure shell.',
      ],
      technical: [
        'A port is a 16-bit number in the TCP or UDP header. A connection is identified by the full four-part tuple — source address, source port, destination address, destination port — which is why thousands of clients can talk to one server port at once.',
        'Clients use temporary high-numbered ports chosen by the operating system. Well-known port numbers are conventions, not guarantees: any program can be configured to listen anywhere.',
      ],
      example:
        'Two browser tabs open the same website. Same destination address and port; different source ports keep the two conversations apart.',
      terms: [
        { t: 'Socket', d: 'The combination of an address and a port that an application binds to.' },
        { t: 'Ephemeral port', d: 'A temporary high-numbered source port chosen per connection.' },
        { t: 'Well-known port', d: 'A conventional number for a service, such as 443 for HTTPS.' },
      ],
      takeaway: 'Address plus port identifies an application endpoint; the four-tuple identifies a connection.',
    },
    tcp: {
      title: 'TCP: reliable, ordered delivery',
      tagline: 'Turning an unreliable network into a dependable stream of bytes.',
      simple: [
        'IP makes no promises — packets can be lost, duplicated or arrive out of order. TCP fixes that by numbering every byte and confirming what arrived.',
        'A connection starts with a three-step handshake: the client says hello with a starting number, the server acknowledges and sends its own, the client acknowledges that.',
      ],
      technical: [
        'Each segment carries the sequence number of its first byte. The receiver replies with the number of the next byte it expects. If no acknowledgement arrives before a timer expires, or duplicates suggest a gap, the sender retransmits.',
        'TCP also paces itself: flow control stops it overwhelming the receiver’s buffer, congestion control stops it overwhelming the network. Its guarantee ends at the receiving socket — whether the application actually processed the data is a separate matter.',
      ],
      example:
        'Lose one segment in the middle of a page download and everything after it waits in a buffer until the retransmission arrives. That stalling is exactly what QUIC was designed to avoid.',
      terms: [
        { t: 'Handshake', d: 'The three-message exchange that opens a connection.' },
        { t: 'Sequence number', d: 'The position of a segment’s first byte in the overall stream.' },
        { t: 'Retransmission', d: 'Sending data again when its acknowledgement does not arrive.' },
      ],
      takeaway: 'TCP delivers an in-order, error-checked byte stream by numbering bytes and acknowledging them.',
    },
    udp: {
      title: 'UDP: fast and simple',
      tagline: 'No handshake, no retries — and sometimes that is exactly right.',
      simple: [
        'UDP adds almost nothing to IP: just the port numbers, a length and a checksum. There is no connection setup and no retransmission.',
        'That sounds worse, but for live audio a late packet is useless anyway — better to skip it than to wait.',
      ],
      technical: [
        'UDP is message-oriented: each datagram is delivered whole or not at all, so boundaries are preserved. TCP is stream-oriented and has no message boundaries at all.',
        'UDP has no built-in congestion control, so anything sending serious volume over it must implement its own — which is precisely what QUIC and real-time media protocols do.',
      ],
      example:
        'DNS queries are small and easy to repeat, so they use UDP. If the answer does not come back, the resolver just asks again.',
      terms: [
        { t: 'Datagram', d: 'A self-contained UDP message with preserved boundaries.' },
        { t: 'Connectionless', d: 'No setup exchange before data is sent.' },
        { t: 'Checksum', d: 'A value used to detect accidental corruption in transit.' },
      ],
      takeaway: 'UDP trades reliability for latency and lets the application decide what to do about loss.',
    },
    quic: {
      title: 'QUIC',
      tagline: 'A modern transport built on top of UDP — not merely “UDP with encryption”.',
      simple: [
        'QUIC does everything TCP does — reliable, ordered delivery with congestion control — but it is implemented on top of UDP and includes encryption from the start.',
        'It was built on UDP because the equipment in the middle of the Internet already understands UDP, so a brand-new protocol would have been blocked everywhere.',
      ],
      technical: [
        'QUIC carries several independent streams in one connection, so a lost packet only stalls the stream it belonged to, not all of them. TLS 1.3 is integrated into its handshake, so a connection is established and encrypted in a single round trip.',
        'Connections are identified by a connection ID rather than by addresses, so a phone moving from Wi-Fi to mobile data keeps its connection alive. HTTP/3 is HTTP semantics carried over QUIC — it never uses TCP.',
      ],
      example:
        'Walk out of Wi-Fi range mid-video-call over QUIC and the session survives the address change; over TCP the connection would have to be rebuilt.',
      terms: [
        { t: 'Stream', d: 'An independently ordered flow of data inside one QUIC connection.' },
        { t: 'Connection ID', d: 'An identifier that survives changes of IP address.' },
        { t: '0-RTT', d: 'Sending data in the very first packet when resuming a known connection.' },
      ],
      takeaway: 'QUIC is a full transport with built-in TLS 1.3 that uses UDP as its carrier; HTTP/3 runs on it.',
    },
    http: {
      title: 'HTTP',
      tagline: 'The request and response language of the web.',
      simple: [
        'The browser sends a request: a method (what to do), a path (to what), and headers (extra information). The server sends back a status code and usually some content.',
        'GET fetches something. POST submits something. 200 means success, 404 means not found, 500 means the server broke.',
      ],
      technical: [
        'HTTP/1.1 sends plain text over one TCP connection at a time. HTTP/2 keeps identical meaning but uses binary frames and many parallel streams over one connection, with compressed headers.',
        'HTTP/3 keeps the same semantics again but runs over QUIC, removing the transport-level stalling that affects HTTP/2 when a TCP segment is lost.',
      ],
      example:
        'Requesting a page that moved returns 301 with a Location header; the browser automatically repeats the request at the new address.',
      terms: [
        { t: 'Method', d: 'The action requested: GET, POST, PUT, PATCH, DELETE.' },
        { t: 'Status code', d: 'A three-digit result: 2xx success, 3xx redirect, 4xx client error, 5xx server error.' },
        { t: 'Header', d: 'A name–value pair carrying metadata about the request or response.' },
      ],
      takeaway: 'All three HTTP versions mean the same thing; they differ in how they are framed and transported.',
    },
    tls: {
      title: 'TLS and HTTPS',
      tagline: 'Proving who you are talking to, and keeping the conversation private.',
      simple: [
        'HTTPS is just HTTP inside an encrypted tunnel. TLS builds that tunnel and does three jobs: it proves the server is who it claims to be, it hides the content, and it detects tampering.',
        'The server presents a certificate — a document signed by an authority your browser already trusts — that ties its name to a cryptographic key.',
      ],
      technical: [
        'The server never sends you the encryption key. Both sides perform a key exchange in the open that lets them independently compute the same shared secret, which an eavesdropper cannot derive.',
        'That secret keys a fast symmetric cipher for the actual data. Because the exchange uses temporary keys, recording the traffic today and stealing the server’s long-term key tomorrow still does not reveal it.',
      ],
      example:
        'The padlock means the certificate matched the hostname and the tunnel is encrypted. It says nothing about whether the site owner is honest.',
      terms: [
        { t: 'Certificate', d: 'A signed document binding a domain name to a public key.' },
        { t: 'Key exchange', d: 'A method for two parties to agree a shared secret over an open channel.' },
        { t: 'Forward secrecy', d: 'Past sessions stay private even if the long-term key later leaks.' },
      ],
      takeaway: 'TLS provides authentication, confidentiality and integrity — and the secret key is never transmitted.',
    },
    routing: {
      title: 'Routing',
      tagline: 'How each router decides where to send a packet next.',
      simple: [
        'No router knows the whole path. Each one only knows which of its neighbours is a step in the right direction, and hands the packet over.',
        'That decision is repeated at every hop until the packet arrives — or until its hop counter runs out and it is discarded.',
      ],
      technical: [
        'Routers hold prefixes, not individual addresses. The forwarding decision picks the most specific matching prefix; a default route matches everything as a last resort.',
        'Routes come from three sources: directly connected links, static configuration, and dynamic protocols — link-state protocols inside one network, and BGP between networks.',
      ],
      example:
        'The traceroute tool works by sending packets with a hop counter of 1, then 2, then 3, and recording which router reports each expiry.',
      terms: [
        { t: 'Next hop', d: 'The neighbouring router a packet is handed to.' },
        { t: 'Default route', d: 'The catch-all entry used when nothing more specific matches.' },
        { t: 'Hop', d: 'One router-to-router step along a path.' },
      ],
      takeaway: 'Routing is a chain of local decisions; no single device holds the whole route.',
    },
    bgp: {
      title: 'BGP',
      tagline: 'How independent networks tell each other what they can reach.',
      simple: [
        'Networks announce to their neighbours which blocks of addresses they can deliver to. Those announcements are passed along, each network adding its own identifier to the path.',
        'Because everyone can see the full path, loops are impossible and each network can decide which offer to accept.',
      ],
      technical: [
        'BGP is a path-vector protocol. Announcements carry attributes: the list of networks traversed, the next hop, a local preference, and community tags used to signal policy.',
        'Selection is policy first, distance second. A network typically prefers routes learned from its customers over peers, and peers over paid transit — even when the customer path traverses more networks.',
      ],
      example:
        'Two neighbouring countries may exchange traffic through a hub hundreds of kilometres away, simply because that is where their networks have an agreement.',
      terms: [
        { t: 'Prefix', d: 'A block of addresses announced as reachable, e.g. 203.0.113.0/24.' },
        { t: 'AS path', d: 'The ordered list of networks an announcement has crossed.' },
        { t: 'Local preference', d: 'A network’s internal ranking that decides between competing routes.' },
      ],
      takeaway: 'BGP exchanges reachability, and business policy — not geography — usually decides the chosen path.',
    },
    as: {
      title: 'Autonomous Systems',
      tagline: 'The unit of independence on the Internet.',
      simple: [
        'An Autonomous System is one network under one administration, with one routing policy. Your ISP is one. A large cloud provider is one. A university can be one.',
        'Each has a number, and those numbers are what appear in the paths that networks advertise to each other.',
      ],
      technical: [
        'Inside an AS, a network runs its own protocols and can organise itself however it likes. Between ASes, only BGP announcements are exchanged — internal structure stays private.',
        'That separation is what makes the Internet scale: a router elsewhere needs to know that a prefix is reachable via a certain sequence of networks, not how any of those networks is built inside.',
      ],
      example:
        'There are roughly 75,000 active Autonomous System numbers, and the global routing table holds around a million IPv4 prefixes.',
      terms: [
        { t: 'ASN', d: 'The number that identifies an Autonomous System.' },
        { t: 'Internal routing', d: 'The protocols a network uses inside itself, invisible to others.' },
        { t: 'Route filtering', d: 'Deciding which announcements to accept or pass on.' },
      ],
      takeaway: 'An AS hides its internals and exposes only reachability — that abstraction is why the Internet scales.',
    },
    ixp: {
      title: 'Internet Exchange Points',
      tagline: 'Buildings where hundreds of networks meet and swap traffic directly.',
      simple: [
        'Instead of paying a third party to carry traffic between two local networks, those networks can plug into a shared switch in the same city and hand traffic straight over.',
        'That is an Internet Exchange Point: a neutral meeting place, usually a set of very large switches in one or more data centers.',
      ],
      technical: [
        'Members connect to a shared switching fabric and establish BGP sessions with each other, bilaterally or through a route server that redistributes announcements among many participants.',
        'The economics are the point: peering is usually settlement-free, while transit is billed. Routes learned at an exchange are normally preferred over transit routes for exactly that reason.',
      ],
      example:
        'Without a local exchange, two providers in the same city might send traffic to each other via another country — adding tens of milliseconds and a transit bill.',
      terms: [
        { t: 'Peering fabric', d: 'The shared switching platform members connect to.' },
        { t: 'Route server', d: 'A service that redistributes routes among many members at once.' },
        { t: 'Settlement-free', d: 'An interconnection where neither side pays the other.' },
      ],
      takeaway: 'Exchanges make local interconnection cheap, which keeps local traffic local and fast.',
    },
    cdn: {
      title: 'Content Delivery Networks',
      tagline: 'Copies of the content, placed near you.',
      simple: [
        'If a site’s only server is on another continent, every request has to cross an ocean twice. A CDN puts copies of the content in many cities and serves you from the nearest one.',
        'The first request for something in your region fetches it from the origin and stores it. Everyone after that gets the stored copy immediately.',
      ],
      technical: [
        'A hit is served from the edge cache; a miss is fetched from the origin, often via an intermediate shield tier that protects the origin from many simultaneous misses. Freshness is governed by cache headers and a TTL.',
        'Users reach the nearest edge through DNS answers tailored to their location, or through anycast — announcing the same address from many locations and letting routing deliver to the closest.',
      ],
      example:
        'Large content networks install caches inside ISPs, so popular video never crosses the exchange point at all.',
      terms: [
        { t: 'Edge', d: 'A cache location close to users.' },
        { t: 'Cache hit / miss', d: 'Whether the edge already had a fresh copy of the content.' },
        { t: 'Origin', d: 'The authoritative server the content ultimately comes from.' },
      ],
      takeaway: 'CDNs beat the speed of light by not travelling: they answer from a copy near you.',
    },
    datacenter: {
      title: 'Data centers',
      tagline: 'Where the servers actually are.',
      simple: [
        'A data center is a building full of servers, with redundant power, cooling and network connections. Traffic entering it passes routers, a firewall and a load balancer before reaching a server.',
        'There is never just one of anything. If a server fails, the load balancer simply stops sending requests to it and nobody notices.',
      ],
      technical: [
        'Modern facilities use a leaf-spine fabric: every top-of-rack switch connects to every spine switch, giving predictable latency and the ability to scale horizontally with equal-cost paths.',
        'Load balancers distribute connections across identical servers and remove failing ones based on health checks. Beyond one building, availability zones replicate the whole stack so a site can be lost entirely.',
      ],
      example:
        'A “region” in a cloud provider is typically several separate buildings close together, connected by private fibre, so a fire in one does not take the service down.',
      terms: [
        { t: 'Load balancer', d: 'A device that spreads requests across a pool of servers.' },
        { t: 'Health check', d: 'A periodic probe that decides whether a server is fit to serve.' },
        { t: 'Availability zone', d: 'An independent failure domain within a region.' },
      ],
      takeaway: 'Data centers are built around redundancy: duplicated paths, servers, power and buildings.',
    },
    submarine: {
      title: 'Submarine cables',
      tagline: 'The physical Internet lies on the ocean floor.',
      simple: [
        'Continents are connected by cables lying on the sea bed. Each contains a handful of glass fibres thinner than a hair, carrying pulses of light.',
        'Light fades over distance, so amplifiers built into the cable boost the signal every 50 to 100 kilometres, powered by high-voltage electricity sent along the cable itself.',
      ],
      technical: [
        'A modern system carries tens of terabits per second per fibre pair using many wavelengths at once. Cables come ashore at landing stations and continue overland to data centers and exchanges.',
        'Light travels in glass at roughly 200,000 km/s. A 6,000 km Atlantic crossing therefore costs about 30 milliseconds each way before any equipment delay — a hard physical floor that no amount of bandwidth removes.',
      ],
      example:
        'Cable faults happen regularly — anchors, fishing gear, earthquakes — and specialised ships repair them. Networks survive because traffic reroutes onto other cables.',
      terms: [
        { t: 'Repeater', d: 'An optical amplifier in the cable that restores the fading signal.' },
        { t: 'Landing station', d: 'The shore facility where a submarine cable meets land networks.' },
        { t: 'Fibre pair', d: 'Two fibres, one for each direction of traffic.' },
      ],
      takeaway: 'Almost all intercontinental traffic travels through submarine fibre, and distance costs real milliseconds.',
    },
    global: {
      title: 'The global picture',
      tagline: 'Putting every layer together.',
      simple: [
        'Now the whole chain fits together. Your device speaks to your router over Wi-Fi. Your router speaks IP to your provider. Your provider hands traffic to other networks at exchanges, which reach data centers and content caches, sometimes across submarine cables.',
        'At every step something is added or removed: a frame, an address translation, an encryption layer, a routing decision.',
      ],
      technical: [
        'The reason this works at global scale is layering plus delegation. Layering means the physical medium can change at every hop without the application noticing. Delegation means no participant needs global knowledge — routers know prefixes, resolvers know who to ask, networks know their neighbours.',
        'And it is genuinely decentralised: no organisation can see, control or reroute the whole thing. The consistency you experience is an emergent result of many parties following the same protocols.',
      ],
      example:
        'A page load can involve a local cache hit, a DNS answer from memory, a TLS session resumed from an earlier visit, and never touch the origin server at all.',
      terms: [
        { t: 'Layering', d: 'Each protocol solving one problem, replaceable without affecting others.' },
        { t: 'Delegation', d: 'Distributing authority so nobody needs complete knowledge.' },
        { t: 'Decentralisation', d: 'No single point of control over the whole system.' },
      ],
      takeaway: 'The Internet scales because of layering and delegation — not because anyone is coordinating it.',
    },
  },
  glossary: {
    ip: { term: 'IP', short: 'The addressing system that lets packets find any device on the Internet.', full: 'Internet Protocol. Provides a hierarchical address for each network attachment point and a best-effort delivery service. IPv4 uses 32-bit addresses, IPv6 uses 128-bit.' },
    mac: { term: 'MAC address', short: 'A hardware identifier used to deliver frames on one local link.', full: 'A 48-bit link-layer address written as twelve hexadecimal digits. Valid only on the local link; rewritten at every router hop and never used for Internet routing.' },
    dns: { term: 'DNS', short: 'The directory that turns names into addresses.', full: 'Domain Name System. A delegated, cached hierarchy of servers: root, top-level domain, and authoritative. Records include A, AAAA, CNAME, MX, NS and TXT.' },
    tcp: { term: 'TCP', short: 'Reliable, ordered transport with a handshake.', full: 'Transmission Control Protocol. Numbers every byte, acknowledges receipt, retransmits losses, and applies flow and congestion control to pace the sender.' },
    udp: { term: 'UDP', short: 'Minimal transport: ports and a checksum, nothing more.', full: 'User Datagram Protocol. Message-oriented and connectionless, with no retransmission or ordering. Used by DNS, real-time media and QUIC.' },
    quic: { term: 'QUIC', short: 'A modern transport over UDP with encryption built in.', full: 'Provides reliable multiplexed streams, integrated TLS 1.3, and connection migration via connection IDs. Carries HTTP/3. It is not simply “UDP with encryption”.' },
    tls: { term: 'TLS', short: 'The encryption layer that makes HTTPS secure.', full: 'Transport Layer Security. Provides authentication via certificates, confidentiality via symmetric encryption, and integrity via authentication tags. Keys are agreed, never transmitted.' },
    http: { term: 'HTTP', short: 'The request and response protocol of the web.', full: 'Defines methods, paths, headers and status codes. HTTP/1.1 is text over TCP, HTTP/2 is binary multiplexed over TCP, HTTP/3 runs over QUIC.' },
    https: { term: 'HTTPS', short: 'HTTP carried inside a TLS tunnel.', full: 'The same HTTP semantics, encrypted and authenticated. Conventionally port 443 over TCP, or over QUIC for HTTP/3.' },
    nat: { term: 'NAT', short: 'Rewriting addresses so many devices share one public address.', full: 'Network Address Translation. Rewrites source address and port on the way out, reverses it on the way back using a translation table. Not a firewall and not required for IPv4.' },
    dhcp: { term: 'DHCP', short: 'Automatic network configuration for new devices.', full: 'A four-message exchange (Discover, Offer, Request, Acknowledge) delivering an address, subnet mask, default gateway and DNS servers as a time-limited lease.' },
    bgp: { term: 'BGP', short: 'How independent networks announce what they can reach.', full: 'Border Gateway Protocol. A path-vector protocol carrying prefixes with attributes including the AS path and local preference. Policy is applied before path length.' },
    isp: { term: 'ISP', short: 'The company that connects you to the Internet.', full: 'Internet Service Provider. Operates access, aggregation and core networks, and interconnects with other networks through peering and transit at its edge.' },
    cdn: { term: 'CDN', short: 'A network of caches placed close to users.', full: 'Content Delivery Network. Serves cached copies from edge locations, fetching from the origin on a miss. Users are steered by DNS or anycast.' },
    as: { term: 'AS', short: 'One independently operated network with its own policy.', full: 'Autonomous System. Identified by an AS number, it hides its internal structure and exchanges only reachability information with other networks via BGP.' },
    ixp: { term: 'IXP', short: 'A shared facility where many networks interconnect.', full: 'Internet Exchange Point. A neutral layer-2 switching fabric where members establish BGP sessions directly, usually without payment between them.' },
    router: { term: 'Router', short: 'Forwards packets between networks using IP addresses.', full: 'Selects an outgoing link using longest-prefix match, decrements the hop counter, and rebuilds the link-layer frame for the next hop.' },
    switch: { term: 'Switch', short: 'Forwards frames inside one local network using MAC addresses.', full: 'Learns which address is on which port by observing traffic, floods unknown and broadcast frames, and operates below the IP layer.' },
    packet: { term: 'Packet', short: 'A chunk of data with addressing attached.', full: 'Strictly the network-layer unit. The transport-layer unit is a segment (TCP) or datagram (UDP); the link-layer unit is a frame.' },
    port: { term: 'Port', short: 'A number identifying which program should receive data.', full: 'A 16-bit value in the TCP or UDP header. Combined with the IP address it forms a socket address; the four-tuple identifies a connection.' },
    socket: { term: 'Socket', short: 'The endpoint an application reads from and writes to.', full: 'The operating system object binding an application to an address and port, through which it sends and receives data.' },
    server: { term: 'Server', short: 'A machine that waits for requests and answers them.', full: 'A process listening on a port for incoming connections. In practice reached through firewalls, load balancers and caches rather than directly.' },
    datacenter: { term: 'Data center', short: 'A facility housing servers with redundant power and networking.', full: 'Contains edge routers, firewalls, load balancers, a switching fabric, compute and storage, usually organised into independent availability zones.' },
    cable: { term: 'Submarine cable', short: 'Fibre-optic cable on the ocean floor linking continents.', full: 'Carries the overwhelming majority of intercontinental traffic. Contains fibre pairs and optical amplifiers powered over the cable, landing at shore stations.' },
  },
  quiz: {
    q1: { q: 'Your laptop sends a request to a server abroad. Whose MAC address is in the frame it puts on the wire?', a: ['The server’s', 'Your router’s', 'Your ISP’s', 'Nobody’s — MAC is not used'], correct: 1, explain: 'MAC addresses only reach the next device on the local link. The frame is addressed to your router; every hop rebuilds it with new MAC addresses.', concept: 'mac-ethernet' },
    q2: { q: 'A router has routes for 10.0.0.0/8 and 10.1.0.0/16. Where does a packet for 10.1.5.5 go?', a: ['Via the /8 route', 'Via the /16 route', 'It is duplicated to both', 'It is dropped'], correct: 1, explain: 'Longest-prefix match: among matching routes the most specific one wins, and /16 is more specific than /8.', concept: 'router' },
    q3: { q: 'What does DHCP give a device besides an IP address?', a: ['Only the address', 'Mask, gateway and DNS servers', 'A domain name', 'An encryption key'], correct: 1, explain: 'The acknowledgement carries the subnet mask, the default gateway and DNS server addresses — everything needed to actually use the network.', concept: 'dhcp' },
    q4: { q: 'Which statement about NAT is correct?', a: ['NAT is a firewall', 'NAT is required for any IPv4 access', 'NAT rewrites addresses and ports, keeping a table to reverse it', 'NAT encrypts traffic'], correct: 2, explain: 'NAT translates addressing. Blocking unsolicited inbound traffic is a side effect, not a security policy, and a host with a public address needs no NAT.', concept: 'nat' },
    q5: { q: 'Why do most DNS lookups never reach a root server?', a: ['Root servers are offline', 'Answers and delegations are cached at several levels', 'Browsers use addresses directly', 'Roots only serve IPv6'], correct: 1, explain: 'The browser, the operating system and the resolver all cache answers and delegations for the record’s TTL, so the full walk is rare.', concept: 'dns' },
    q6: { q: 'A TCP segment with sequence number 2000 carries 500 bytes. What will the receiver acknowledge?', a: ['2000', '2500', '500', '1500'], correct: 1, explain: 'An acknowledgement names the next byte expected: 2000 + 500 = 2500.', concept: 'tcp' },
    q7: { q: 'Why is UDP a good fit for a live voice call?', a: ['It is more reliable than TCP', 'It encrypts audio', 'A retransmitted late sample is useless, so waiting hurts more than losing', 'It uses fewer ports'], correct: 2, explain: 'Freshness matters more than completeness in real time. A lost 20 ms sample is concealed; a retransmission would arrive too late to play.', concept: 'udp' },
    q8: { q: 'What transport does HTTP/3 use?', a: ['TCP', 'QUIC over UDP', 'Raw IP', 'TLS directly'], correct: 1, explain: 'HTTP/3 is HTTP semantics carried over QUIC, which runs over UDP. It never uses TCP.', concept: 'quic' },
    q9: { q: 'In TLS, how does the client get the symmetric key?', a: ['The server sends it encrypted', 'It is printed in the certificate', 'Both sides derive it from a key exchange; it is never sent', 'It is fixed per website'], correct: 2, explain: 'A key exchange lets both parties compute the same secret independently. An eavesdropper sees only the public halves.', concept: 'tls' },
    q10: { q: 'How many usable host addresses are in a /26 network?', a: ['64', '62', '26', '32'], correct: 1, explain: 'Six host bits give 64 addresses; the network and broadcast addresses are reserved, leaving 62.', concept: 'subnet' },
    q11: { q: 'BGP chooses between two routes to the same prefix. What is considered first?', a: ['The shortest physical distance', 'Local policy preference', 'The fastest link', 'Random selection'], correct: 1, explain: 'Local preference — a policy value reflecting business relationships — is evaluated before AS path length. Geography is not considered at all.', concept: 'bgp' },
    q12: { q: 'What is a cache miss at a CDN edge?', a: ['The user is offline', 'The edge has no fresh copy and must fetch from the origin', 'DNS failed', 'The certificate expired'], correct: 1, explain: 'On a miss the edge retrieves the object from the origin (often via a shield tier), stores it according to its TTL, and serves it.', concept: 'cdn' },
    q13: { q: 'What identifies a single TCP connection?', a: ['The destination port alone', 'The source address alone', 'Source address, source port, destination address and destination port', 'The sequence number'], correct: 2, explain: 'The four-tuple. That is how one server port can serve thousands of simultaneous clients.', concept: 'ports' },
    q14: { q: 'Roughly how long does light take to cross a 6,000 km submarine cable one way?', a: ['0.02 ms', '3 ms', '30 ms', '300 ms'], correct: 2, explain: 'Light in fibre travels about 200,000 km/s, so 6,000 km takes about 30 ms each way — a physical limit that caching near users exists to avoid.', concept: 'submarine' },
    q15: { q: 'What does an Autonomous System expose to other networks?', a: ['Its full internal topology', 'Only reachability information for its prefixes', 'Its customer list', 'Its cabling plan'], correct: 1, explain: 'Internal structure stays private. Only prefixes and path attributes are announced, which is exactly what allows the Internet to scale.', concept: 'as' },
    q16: { q: 'What does a switch do with a frame whose destination MAC it has not seen before?', a: ['Drops it', 'Sends it to the router', 'Floods it out every other port', 'Returns an error'], correct: 2, explain: 'Flooding guarantees delivery, and the reply teaches the switch which port that address is on.', concept: 'switch' },
  },
  journey: {
    request: {
      title: 'The browser builds a request',
      what: 'You pressed Enter. The browser assembles an HTTP request: the method GET, the path, and headers describing what it can accept.',
      why: 'Nothing has left your machine yet. The request is just bytes in memory until the operating system is asked to send them.',
    },
    dns: {
      title: 'DNS turns the name into an address',
      what: 'The browser asks a resolver for the address behind the hostname. The answer usually comes from a cache in milliseconds.',
      why: 'Packets can only be addressed to numbers. Without this step there is nowhere to send anything.',
    },
    connect: {
      title: 'A connection is opened and encrypted',
      what: 'TCP performs its three-message handshake, then TLS proves the server’s identity and both sides derive encryption keys.',
      why: 'This is what makes the rest of the exchange reliable and private. From here on, intermediaries see only ciphertext.',
    },
    frame: {
      title: 'The packet is wrapped for the local link',
      what: 'The encrypted request is placed in a TCP segment, then an IP packet, then a Wi-Fi frame addressed to your router’s hardware address.',
      why: 'Each layer adds only what the next device needs. The link layer only has to reach the router — not the server.',
    },
    route: {
      title: 'The router picks a direction',
      what: 'The router compares the destination address with its routing table, finds no local match, and follows its default route toward the provider.',
      why: 'Routers hold prefixes, not individual addresses. One default entry covers the entire rest of the Internet.',
    },
    nat: {
      title: 'Addresses are translated',
      what: 'Your private source address and port are rewritten to the household’s public address and a free port. The mapping is stored so the reply can be reversed.',
      why: 'Many devices share one public address. Without the table the router could not tell which device a reply belongs to.',
    },
    isp: {
      title: 'Across the provider and beyond',
      what: 'The packet crosses the access, aggregation and core networks of your provider, then moves into other networks — one router at a time.',
      why: 'Each hop rewrites the link-layer addresses and decrements the hop counter. The path is chosen by policy, not geography.',
    },
    edge: {
      title: 'A copy nearby may answer',
      what: 'For popular content the journey ends early: a CDN edge in your region serves a cached copy instead of crossing an ocean.',
      why: 'Distance costs milliseconds that no amount of bandwidth can buy back, so content is copied close to users.',
    },
    server: {
      title: 'The server answers',
      what: 'Behind a firewall and a load balancer, a server decrypts the request, runs the application and returns a status code with the content.',
      why: 'Load balancers make many identical servers behave like one, and remove failing ones without anyone noticing.',
    },
    render: {
      title: 'The response comes back and is drawn',
      what: 'The reply retraces the path — often not the identical one — NAT is reversed, TLS is decrypted, and the browser parses and paints the page.',
      why: 'Return paths are frequently asymmetric. What matters is that both ends agree on addresses, ports and keys.',
    },
  },
  viz: {
    dnsTitle: 'Resolve a name',
    dnsLead: 'Watch the lookup walk the hierarchy, then repeat it to see the cache work.',
    dnsQuery: 'Query',
    dnsAnswer: 'Answer',
    dnsCached: 'Answered from cache',
    dnsFlush: 'Clear cache',
    dnsResolve: 'Resolve',
    dnsStub: 'Your device',
    dnsResolver: 'Resolver',
    dnsRoot: 'Root server',
    dnsTld: 'TLD server',
    dnsAuth: 'Authoritative server',
    tcpTitle: 'Open a connection',
    tcpLead: 'Step through the handshake, send data, and drop a packet to see the retransmission.',
    tcpClient: 'Client',
    tcpServer: 'Server',
    tcpDropNext: 'Drop the next packet',
    tcpState: 'Connection state',
    tcpSend: 'Send next segment',
    tlsTitle: 'Establish a secure channel',
    tlsLead: 'Each step of the handshake and what it achieves.',
    tlsProps: 'Guarantees so far',
    tlsAuth: 'Authentication',
    tlsConf: 'Confidentiality',
    tlsInt: 'Integrity',
    httpTitle: 'Send a request',
    httpLead: 'Choose a method and a path, then inspect the exchange.',
    httpMethod: 'Method',
    httpPath: 'Path',
    httpSend: 'Send request',
    httpRequest: 'Request',
    httpResponse: 'Response',
    natTitle: 'Translate an address',
    natLead: 'Send traffic from several devices and watch the translation table fill up.',
    natPrivate: 'Private side',
    natPublic: 'Public side',
    natTable: 'Translation table',
    natSend: 'Send',
    natInbound: 'Unsolicited inbound packet',
    subnetTitle: 'Split a network',
    subnetLead: 'Move the prefix boundary and watch the usable range change.',
    subnetNetwork: 'Network address',
    subnetBroadcast: 'Broadcast address',
    subnetMask: 'Subnet mask',
    subnetHosts: 'Usable hosts',
    subnetRange: 'Usable range',
    subnetNetBits: 'network bits',
    subnetHostBits: 'host bits',
    routingTitle: 'Choose a route',
    routingLead: 'Enter a destination and see which entry wins.',
    routingDest: 'Destination address',
    routingTable: 'Routing table',
    routingPrefix: 'Prefix',
    routingNextHop: 'Next hop',
    routingSelected: 'Selected',
    routingMatches: 'matches',
    routingWinner: 'Most specific match wins',
    routingNoRoute: 'No route — the packet would be discarded.',
    bgpTitle: 'Compare two announcements',
    bgpLead: 'Change the relationship with each neighbour and see which path is installed.',
    bgpVia: 'Learned from',
    bgpPath: 'AS path',
    bgpPref: 'Local preference',
    bgpCustomer: 'Customer',
    bgpPeer: 'Peer',
    bgpProvider: 'Transit provider',
    bgpChosen: 'Installed route',
    bgpReasonPref: 'Higher local preference wins — policy is evaluated before path length.',
    bgpReasonPath: 'Preferences are equal, so the shorter AS path wins.',
    cdnTitle: 'Serve from the edge',
    cdnLead: 'Request the same object twice from one region and compare.',
    cdnUser: 'User in',
    cdnEdge: 'Edge cache',
    cdnOrigin: 'Origin server',
    cdnHit: 'Cache hit',
    cdnMiss: 'Cache miss — fetching from origin',
    cdnRequest: 'Request',
    cdnLatency: 'Round trip',
    packetTitle: 'Unwrap a packet',
    packetLead: 'Add or remove layers to see what each one contributes.',
    packetAdd: 'Add next layer',
    packetRemove: 'Remove outer layer',
    packetPayload: 'Payload',
    dhcpTitle: 'Get configured',
    dhcpLead: 'Step through the four messages a device exchanges when it joins.',
    dhcpConfig: 'Device configuration',
    dhcpNone: 'not configured yet',
    ipTitle: 'Inspect an address',
    ipLead: 'Type an address to see its structure and category.',
    ipAddress: 'IP address',
    ipCategory: 'Category',
    ipBinary: 'In binary',
    ipPrivate: 'Private (used inside local networks)',
    ipPublic: 'Public (globally routable)',
    ipLoopback: 'Loopback (this machine)',
    ipLinkLocal: 'Link-local (self-assigned)',
    ipMulticast: 'Multicast (group delivery)',
    ipInvalid: 'Not a valid IPv4 address',
    portsTitle: 'Well-known ports',
    portsLead: 'Conventions, not guarantees — any program can listen on any port.',
    portsPort: 'Port',
    portsService: 'Service',
    portsNote: 'Notes',
    frameTitle: 'Build a frame',
    frameLead: 'See what the network interface actually puts on the wire.',
    switchTitle: 'Learn the topology',
    switchLead: 'Send frames between devices and watch the MAC table build itself.',
    switchTable: 'MAC address table',
    switchPort: 'Port',
    switchFlood: 'Unknown destination — flooded to all ports',
    switchDirect: 'Known destination — forwarded to one port',
    switchSendFrom: 'Send from',
    switchSendTo: 'to',
  },
} as const;

import type { Widen } from './en';

export type ContentDict = Widen<typeof contentEn>;
export type ConceptId = keyof typeof contentEn.concepts;
export type GlossaryId = keyof typeof contentEn.glossary;
export type QuizId = keyof typeof contentEn.quiz;
