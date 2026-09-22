import { collectProcesses } from "./collectors/processCollector";
import { collectUsers } from "./collectors/userCollector";
import { collectDevice } from "./collectors/deviceCollector";
import { collectNetworkConnections } from "./collectors/networkCollector";
import { collectPcap, PcapEvidence } from "./collectors/pcapCollector";
import { NetworkMonitor } from "./collectors/networkMonitor";
import { ProcessMonitor } from "./collectors/processMonitor";
import { hashFile as calculateFileHash } from "./evidence/hashFile";
import { getFileMetadata } from "./evidence/getFile";
import { searchFile } from "./evidence/searchFile";

export interface ForensicResult {
  operation: string;
  object: string;
  timestamp: string;
  data: unknown;
}

export interface WhereCondition {
  field: string;
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=";
  value: string | number | boolean;
}

export interface WhereQuery {
  conditions: WhereCondition[];
  operators: ("AND" | "OR")[];
}

class ForensicRuntime {
  private results: ForensicResult[] = [];
  private currentCase: string | undefined;
  private networkMonitoring = false;

  private evidence: Record<string, unknown[]> = {};

  private networkMonitor = new NetworkMonitor();
  private processMonitor = new ProcessMonitor();

  private record(
    operation: string,
    object: string,
    data: unknown
  ): ForensicResult {
    const result: ForensicResult = {
      operation,
      object,
      timestamp: new Date().toISOString(),
      data
    };

    this.results.push(result);
    return result;
  }

  async openCase(caseId: string): Promise<ForensicResult> {
    this.currentCase = caseId;

    return this.record("OPEN_CASE", "CASE", {
      caseId
    });
  }

  async loadPcap(filePath: string): Promise<ForensicResult> {
    const pcap: PcapEvidence =
      await collectPcap(filePath);

    this.evidence.PCAP = [pcap];

    // Store the complete decoded packet evidence.
    // FIND PACKET will therefore be able to query
    // IP addresses, ports, protocol, MAC addresses, etc.
    this.evidence.PACKET = pcap.packets.map(
      (packet) => ({
        INDEX: packet.index,
        TIMESTAMP: packet.timestamp,
        CAPTURED_LENGTH: packet.capturedLength,
        ORIGINAL_LENGTH: packet.originalLength,

        PACKET_LENGTH: packet.PACKET_LENGTH,

        DESTINATION_MAC:
          packet.DESTINATION_MAC,

        SOURCE_MAC:
          packet.SOURCE_MAC,

        ETHER_TYPE:
          packet.ETHER_TYPE,

        SOURCE_IP:
          packet.SOURCE_IP,

        DESTINATION_IP:
          packet.DESTINATION_IP,

        IP_VERSION:
          packet.IP_VERSION,

        PROTOCOL:
          packet.PROTOCOL,

        SOURCE_PORT:
          packet.SOURCE_PORT,

        DESTINATION_PORT:
          packet.DESTINATION_PORT
      })
    );

    const flowMap = new Map<string, {
      SOURCE_IP?: string;
      DESTINATION_IP?: string;
      SOURCE_PORT?: number;
      DESTINATION_PORT?: number;
      PROTOCOL?: string;
      PACKET_COUNT: number;
      TOTAL_BYTES: number;
    }>();

    for (const packet of this.evidence.PACKET as Array<Record<string, unknown>>) {
      const key = [
        packet.SOURCE_IP ?? "",
        packet.SOURCE_PORT ?? "",
        packet.DESTINATION_IP ?? "",
        packet.DESTINATION_PORT ?? "",
        packet.PROTOCOL ?? ""
      ].join("|");

      const existing = flowMap.get(key);

      if (existing) {
        existing.PACKET_COUNT += 1;
        existing.TOTAL_BYTES += Number(
          packet.PACKET_LENGTH ??
          packet.CAPTURED_LENGTH ??
          packet.ORIGINAL_LENGTH ??
          0
        );
      } else {
        flowMap.set(key, {
          SOURCE_IP: packet.SOURCE_IP as string | undefined,
          DESTINATION_IP: packet.DESTINATION_IP as string | undefined,
          SOURCE_PORT: packet.SOURCE_PORT as number | undefined,
          DESTINATION_PORT: packet.DESTINATION_PORT as number | undefined,
          PROTOCOL: packet.PROTOCOL as string | undefined,
          PACKET_COUNT: 1,
          TOTAL_BYTES: Number(
            packet.PACKET_LENGTH ??
            packet.CAPTURED_LENGTH ??
            packet.ORIGINAL_LENGTH ??
            0
          )
        });
      }
    }

    this.evidence.FLOW = Array.from(flowMap.values());
    return this.record("LOAD_PCAP", "PCAP", {
      status: "LOADED",
      filePath: pcap.filePath,
      sizeBytes: pcap.sizeBytes,
      sha256: pcap.sha256,
      packetCount: pcap.packetCount,
      packets: pcap.packets
    });
  }

