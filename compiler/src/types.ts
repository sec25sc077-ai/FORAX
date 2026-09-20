export type TokenType =
  | "KEYWORD"
  | "IDENTIFIER"
  | "STRING"
  | "NUMBER"
  | "OPERATOR"
  | "NEWLINE"
  | "EOF";

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
  raw: string;
}

export interface Program {
  type: "Program";
  statements: Statement[];
}

export type Statement =
  | CaseStatement
  | LoadPcapStatement
  | CollectStatement
  | FindStatement
  | CountStatement
  | SummarizeProcessStatement
  | CorrelateStatement
  | FilterStatement
  | CreateTimelineStatement
  | ReportStatement
  | StartNetworkMonitorStatement
  | StopNetworkMonitorStatement
  | WatchStatement
  | MonitorNetworkStatement
  | HashFileStatement
  | GetFileStatement
  | SearchFileStatement
  | GetProcessStatement
  | VerifyFileStatement;


export interface CaseStatement {
  type: "CaseStatement";
  id: string;
}

export interface LoadPcapStatement {
  type: "LoadPcapStatement";
  path: string;
}

export interface CollectStatement {
  type: "CollectStatement";
  object: string;
}

export interface FindStatement {
  type: "FindStatement";
  object: string;
  where?: WhereClause;
}

export interface CountStatement {
  type: "CountStatement";
  object: string;
  where?: WhereClause;
}

export interface SummarizeProcessStatement {
  type: "SummarizeProcessStatement";
}

export interface CorrelateStatement {
  type: "CorrelateStatement";
  leftObject: string;
  rightObject: string;
}

export interface FilterStatement {
  type: "FilterStatement";
  object: string;
  where: WhereClause;
}

export interface CreateTimelineStatement {
  type: "CreateTimelineStatement";
}

export interface ReportStatement {
  type: "ReportStatement";
}

export interface StartNetworkMonitorStatement {
  type: "StartNetworkMonitorStatement";
}

export interface StopNetworkMonitorStatement {
  type: "StopNetworkMonitorStatement";
}

export interface WatchStatement {
  type: "WatchStatement";
  object: string;
}

export interface MonitorNetworkStatement {
  type: "MonitorNetworkStatement";
  object: string;
  durationSeconds: number;
}

export interface HashFileStatement {
  type: "HashFileStatement";
  path: string;
}

  export interface VerifyFileStatement {
    type: "VerifyFileStatement";
    path: string;
    expectedHash: string;
  }
export interface SearchFileStatement {
  type: "SearchFileStatement";
  directory: string;
  pattern: string;
}

export interface GetFileStatement {
  type: "GetFileStatement";
  path: string;
}

export interface GetProcessStatement {
  type: "GetProcessStatement";
  pid: number;
}

export interface WhereClause {
  type: "WhereClause";
  conditions: Condition[];
  operators: ("AND" | "OR")[];
}

export interface Condition {
  field: string;
  operator: string;
  value: string | number | boolean;
}

export type ForaxType =
  | "STRING"
  | "INTEGER"
  | "FLOAT"
  | "BOOLEAN"
  | "TIMESTAMP"

  // First-class forensic domain types
  | "IP_ADDRESS"
  | "MAC_ADDRESS"
  | "PORT"
  | "PROTOCOL"
  | "HASH"

  // Evidence/object types
  | "PROCESS"
  | "FILE"
  | "USER"
  | "DEVICE"
  | "NETWORK_CONNECTION"
  | "PACKET"
  | "FLOW"
  | "PCAP"
  | "TIMELINE"
  | "EVIDENCE"
  | "REPORT"

  | "UNKNOWN";

export interface TypedValue {
  type: ForaxType;
  value: string | number | boolean;
}

















