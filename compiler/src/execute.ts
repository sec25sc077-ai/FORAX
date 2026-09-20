import { Program, Statement, Condition } from "./types";
import { forensicRuntime } from "../../runtime/src/forensicRuntime";

type RuntimeOperator =
  | "=="
  | "!="
  | ">="
  | "<="
  | ">"
  | "<";

function convertConditions(
  conditions: Condition[]
) {
  return conditions.map((condition) => ({
    field: condition.field,
    operator:
      condition.operator as RuntimeOperator,
    value: condition.value
  }));
}

export async function executeProgram(
  program: Program
): Promise<void> {
  for (const statement of program.statements) {
    await executeStatement(statement);
  }
}

async function executeStatement(
  statement: Statement
): Promise<void> {
  switch (statement.type) {
    case "CaseStatement":
      await forensicRuntime.openCase(
        statement.id
      );
      break;

    case "LoadPcapStatement":
      await forensicRuntime.loadPcap(
        statement.path
      );
      break;

    case "CollectStatement":
      await forensicRuntime.collect(
        statement.object
      );
      break;

    case "FindStatement":
      await forensicRuntime.find(
        statement.object,
        statement.where
          ? {
              conditions:
                convertConditions(
                  statement.where.conditions
                ),
              operators:
                statement.where.operators
            }
          : undefined
      );
      break;

    case "CountStatement":
      await forensicRuntime.count(
        statement.object,
        statement.where
          ? {
              conditions:
                convertConditions(
                  statement.where.conditions
                ),
              operators:
                statement.where.operators
            }
          : undefined
      );
      break;
    case "FilterStatement":
      await forensicRuntime.filter(
        statement.object,
        {
          conditions:
            convertConditions(
              statement.where.conditions
            ),
          operators:
            statement.where.operators
        }
      );
      break;

    case "CorrelateStatement":
      await forensicRuntime.correlateProcessNetwork();
      break;

    case "SummarizeProcessStatement":
      await forensicRuntime.summarizeProcess();
      break;

    case "CreateTimelineStatement":
      await forensicRuntime.createTimeline();
      break;

    case "ReportStatement":
      await forensicRuntime.report();
      break;

    case "StartNetworkMonitorStatement":
      await forensicRuntime.startNetworkMonitor();
      break;

    case "StopNetworkMonitorStatement":
      await forensicRuntime.stopNetworkMonitor();
      break;

    case "HashFileStatement":
      await forensicRuntime.hashFile(
        statement.path
      );
      break;

    case "SearchFileStatement":
      await forensicRuntime.searchFile(
        statement.directory,
        statement.pattern
      );
      break;

    case "GetFileStatement":
      await forensicRuntime.getFile(
        statement.path
      );
      break;

    case "GetProcessStatement":
      await forensicRuntime.getProcess(
        statement.pid
      );
      break;
      case "MonitorNetworkStatement":
        if (statement.object === "PROCESS") {
          await forensicRuntime.monitorProcess(
            statement.durationSeconds
          );
        } else {
          await forensicRuntime.monitorNetwork(
            statement.object,
            statement.durationSeconds
          );
        }
        break;
    case "WatchStatement":
      await forensicRuntime.watch(
        statement.object
      );
      break;

    default:
      throw new Error(
        "Unsupported FORAX statement."
      );
  }
}