  async hashPcap(filePath: string): Promise<ForensicResult> {
    const pcap: PcapEvidence =
      await collectPcap(filePath);

    return this.record("HASH_PCAP", "PCAP", {
      status: "HASHED",
      filePath: pcap.filePath,
      sizeBytes: pcap.sizeBytes,
      sha256: pcap.sha256
    });
  }
  async collect(object: string): Promise<ForensicResult> {
    switch (object) {
      case "PROCESS": {
        const processes = await collectProcesses();

        this.evidence.PROCESS = processes;

        return this.record("COLLECT", object, {
          status: "COLLECTED",
          count: processes.length,
          processes
        });
      }

      case "NETWORK_CONNECTION": {
        const connections =
          await collectNetworkConnections();

        this.evidence.NETWORK_CONNECTION =
          connections;

        return this.record("COLLECT", object, {
          status: "COLLECTED",
          count: connections.length,
          connections
        });
      }

      case "FILE":
        this.evidence.FILE = [];

        return this.record("COLLECT", object, {
          status: "READY",
          message:
            "File-system collection adapter registered."
        });

      case "USER": {
        const users = await collectUsers();

        this.evidence.USER = users;

        return this.record("COLLECT", object, {
          status: "COLLECTED",
          count: users.length,
          users
        });
      }
      case "DEVICE": {
        const device = await collectDevice();

        this.evidence.DEVICE = [device];

        return this.record("COLLECT", object, {
          status: "COLLECTED",
          count: 1,
          devices: [device]
        });
      }
      default:
        throw new Error(
          `Unsupported forensic collection object: ${object}`
        );
    }
  }

  async find(
    object: string,
    query?: WhereQuery
  ): Promise<ForensicResult> {
    const source = this.evidence[object] ?? [];

    const matches = query
      ? this.applyQuery(source, query)
      : source;

    return this.record("FIND", object, {
      status: "COMPLETED",
      query: query ?? null,
      matchedCount: matches.length,
      results: matches
    });
  }

  async count(
    object: string,
    query?: WhereQuery
  ): Promise<ForensicResult> {
    const source = this.evidence[object] ?? [];

    const matches = query
      ? this.applyQuery(source, query)
      : source;

    return this.record("COUNT", object, {
      status: "COMPLETED",
      query: query ?? null,
      count: matches.length
    });
  }

  async filter(
    object: string,
    query: WhereQuery
  ): Promise<ForensicResult> {
    const source = this.evidence[object] ?? [];

    const matches = this.applyQuery(
      source,
      query
    );

    return this.record("FILTER", object, {
      status: "COMPLETED",
      query,
      matchedCount: matches.length,
      results: matches
    });
  }

  async summarizeProcess(): Promise<ForensicResult> {
    const processes = this.evidence.PROCESS ?? [];

    const names = new Map<string, number>();
    const parentPids = new Map<number, number>();

    for (const process of processes) {
      if (typeof process !== "object" || process === null) {
        continue;
      }

      const record = process as Record<string, unknown>;

      const processName =
        typeof record.processName === "string"
          ? record.processName
          : "UNKNOWN";

      names.set(
        processName,
        (names.get(processName) ?? 0) + 1
      );

      if (typeof record.parentPid === "number") {
        parentPids.set(
          record.parentPid,
          (parentPids.get(record.parentPid) ?? 0) + 1
        );
      }
    }

    const processNames = Array.from(names.entries())
      .map(([processName, count]) => ({
        processName,
        count
      }))
      .sort((a, b) =>
        a.processName.localeCompare(b.processName)
      );

    const parentProcessIds = Array.from(parentPids.entries())
      .map(([parentPid, childCount]) => ({
        parentPid,
        childCount
      }))
      .sort((a, b) => a.parentPid - b.parentPid);

    return this.record("SUMMARIZE", "PROCESS", {
      status: "COMPLETED",
      totalProcesses: processes.length,
      uniqueProcessNames: processNames.length,
      processNames,
      parentProcessIds
    });
  }

