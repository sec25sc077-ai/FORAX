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
    name: "COLLECT_MEMORY",
    category: "COLLECTION",
    description: "Collect authorized volatile-memory forensic evidence.",
    runtimeMethod: "collect",
    safety: "READ_ONLY",
    input: "MEMORY",
    output: "MEMORY[]",
    objects: ["MEMORY"]
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
    name: "FIND_MEMORY",
    category: "ANALYSIS",
    description: "Query collected memory forensic evidence.",
    runtimeMethod: "find",
    safety: "READ_ONLY",
    input: "MEMORY",
    output: "MEMORY[]",
    objects: ["MEMORY"]
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
    objects: ["PROCESS"]  },
  { name: "DISTINCT_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_PROCESS.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_FILE.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_USER.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_DEVICE.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_NETWORK_CONNECTION.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_PACKET.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_FLOW.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_PCAP.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_TIMELINE.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "DISTINCT_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation DISTINCT_MEMORY.", runtimeMethod: "distinct", safety: "READ_ONLY" },
  { name: "SORT_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_PROCESS.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_FILE.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_USER.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_DEVICE.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_NETWORK_CONNECTION.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_PACKET.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_FLOW.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_PCAP.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_TIMELINE.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "SORT_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation SORT_MEMORY.", runtimeMethod: "sort", safety: "READ_ONLY" },
  { name: "GROUP_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_PROCESS.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_FILE.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_USER.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_DEVICE.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_NETWORK_CONNECTION.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_PACKET.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_FLOW.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_PCAP.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_TIMELINE.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "GROUP_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation GROUP_MEMORY.", runtimeMethod: "group", safety: "READ_ONLY" },
  { name: "TOP_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_PROCESS.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_FILE.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_USER.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_DEVICE.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_NETWORK_CONNECTION.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_PACKET.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_FLOW.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_PCAP.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_TIMELINE.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "TOP_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation TOP_MEMORY.", runtimeMethod: "top", safety: "READ_ONLY" },
  { name: "EXISTS_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_PROCESS.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_FILE.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_USER.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_DEVICE.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_NETWORK_CONNECTION.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_PACKET.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_FLOW.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_PCAP.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_TIMELINE.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "EXISTS_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation EXISTS_MEMORY.", runtimeMethod: "exists", safety: "READ_ONLY" },
  { name: "SELECT_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_PROCESS.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_FILE.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_USER.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_DEVICE.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_NETWORK_CONNECTION.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_PACKET.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_FLOW.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_PCAP.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_TIMELINE.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "SELECT_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation SELECT_MEMORY.", runtimeMethod: "select", safety: "READ_ONLY" },
  { name: "EXPORT_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_PROCESS.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_FILE.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_USER.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_DEVICE.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_NETWORK_CONNECTION.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_PACKET.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_FLOW.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_PCAP.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_TIMELINE.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "EXPORT_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation EXPORT_MEMORY.", runtimeMethod: "export", safety: "READ_ONLY" },
  { name: "TRACE_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_PROCESS.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_FILE.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_USER.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_DEVICE.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_NETWORK_CONNECTION.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_PACKET.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_FLOW.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_PCAP.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_TIMELINE.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "TRACE_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation TRACE_MEMORY.", runtimeMethod: "trace", safety: "READ_ONLY" },
  { name: "ANALYZE_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_PROCESS.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_FILE.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_USER.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_DEVICE.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_NETWORK_CONNECTION.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_PACKET.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_FLOW.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_PCAP.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_TIMELINE.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "ANALYZE_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation ANALYZE_MEMORY.", runtimeMethod: "analyze", safety: "READ_ONLY" },
  { name: "STATISTICS_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_PROCESS.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_FILE.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_USER.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_DEVICE.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_NETWORK_CONNECTION.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_PACKET.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_FLOW.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_PCAP.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_TIMELINE.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "STATISTICS_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation STATISTICS_MEMORY.", runtimeMethod: "statistics", safety: "READ_ONLY" },
  { name: "COMPARE_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_PROCESS.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_FILE.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_USER.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_DEVICE.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_NETWORK_CONNECTION.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_PACKET.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_FLOW.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_PCAP.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_TIMELINE.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "COMPARE_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation COMPARE_MEMORY.", runtimeMethod: "compare", safety: "READ_ONLY" },
  { name: "DIFF_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_PROCESS.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_FILE.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_USER.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_DEVICE.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_NETWORK_CONNECTION.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_PACKET.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_FLOW.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_PCAP.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_TIMELINE.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "DIFF_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation DIFF_MEMORY.", runtimeMethod: "diff", safety: "READ_ONLY" },
  { name: "MATCH_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_PROCESS.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_FILE.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_USER.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_DEVICE.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_NETWORK_CONNECTION.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_PACKET.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_FLOW.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_PCAP.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_TIMELINE.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "MATCH_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation MATCH_MEMORY.", runtimeMethod: "match", safety: "READ_ONLY" },
  { name: "AGGREGATE_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_PROCESS.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_FILE.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_USER.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_DEVICE.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_NETWORK_CONNECTION.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_PACKET.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_FLOW.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_PCAP.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_TIMELINE.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "AGGREGATE_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation AGGREGATE_MEMORY.", runtimeMethod: "aggregate", safety: "READ_ONLY" },
  { name: "NORMALIZE_PROCESS", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_PROCESS.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_FILE", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_FILE.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_USER", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_USER.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_DEVICE", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_DEVICE.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_NETWORK_CONNECTION", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_NETWORK_CONNECTION.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_PACKET", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_PACKET.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_FLOW", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_FLOW.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_PCAP", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_PCAP.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_TIMELINE", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_TIMELINE.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "NORMALIZE_MEMORY", category: "ANALYSIS", description: "FORAX forensic analysis operation NORMALIZE_MEMORY.", runtimeMethod: "normalize", safety: "READ_ONLY" },
  { name: "ANALYZE_CASE", category: "ANALYSIS", description: "Analyze the current forensic case.", runtimeMethod: "analyzeCase", safety: "READ_ONLY" },
  { name: "STATISTICS_CASE", category: "ANALYSIS", description: "Calculate statistics for the current forensic case.", runtimeMethod: "statisticsCase", safety: "READ_ONLY" },
  { name: "COMPARE_CASE", category: "ANALYSIS", description: "Compare forensic case results.", runtimeMethod: "compareCase", safety: "READ_ONLY" },
  { name: "DIFF_CASE", category: "ANALYSIS", description: "Compute differences between forensic case results.", runtimeMethod: "diffCase", safety: "READ_ONLY" },
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



























