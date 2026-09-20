import {
  FORAX_OPERATIONS,
  getOperation,
  hasOperation,
  getOperationsByCategory
} from "../compiler/src/operationRegistry";

function expect(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

expect(
  FORAX_OPERATIONS.length >= 20,
  "FORAX operation registry contains the expected operation set"
);

expect(
  hasOperation("OPEN_CASE"),
  "OPEN_CASE is registered"
);

expect(
  hasOperation("LOAD_PCAP"),
  "LOAD_PCAP is registered"
);

expect(
  hasOperation("FIND_PACKET"),
  "FIND_PACKET is registered"
);

expect(
  hasOperation("FILTER_PACKET"),
  "FILTER_PACKET is registered"
);

expect(
  hasOperation("FIND_PROCESS"),
  "FIND_PROCESS is registered"
);

expect(
  hasOperation("FILTER_PROCESS"),
  "FILTER_PROCESS is registered"
);

expect(
  hasOperation("FIND_NETWORK_CONNECTION"),
  "FIND_NETWORK_CONNECTION is registered"
);

expect(
  hasOperation("FILTER_NETWORK_CONNECTION"),
  "FILTER_NETWORK_CONNECTION is registered"
);

expect(
  hasOperation("START_NETWORK_MONITOR"),
  "START_NETWORK_MONITOR is registered"
);

expect(
  hasOperation("STOP_NETWORK_MONITOR"),
  "STOP_NETWORK_MONITOR is registered"
);

expect(
  hasOperation("CREATE_TIMELINE"),
  "CREATE_TIMELINE is registered"
);

expect(
  hasOperation("GENERATE_REPORT"),
  "GENERATE_REPORT is registered"
);

expect(
  getOperation("load_pcap")?.runtimeMethod === "loadPcap",
  "Operation lookup is case-insensitive"
);

expect(
  getOperationsByCategory("NETWORK").length >= 4,
  "NETWORK operations are grouped correctly"
);

expect(
  getOperationsByCategory("PCAP").length >= 3,
  "PCAP operations are grouped correctly"
);

console.log("");
console.log("FORAX operation registry tests passed.");