  async correlateProcessNetwork(query?: WhereQuery): Promise<ForensicResult> {
    const processes = this.evidence.PROCESS ?? [];
    const connections =
      this.evidence.NETWORK_CONNECTION ?? [];

    const processesByPid =
      new Map<number, Record<string, unknown>[]>();

    for (const process of processes) {
      if (
        typeof process !== "object" ||
        process === null
      ) {
        continue;
      }

      const row =
        process as Record<string, unknown>;

      const pid = Number(row.pid);

      if (!Number.isFinite(pid)) {
        continue;
      }

      const matches =
        processesByPid.get(pid) ?? [];

      matches.push(row);
      processesByPid.set(pid, matches);
    }

    const correlations:
      Array<Record<string, unknown>> = [];

    for (const connection of connections) {
      if (
        typeof connection !== "object" ||
        connection === null
      ) {
        continue;
      }

      const row =
        connection as Record<string, unknown>;

      const pid = Number(row.pid);

      if (!Number.isFinite(pid)) {
        continue;
      }

      const matches =
        processesByPid.get(pid) ?? [];

      for (const process of matches) {
        correlations.push({
          pid,
          process,
          networkConnection: row
        });
      }
    }

    return this.record(
      "CORRELATE_PROCESS_NETWORK_CONNECTION",
      "CORRELATION",
      {
        status: "COMPLETED",
        correlationType:
          "PROCESS_NETWORK_PID",
        query: query ?? null,
          matchedCount: (query ? this.applyQuery(correlations, query) : correlations).length,
          results: (query ? this.applyQuery(correlations, query) : correlations)
      }
    );
  }
  private applyQuery(
    records: unknown[],
    query: WhereQuery
  ): unknown[] {
    return records.filter((record) => {
      if (
        typeof record !== "object" ||
        record === null
      ) {
        return false;
      }

      const row =
        record as Record<string, unknown>;

      const conditionResults =
        query.conditions.map(
          (condition) =>
            this.evaluateCondition(
              row,
              condition
            )
        );

      if (conditionResults.length === 0) {
        return true;
      }

      let result = conditionResults[0];

      for (
        let i = 0;
        i < query.operators.length;
        i++
      ) {
        const next =
          conditionResults[i + 1];

        if (next === undefined) {
          break;
        }

        if (
          query.operators[i] === "AND"
        ) {
          result = result && next;
        } else {
          result = result || next;
        }
      }

      return result;
    });
  }

  private evaluateCondition(
    row: Record<string, unknown>,
    condition: WhereCondition
  ): boolean {
    const actual =
      this.getFieldValue(
        row,
        condition.field
      );

    if (actual === undefined) {
      return false;
    }

    const expected = condition.value;

    switch (condition.operator) {
      case "==":
        return actual === expected;

      case "!=":
        return actual !== expected;

      case ">":
        return (
          this.compare(actual, expected) > 0
        );

      case "<":
        return (
          this.compare(actual, expected) < 0
        );

      case ">=":
        return (
          this.compare(actual, expected) >= 0
        );

      case "<=":
        return (
          this.compare(actual, expected) <= 0
        );

      default:
        return false;
    }
  }

  private getFieldValue(
    row: Record<string, unknown>,
    field: string
  ): unknown {
    const fieldMap: Record<string, string> = {
      PID: "pid",
      PARENT_PID: "parentPid",
      PROCESS_NAME: "processName",
      COMMAND_LINE: "commandLine",
      EXECUTABLE_PATH: "executablePath",
      HOSTNAME: "computerName",
      MANUFACTURER: "manufacturer",
      MODEL: "model",
      SERIAL_NUMBER: "serialNumber",
      BIOS_VERSION: "biosVersion",
      OPERATING_SYSTEM: "operatingSystem",
      SOURCE_IP: "localAddress",
      DESTINATION_IP: "remoteAddress",
      SOURCE_PORT: "localPort",
      DESTINATION_PORT: "remotePort",
      PROTOCOL: "protocol",
      STATUS: "state"
    };
      const canonicalField = field.toUpperCase();

      if (row[canonicalField] !== undefined) {
        return row[canonicalField];
      }

      const runtimeField =
        fieldMap[canonicalField] ?? field;

      if (row[runtimeField] !== undefined) {
        return row[runtimeField];
      }

    const normalized =
      runtimeField.toLowerCase();

    const matchingKey =
      Object.keys(row).find(
        (key) =>
          key.toLowerCase() === normalized
      );

    return matchingKey === undefined
      ? undefined
      : row[matchingKey];
  }
private compare(
    actual: unknown,
    expected: unknown
  ): number {
    if (
      typeof actual === "number" &&
      typeof expected === "number"
    ) {
      return actual - expected;
    }

    const actualText = String(actual);
    const expectedText = String(expected);

    if (actualText === expectedText) {
      return 0;
    }

    return actualText < expectedText
      ? -1
      : 1;
  }

