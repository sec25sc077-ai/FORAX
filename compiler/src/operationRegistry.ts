export type ForaxOperationCategory =
  | "CASE"
  | "COLLECTION"
  | "NETWORK"
  | "PCAP"
  | "ANALYSIS"
  | "TIMELINE"
  | "EVIDENCE"
  | "REPORT";

export type ForaxSafetyMode =
  | "READ_ONLY"
  | "LOCAL_ANALYSIS"
  | "EVIDENCE_PRESERVATION";

export interface ForaxOperationDefinition {
  name: string;
  category: ForaxOperationCategory;
  description: string;
  runtimeMethod: string;
  safety: ForaxSafetyMode;
  input?: string;
  output?: string;
  objects?: string[];
}

export const FORAX_OPERATIONS: ForaxOperationDefinition[] = [
  {
    name: "OPEN_CASE",
    category: "CASE",
    description: "Open a forensic investigation case.",
    runtimeMethod: "openCase",
    safety: "LOCAL_ANALYSIS",
    input: "STRING",
    output: "CASE"
  },

  {
    name: "COLLECT_PROCESS",
    category: "COLLECTION",
    description: "Collect running process evidence.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "PROCESS",
    output: "PROCESS[]",
    objects: ["PROCESS"]
  },
  {
    name: "COLLECT_NETWORK_CONNECTION",
    category: "NETWORK",
    description: "Collect current network connection evidence.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "NETWORK_CONNECTION",
    output: "NETWORK_CONNECTION[]",
    objects: ["NETWORK_CONNECTION"]
  },
  {
    name: "COLLECT_FILE",
    category: "COLLECTION",
    description: "Initialize file-system evidence collection.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "FILE",
    output: "FILE[]",
    objects: ["FILE"]
  },
  {
    name: "COLLECT_USER",
    category: "COLLECTION",
    description: "Initialize user-account evidence collection.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "USER",
    output: "USER[]",
    objects: ["USER"]
  },
  {
    name: "COLLECT_DEVICE",
    category: "COLLECTION",
    description: "Initialize device-information collection.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "DEVICE",
    output: "DEVICE[]",
    objects: ["DEVICE"]
  },

  {
    name: "LOAD_PCAP",
    category: "PCAP",
    description: "Load and decode a classic PCAP capture.",
    runtimeMethod: "loadPcap",
    safety: "LOCAL_ANALYSIS",
    input: "PCAP_PATH",
    output: "PCAP",
    objects: ["PCAP"]
  },
  {
    name: "FIND_PACKET",
    category: "PCAP",
    description: "Search decoded packet evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "PACKET_QUERY",
    output: "PACKET[]",
    objects: ["PACKET"]
  },
  {
    name: "FILTER_PACKET",
    category: "PCAP",
    description: "Filter decoded packet evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "PACKET_QUERY",
    output: "PACKET[]",
    objects: ["PACKET"]
  },

  {
    name: "COUNT_PROCESS",
    category: "ANALYSIS",
    description: "Count collected process evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "PROCESS_QUERY",
    output: "INTEGER",
    objects: ["PROCESS"]
  },  {
    name: "FIND_PROCESS",
    category: "ANALYSIS",
    description: "Search collected process evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "PROCESS_QUERY",
    output: "PROCESS[]",
    objects: ["PROCESS"]
  },
  {
    name: "COUNT_NETWORK_CONNECTION",
    category: "NETWORK",
    description: "Count collected network connection evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "NETWORK_CONNECTION_QUERY",
    output: "INTEGER",
    objects: ["NETWORK_CONNECTION"]
  },
  {
    name: "COUNT_FILE",
    category: "ANALYSIS",
    description: "Count collected file evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "FILE_QUERY",
    output: "INTEGER",
    objects: ["FILE"]
  },
  {
    name: "COUNT_USER",
    category: "ANALYSIS",
    description: "Count collected user evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "USER_QUERY",
    output: "INTEGER",
    objects: ["USER"]
  },
  {
    name: "COUNT_DEVICE",
    category: "ANALYSIS",
    description: "Count collected device evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "DEVICE_QUERY",
    output: "INTEGER",
    objects: ["DEVICE"]
  },
  {
    name: "COUNT_PACKET",
    category: "PCAP",
    description: "Count decoded packet evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "PACKET_QUERY",
    output: "INTEGER",
    objects: ["PACKET"]
  },
  {
    name: "COUNT_FLOW",
    category: "NETWORK",
    description: "Count collected network flow evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "FLOW_QUERY",
    output: "INTEGER",
    objects: ["FLOW"]
  },
  {
    name: "COUNT_PCAP",
    category: "PCAP",
    description: "Count collected PCAP evidence.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "PCAP_QUERY",
    output: "INTEGER",
    objects: ["PCAP"]
  },
  {
    name: "COUNT_TIMELINE",
    category: "ANALYSIS",
    description: "Count timeline evidence records.",
    runtimeMethod: "count",
    safety: "LOCAL_ANALYSIS",
    input: "TIMELINE_QUERY",
    output: "INTEGER",
    objects: ["TIMELINE"]
  },
  {
    name: "SUMMARIZE_PROCESS",
    category: "ANALYSIS",
    description: "Create a deterministic summary of collected process evidence.",
    runtimeMethod: "summarizeProcess",
    safety: "LOCAL_ANALYSIS",
    input: "PROCESS_QUERY",
    output: "PROCESS_SUMMARY",
    objects: ["PROCESS"]
  },
  {
    name: "FILTER_PROCESS",
    category: "ANALYSIS",
    description: "Filter collected process evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "PROCESS_QUERY",
    output: "PROCESS[]",
    objects: ["PROCESS"]
  },
  {
    name: "FIND_NETWORK_CONNECTION",
    category: "NETWORK",
    description: "Search collected network connection evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "NETWORK_CONNECTION_QUERY",
    output: "NETWORK_CONNECTION[]",
    objects: ["NETWORK_CONNECTION"]
  },
  {
    name: "FILTER_NETWORK_CONNECTION",
    category: "NETWORK",
    description: "Filter collected network connection evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "NETWORK_CONNECTION_QUERY",
    output: "NETWORK_CONNECTION[]",
    objects: ["NETWORK_CONNECTION"]
  },
  {
    name: "FIND_FILE",
    category: "ANALYSIS",
    description: "Search collected file evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "FILE_QUERY",
    output: "FILE[]",
    objects: ["FILE"]
  },
  {
    name: "FILTER_FILE",
    category: "ANALYSIS",
    description: "Filter collected file evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "FILE_QUERY",
    output: "FILE[]",
    objects: ["FILE"]
  },
  {
    name: "FIND_USER",
    category: "ANALYSIS",
    description: "Search collected user evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "USER_QUERY",
    output: "USER[]",
    objects: ["USER"]
  },
  {
    name: "FILTER_USER",
    category: "ANALYSIS",
    description: "Filter collected user evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "USER_QUERY",
    output: "USER[]",
    objects: ["USER"]
  },
  {
    name: "FIND_DEVICE",
    category: "ANALYSIS",
    description: "Search collected device evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "DEVICE_QUERY",
    output: "DEVICE[]",
    objects: ["DEVICE"]
  },
  {
    name: "FILTER_DEVICE",
    category: "ANALYSIS",
    description: "Filter collected device evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "DEVICE_QUERY",
    output: "DEVICE[]",
    objects: ["DEVICE"]
  },
  {
    name: "FIND_TIMELINE",
    category: "ANALYSIS",
    description: "Search generated forensic timeline events.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "TIMELINE_QUERY",
    output: "TIMELINE[]",
    objects: ["TIMELINE"]
  },
  {
    name: "CORRELATE_PROCESS_NETWORK_CONNECTION",
    category: "ANALYSIS",
    description: "Correlate process evidence with network connection evidence by PID.",
    runtimeMethod: "correlateProcessNetwork",
    safety: "LOCAL_ANALYSIS",
    input: "PROCESS + NETWORK_CONNECTION",
    output: "CORRELATION[]",
    objects: ["PROCESS", "NETWORK_CONNECTION"]
  },
  {
    name: "FIND_FLOW",
    category: "NETWORK",
    description: "Search network flow evidence.",
    runtimeMethod: "find",
    safety: "LOCAL_ANALYSIS",
    input: "FLOW_QUERY",
    output: "FLOW[]",
    objects: ["FLOW"]
  },
  {
    name: "FILTER_FLOW",
    category: "NETWORK",
    description: "Filter network flow evidence.",
    runtimeMethod: "filter",
    safety: "LOCAL_ANALYSIS",
    input: "FLOW_QUERY",
    output: "FLOW[]",
    objects: ["FLOW"]
  },

  {
    name: "START_NETWORK_MONITOR",
    category: "NETWORK",
    description: "Start authorized read-only real-time network monitoring.",
    runtimeMethod: "startNetworkMonitor",
    safety: "READ_ONLY",
    input: "NETWORK_MONITOR",
    output: "NETWORK_MONITOR"
  },
  {
    name: "STOP_NETWORK_MONITOR",
    category: "NETWORK",
    description: "Stop real-time network monitoring.",
    runtimeMethod: "stopNetworkMonitor",
    safety: "READ_ONLY",
    input: "NETWORK_MONITOR",
    output: "NETWORK_MONITOR"
  },
  {
    name: "WATCH_NETWORK_CONNECTION",
    category: "NETWORK",
    description: "Capture a current network connection snapshot.",
    runtimeMethod: "watch",
    safety: "READ_ONLY",
    input: "NETWORK_CONNECTION",
    output: "NETWORK_CONNECTION[]",
    objects: ["NETWORK_CONNECTION"]
  },

  {
    name: "CREATE_TIMELINE",
    category: "TIMELINE",
    description: "Create a forensic timeline from collected evidence.",
    runtimeMethod: "createTimeline",
    safety: "LOCAL_ANALYSIS",
    input: "EVIDENCE[]",
    output: "TIMELINE"
  },

  {
    name: "GENERATE_REPORT",
    category: "REPORT",
    description: "Generate a forensic investigation report.",
    runtimeMethod: "report",
    safety: "LOCAL_ANALYSIS",
    input: "EVIDENCE[]",
    output: "REPORT"
  },
  {
    name: "HASH_FILE",
    category: "EVIDENCE",
    description: "Calculate the SHA-256 hash of a file without modifying it.",
    runtimeMethod: "hashFile",
    safety: "READ_ONLY",
    input: "FILE",
    output: "HASH",
    objects: ["FILE"]
  },
  {
    name: "HASH_PCAP",
    category: "EVIDENCE",
    description: "Calculate the SHA-256 hash of a PCAP evidence file without modifying it.",
    runtimeMethod: "hashPcap",
    safety: "READ_ONLY",
    input: "PCAP",
    output: "HASH",
    objects: ["PCAP"]
  },

      {
      name: "VERIFY_PCAP",
      category: "EVIDENCE",
      description: "Verify a PCAP evidence file against an expected SHA-256 hash without modifying it.",
      runtimeMethod: "verifyPcap",
      safety: "READ_ONLY",
      input: "PCAP + HASH",
      output: "REPORT",
      objects: ["PCAP"]
    },    {
      name: "VERIFY_FILE",
      category: "EVIDENCE",
      description: "Verify a file against an expected SHA-256 hash without modifying it.",
      runtimeMethod: "verifyFile",
      safety: "READ_ONLY",
      input: "FILE + HASH",
      output: "REPORT",
      objects: ["FILE"]
    },
{
    name: "SEARCH_FILE",
    category: "EVIDENCE",
    description: "Search file evidence using a deterministic path pattern without modifying files.",
    runtimeMethod: "searchFile",
    safety: "READ_ONLY",
    input: "FILE",
    output: "FILE[]",
    objects: ["FILE"]
  },
  {
    name: "GET_FILE",
    category: "EVIDENCE",
    description: "Read metadata from a file without modifying it.",
    runtimeMethod: "getFile",
    safety: "READ_ONLY",
    input: "FILE",
    output: "FILE",
    objects: ["FILE"]
  },
  {
    name: "GET_PROCESS",
    category: "COLLECTION",
    description: "Retrieve a specific running process by PID without modifying it.",
    runtimeMethod: "getProcess",
    safety: "READ_ONLY",
    input: "PROCESS",
    output: "PROCESS",
    objects: ["PROCESS"]
  }
];

export function getOperation(
  name: string
): ForaxOperationDefinition | undefined {
  const normalized = name.toUpperCase();

  return FORAX_OPERATIONS.find(
    (operation) => operation.name === normalized
  );
}

export function hasOperation(name: string): boolean {
  return getOperation(name) !== undefined;
}

export function getOperationsByCategory(
  category: ForaxOperationCategory
): ForaxOperationDefinition[] {
  return FORAX_OPERATIONS.filter(
    (operation) => operation.category === category
  );
}


















