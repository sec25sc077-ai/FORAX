import { ForaxError } from "./errors";
import {
  Program,
  Statement,
  Condition,
  ForaxType
} from "./types";
import {
  getForensicField
} from "./forensicFields";
import {
  hasOperation
} from "./operationRegistry";

const OBJECT_TYPES = new Set<ForaxType>([
  "PROCESS",
  "FILE",
  "USER",
  "DEVICE",
  "NETWORK_CONNECTION",
  "PACKET",
  "FLOW",
  "PCAP",
  "TIMELINE"
]);

const COMPARABLE: Record<
  string,
  ForaxType[]
> = {
  "==": [
    "STRING",
    "INTEGER",
    "FLOAT",
    "BOOLEAN",
    "TIMESTAMP",
    "IP_ADDRESS",
    "MAC_ADDRESS",
    "PORT",
    "PROTOCOL",
    "HASH"
  ],

  "!=": [
    "STRING",
    "INTEGER",
    "FLOAT",
    "BOOLEAN",
    "TIMESTAMP",
    "IP_ADDRESS",
    "MAC_ADDRESS",
    "PORT",
    "PROTOCOL",
    "HASH"
  ],

  "<": [
    "INTEGER",
    "FLOAT",
    "TIMESTAMP",
    "PORT"
  ],

  ">": [
    "INTEGER",
    "FLOAT",
    "TIMESTAMP",
    "PORT"
  ],

  "<=": [
    "INTEGER",
    "FLOAT",
    "TIMESTAMP",
    "PORT"
  ],

  ">=": [
    "INTEGER",
    "FLOAT",
    "TIMESTAMP",
    "PORT"
  ]
};

export function checkProgram(
  program: Program
): void {
  let caseSeen = false;

  for (const statement of program.statements) {
    if (statement.type === "CaseStatement") {
      caseSeen = true;

      if (!statement.id.trim()) {
        throw new ForaxError(
          "Case ID cannot be empty",
          0,
          0
        );
      }
    }

    checkStatement(statement);
  }

  if (!caseSeen) {
    // CASE is intentionally optional so reusable
    // forensic fragments remain valid.
  }
}

function checkStatement(
  statement: Statement
): void {
  switch (statement.type) {
    case "CaseStatement":
      assertOperation("OPEN_CASE");
      return;

    case "LoadPcapStatement":
      assertOperation("LOAD_PCAP");
      return;

    case "CollectStatement":
      assertObject(statement.object);

      assertOperation(
        `COLLECT_${statement.object}`
      );

      return;

    case "FindStatement":
      assertObject(statement.object);

      assertOperation(
        `FIND_${statement.object}`
      );

      if (statement.where) {
        checkWhere(
          statement.object,
          statement.where
        );
      }

      return;

    case "CountStatement":
      assertObject(statement.object);

      assertOperation(
        `COUNT_${statement.object}`
      );

      if (statement.where) {
        checkWhere(
          statement.object,
          statement.where
        );
      }

      return;

    case "FilterStatement":
      assertObject(statement.object);

      assertOperation(
        `FILTER_${statement.object}`
      );

      checkWhere(
        statement.object,
        statement.where
      );

      return;

    case "WatchStatement":
      assertObject(statement.object);

      if (
        statement.object ===
        "NETWORK_CONNECTION"
      ) {
        assertOperation(
          "WATCH_NETWORK_CONNECTION"
        );
      }

      return;

      case "MonitorNetworkStatement":
        assertObject(statement.object);

        if (statement.durationSeconds <= 0) {
          throw new Error(
            "MONITOR duration must be greater than zero seconds."
          );
        }

        if (statement.object === "NETWORK_CONNECTION") {
          assertOperation(
            "WATCH_NETWORK_CONNECTION"
          );
        } else if (statement.object === "PROCESS") {
          assertOperation(
            "COLLECT_PROCESS"
          );
        } else {
          throw new Error(
            `MONITOR does not support object: ${statement.object}`
          );
        }

        return;

    case "StartNetworkMonitorStatement":
      assertOperation(
        "START_NETWORK_MONITOR"
      );
      return;

    case "StopNetworkMonitorStatement":
      assertOperation(
        "STOP_NETWORK_MONITOR"
      );
      return;

    case "CorrelateStatement":
      if (
        statement.leftObject !== "PROCESS" ||
        statement.rightObject !== "NETWORK_CONNECTION"
      ) {
        throw new Error(
          "CORRELATE currently supports only PROCESS WITH NETWORK_CONNECTION."
        );
      }

      assertOperation(
        "CORRELATE_PROCESS_NETWORK_CONNECTION"
      );

      return;
    case "SummarizeProcessStatement":
      assertOperation(
        "SUMMARIZE_PROCESS"
      );
      return;

    case "CreateTimelineStatement":
      assertOperation(
        "CREATE_TIMELINE"
      );
      return;

    case "ReportStatement":
      assertOperation(
        "GENERATE_REPORT"
      );
      return;

    case "HashStatement":
      if (statement.object === "FILE") {
        assertOperation(
          "HASH_FILE"
        );
      } else if (statement.object === "PCAP") {
        assertOperation(
          "HASH_PCAP"
        );
      }
      return;

    case "SearchFileStatement":
      assertOperation(
        "SEARCH_FILE"
      );
      return;

    case "GetFileStatement":
      assertOperation(
        "GET_FILE"
      );
      return;
  }
}