    async getProcess(pid: number): Promise<ForensicResult> {
    const processes = await collectProcesses();

    const process = processes.find(
      (item) => item.pid === pid
    );

    if (!process) {
      throw new Error(
        `GET_PROCESS target PID not found: ${pid}`
      );
    }

    this.evidence.PROCESS = [
      ...(this.evidence.PROCESS ?? []),
      process
    ];

    return this.record(
      "GET_PROCESS",
      "PROCESS",
      {
        status: "FOUND",
        process
      }
    );
  }

  async verifyFile(
    filePath: string,
    expectedHash: string
  ): Promise<ForensicResult> {
    const evidence = await calculateFileHash(filePath);

    const normalizedExpectedHash =
      expectedHash.trim().toLowerCase();

    const actualHash =
      evidence.sha256.toLowerCase();

    const verified =
      actualHash === normalizedExpectedHash;

    return this.record("VERIFY_FILE", "FILE", {
      status: verified ? "VERIFIED" : "MISMATCH",
      filePath,
      expectedHash: normalizedExpectedHash,
      actualHash,
      verified
    });
  }
    async verifyPcap(
    filePath: string,
    expectedHash: string
  ): Promise<ForensicResult> {
    const evidence: PcapEvidence =
      await collectPcap(filePath);

    const normalizedExpectedHash =
      expectedHash.trim().toLowerCase();

    const actualHash =
      evidence.sha256.toLowerCase();

    const verified =
      actualHash === normalizedExpectedHash;

    return this.record("VERIFY_PCAP", "PCAP", {
      status: verified ? "VERIFIED" : "MISMATCH",
      filePath,
      expectedHash: normalizedExpectedHash,
      actualHash,
      verified
    });
  }

  async searchFile(
      directory: string,
      pattern: string
    ): Promise<ForensicResult> {
      const evidence = await searchFile(directory, pattern);

      this.evidence.FILE = [
        ...(this.evidence.FILE ?? []),
        ...evidence.files
      ];

      return this.record("SEARCH_FILE", "FILE", evidence);
    }
  async getFile(filePath: string): Promise<ForensicResult> {
    const evidence = await getFileMetadata(filePath);

    this.evidence.FILE = [
      ...(this.evidence.FILE ?? []),
      evidence
    ];

    return this.record("GET_FILE", "FILE", evidence);
  }
  async hashFile(filePath: string): Promise<ForensicResult> {
    const evidence = await calculateFileHash(filePath);

    this.evidence.HASH = [
      ...(this.evidence.HASH ?? []),
      evidence
    ];

    return this.record("HASH_FILE", "FILE", {
      status: "HASHED",
      ...evidence
    });
  }
  async createTimeline(): Promise<ForensicResult> {
    const events: Array<Record<string, unknown>> = [];

    const processEvidence = this.evidence.PROCESS ?? [];

    for (const process of processEvidence) {
      if (
        typeof process !== "object" ||
        process === null
      ) {
        continue;
      }

      const row =
        process as Record<string, unknown>;

      const timestamp =
        typeof row.timestamp === "string"
          ? row.timestamp
          : new Date().toISOString();

      events.push({
        timestamp,
        source: "PROCESS",
        eventType: "PROCESS_OBSERVED",
        data: row
      });
    }

    const networkEvidence =
      this.evidence.NETWORK_CONNECTION ?? [];

    for (const connection of networkEvidence) {
      if (
        typeof connection !== "object" ||
        connection === null
      ) {
        continue;
      }

      const row =
        connection as Record<string, unknown>;

      const timestamp =
        typeof row.timestamp === "string"
          ? row.timestamp
          : new Date().toISOString();

      events.push({
        timestamp,
        source: "NETWORK_CONNECTION",
        eventType: "NETWORK_CONNECTION_OBSERVED",
        data: row
      });
    }

    events.sort((a, b) => {
      const left =
        Date.parse(String(a.timestamp));

      const right =
        Date.parse(String(b.timestamp));

      return left - right;
    });

    return this.record(
      "CREATE_TIMELINE",
      "TIMELINE",
      {
        status: "COMPLETED",
        eventCount: events.length,
        sources: [
          "PROCESS",
          "NETWORK_CONNECTION"
        ],
        events
      }
    );
  }
  async report(): Promise<ForensicResult> {
    const reportResults =
      this.results.map((result) => ({
        operation: result.operation,
        object: result.object,
        timestamp: result.timestamp,
        data: result.data
      }));

    return this.record(
      "REPORT",
      "REPORT",
      {
        caseId:
          this.currentCase ?? null,
        generatedAt:
          new Date().toISOString(),
        resultCount:
          reportResults.length,
        results: reportResults
      }
    );
  }

  async startNetworkMonitor(): Promise<ForensicResult> {
    if (this.networkMonitoring) {
      return this.record(
        "START_NETWORK_MONITOR",
        "NETWORK_MONITOR",
        {
          status: "ALREADY_RUNNING"
        }
      );
    }

    const snapshot =
      await this.networkMonitor.start();

    this.networkMonitoring = true;

    return this.record(
      "START_NETWORK_MONITOR",
      "NETWORK_MONITOR",
      {
        status: "STARTED",
        mode: "AUTHORIZED_READ_ONLY",
        initialConnectionCount:
          snapshot.connections.length,
        timestamp:
          snapshot.timestamp
      }
    );
  }

  async stopNetworkMonitor(): Promise<ForensicResult> {
    await this.networkMonitor.stop();

    this.networkMonitoring = false;

    return this.record(
      "STOP_NETWORK_MONITOR",
      "NETWORK_MONITOR",
      {
        status: "STOPPED"
      }
    );
  }

   async monitorProcess(
      durationSeconds: number
    ): Promise<ForensicResult> {
      const latestSnapshot =
        await this.processMonitor.monitorFor(durationSeconds);

      this.evidence.PROCESS =
        latestSnapshot.processes;

      return this.record(
        "MONITOR_PROCESS",
        "PROCESS",
        {
          status: "MONITORING_COMPLETED",
          durationSeconds,
          snapshotCount:
            this.processMonitor.getSnapshots().length,
          finalTimestamp:
            latestSnapshot.timestamp,
          processCount:
            latestSnapshot.processes.length
        }
      );
    }

   async monitorNetwork(
      object: string,
      durationSeconds: number
    ): Promise<ForensicResult> {
      if (object !== "NETWORK_CONNECTION") {
        throw new Error(
          `MONITOR does not support object: ${object}`
        );
      }

      const latestSnapshot =
        await this.networkMonitor.monitorFor(durationSeconds);

      this.evidence.NETWORK_CONNECTION =
        latestSnapshot.connections;

      return this.record(
        "MONITOR_NETWORK_CONNECTION",
        "NETWORK_CONNECTION",
        {
          status: "MONITORING_COMPLETED",
          durationSeconds,
          snapshotCount:
            this.networkMonitor.getSnapshots().length,
          finalTimestamp:
            latestSnapshot.timestamp,
          connectionCount:
            latestSnapshot.connections.length
        }
      );
    }

  async watch(
    object: string
  ): Promise<ForensicResult> {
    if (
      object !== "NETWORK_CONNECTION"
    ) {
      return this.record(
        "WATCH",
        object,
        {
          status: "WATCH_REGISTERED"
        }
      );
    }

    if (!this.networkMonitoring) {
      throw new Error(
        "NETWORK_CONNECTION monitoring has not been started."
      );
    }

    const snapshot =
      await this.networkMonitor.capture();

    this.evidence.NETWORK_CONNECTION =
      snapshot.connections;

    return this.record(
      "WATCH",
      object,
      {
        status:
          "SNAPSHOT_CAPTURED",
        timestamp:
          snapshot.timestamp,
        count:
          snapshot.connections.length,
        connections:
          snapshot.connections
      }
    );
  }

  getResults(): ForensicResult[] {
    return [...this.results];
  }
}

export const forensicRuntime =
  new ForensicRuntime();