function assertOperation(
  operation: string
): void {
  if (!hasOperation(operation)) {
    throw new ForaxError(
      `FORAX operation '${operation}' is not registered`,
      0,
      0
    );
  }
}

function assertObject(
  object: string
): void {
  if (
    !OBJECT_TYPES.has(
      object as ForaxType
    )
  ) {
    throw new ForaxError(
      `Unknown forensic object '${object}'`,
      0,
      0
    );
  }
}

function checkWhere(
  object: string,
  where: {
    conditions: Condition[];
  }
): void {
  for (const condition of where.conditions) {
    const fieldName =
      condition.field.toUpperCase();

    const definition =
      getForensicField(fieldName);

    if (!definition) {
      throw new ForaxError(
        `Unknown forensic field '${condition.field}'`,
        0,
        0
      );
    }

    if (
      !definition.objects.includes(
        object.toUpperCase()
      )
    ) {
      throw new ForaxError(
        `Field '${condition.field}' is not valid for forensic object '${object}'`,
        0,
        0
      );
    }

    const fieldType =
      definition.type as ForaxType;

    const allowed =
      COMPARABLE[
        condition.operator
      ];

    if (
      !allowed ||
      !allowed.includes(fieldType)
    ) {
      throw new ForaxError(
        `Operator '${condition.operator}' is not valid for ${fieldType}`,
        0,
        0
      );
    }

    const actual =
      valueType(
        condition.value
      );

    if (
      !isCompatibleType(
        fieldType,
        actual
      )
    ) {
      throw new ForaxError(
        `Type mismatch for '${condition.field}': expected ${fieldType}, received ${actual}`,
        0,
        0
      );
    }
  }
}

function isCompatibleType(
  expected: ForaxType,
  actual: ForaxType
): boolean {
  if (expected === actual) {
    return true;
  }

  if (
    expected === "IP_ADDRESS" &&
    actual === "STRING"
  ) {
    return true;
  }

  if (
    expected === "MAC_ADDRESS" &&
    actual === "STRING"
  ) {
    return true;
  }

  if (
    expected === "PROTOCOL" &&
    actual === "STRING"
  ) {
    return true;
  }

  if (
    expected === "HASH" &&
    actual === "STRING"
  ) {
    return true;
  }

  if (
    expected === "PORT" &&
    actual === "INTEGER"
  ) {
    return true;
  }

  return false;
}

function valueType(
  value: string | number | boolean
): ForaxType {
  if (typeof value === "number") {
    return "INTEGER";
  }

  if (typeof value === "boolean") {
    return "BOOLEAN";
  }

  return "STRING";
}










