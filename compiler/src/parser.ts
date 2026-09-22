import { ForaxError } from "./errors";
import { Token, Program, Statement, WhereClause, Condition } from "./types";

const OBJECTS = new Set([
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

export class Parser {
  private i = 0;

  constructor(private tokens: Token[]) {}

  parse(): Program {
    const statements: Statement[] = [];

    this.skipNewlines();

    while (!this.check("EOF")) {
      statements.push(this.statement());
      this.skipNewlines();
    }

    return {
      type: "Program",
      statements
    };
  }

  private statement(): Statement {
    const t = this.current();

    switch (t.value) {
      case "CASE":
        return this.caseStatement();

      case "LOAD":
        return this.loadStatement();

      case "COLLECT":
        return this.collectStatement();

      case "CORRELATE":
        return this.correlateStatement();

      case "FIND":
        return this.findStatement();

      case "FILTER":
        return this.filterStatement();

      case "FILTER":
        return this.filterStatement();

      case "SUMMARIZE":
        return this.summarizeStatement();

      case "COUNT":
        return this.countStatement();

      case "CREATE":
        return this.createTimeline();

      case "REPORT":
        return this.reportStatement();

      case "START":
        return this.startMonitor();

      case "STOP":
        return this.stopMonitor();

      case "WATCH":

      case "MONITOR":
        return this.monitorStatement();
        return this.watchStatement();

      case "SEARCH":
        return this.searchFileStatement();

      case "VERIFY":
        return this.verifyFileStatement();

      case "HASH":
        return this.hashFileStatement();

      case "GET":
        return this.getStatement();

      default:
        this.error(
          `Unexpected keyword or identifier '${t.raw}'`,
          t
        );
    }
  }

  private caseStatement(): Statement {
    this.consume("CASE");

    const id = this
      .consumeAny("STRING", "IDENTIFIER")
      .value;

    return {
      type: "CaseStatement",
      id
    };
  }

  private loadStatement(): Statement {
    this.consume("LOAD");
    this.consume("PCAP");

    const path = this
      .consumeAny("STRING", "IDENTIFIER")
      .value;

    return {
      type: "LoadPcapStatement",
      path
    };
  }

  private collectStatement(): Statement {
    this.consume("COLLECT");

    const object = this.object();

    return {
      type: "CollectStatement",
      object
    };
  }

  private findStatement(): Statement {
    this.consume("FIND");

    const object = this.object();

    this.skipNewlines();

    let where: WhereClause | undefined;

    if (this.match("WHERE")) {
      where = this.whereClause();
    }

    return {
      type: "FindStatement",
      object,
      where
    };
  }


  private getStatement(): Statement {
    this.consume("GET");

    if (this.current().value === "FILE") {
      this.consume("FILE");

      const path = this
        .consumeAny("STRING", "IDENTIFIER")
        .value;

      return {
        type: "GetFileStatement",
        path
      };
    }

    if (this.current().value === "PROCESS") {
      this.consume("PROCESS");

      const pid = this.consumeAny("NUMBER").value;

      return {
        type: "GetProcessStatement",
        pid: Number(pid)
      };
    }

    this.error(
      "Expected FILE or PROCESS after GET",
      this.current()
    );
  }
  private getFileStatement(): Statement {
    this.consume("GET");
    this.consume("FILE");

    const path = this
      .consumeAny("STRING", "IDENTIFIER")
      .value;

    return {
      type: "GetFileStatement",
      path
    };
  }
  private correlateStatement(): Statement {
    this.consume("CORRELATE");

    const leftObject = this.object();

    this.consume("WITH");

    const rightObject = this.object();

    this.skipNewlines();

    let where: WhereClause | undefined;

    if (this.match("WHERE")) {
      where = this.whereClause();
    }

    return {
      type: "CorrelateStatement",
      leftObject,
      rightObject,
      where
    };
  }

  private countStatement(): Statement {
    this.consume("COUNT");

    const object = this.object();

    this.skipNewlines();

    let where: WhereClause | undefined;

    if (this.match("WHERE")) {
      where = this.whereClause();
    }

    return {
      type: "CountStatement",
      object,
      where
    };
  }

  private summarizeStatement(): Statement {
    this.consume("SUMMARIZE");

    const object = this.object();

    if (object !== "PROCESS") {
      this.error(
        "SUMMARIZE currently supports PROCESS only.",
        this.current()
      );
    }

    return {
      type: "SummarizeProcessStatement"
    };
  }

  private filterStatement(): Statement {
    this.consume("FILTER");

    const object = this.object();

    this.consume("WHERE");

    return {
      type: "FilterStatement",
      object,
      where: this.whereClause()
    };
  }

  private createTimeline(): Statement {
    this.consume("CREATE");
    this.consume("TIMELINE");

    return {
      type: "CreateTimelineStatement"
    };
  }

  private reportStatement(): Statement {
    this.consume("REPORT");

    return {
      type: "ReportStatement"
    };
  }

  private startMonitor(): Statement {
    this.consume("START");
    this.consume("NETWORK_MONITOR");

    return {
      type: "StartNetworkMonitorStatement"
    };
  }

  private stopMonitor(): Statement {
    this.consume("STOP");
    this.consume("NETWORK_MONITOR");

    return {
      type: "StopNetworkMonitorStatement"
    };
  }

  private monitorStatement(): Statement {
    this.consume("MONITOR");

    const object = this.object();

    this.consume("FOR");

    const duration = this.consumeAny("NUMBER");

    this.consume("SECONDS");

    return {
      type: "MonitorNetworkStatement",
      object,
      durationSeconds: Number(duration.value)
    };
  }
  private watchStatement(): Statement {
    this.consume("WATCH");

    return {
      type: "WatchStatement",
      object: this.object()
    };
  }

  private hashFileStatement(): Statement {
    this.consume("HASH");

    const object = this.object();

    const path =
      this.consumeAny("STRING", "IDENTIFIER").value;

    return {
      type: "HashStatement",
      object: object as "FILE" | "PCAP",
      path
    };
  }
  private searchFileStatement(): Statement {
    this.consume("SEARCH");
    this.consume("FILE");

    const directory =
      this.consumeAny("STRING", "IDENTIFIER").value;

    const pattern =
      this.consumeAny("STRING", "IDENTIFIER").value;

    return {
      type: "SearchFileStatement",
      directory,
      pattern
    };
  }

  private verifyFileStatement(): Statement {
    this.consume("VERIFY");

    const object = this.object();

    const path =
      this.consumeAny("STRING", "IDENTIFIER").value;

    const expectedHash =
      this.consumeAny("STRING", "IDENTIFIER").value;

    return {
      type: "VerifyStatement",
      object: object as "FILE" | "PCAP",
      path,
      expectedHash
    };
  }

  private whereClause(): WhereClause {
    const conditions: Condition[] = [
      this.condition()
    ];

    const operators: ("AND" | "OR")[] = [];

    while (
      this.current().value === "AND" ||
      this.current().value === "OR"
    ) {
      operators.push(
        this.current().value as "AND" | "OR"
      );

      this.i++;

      conditions.push(
        this.condition()
      );
    }

    return {
      type: "WhereClause",
      conditions,
      operators
    };
  }

  private condition(): Condition {
    const field = this
      .consumeAny("IDENTIFIER", "KEYWORD")
      .value;

    const operatorToken = this.current();

    const validOperators = [
      "==",
      "!=",
      "<",
      ">",
      "<=",
      ">="
    ];

    if (
      operatorToken.type !== "OPERATOR" ||
      !validOperators.includes(operatorToken.value)
    ) {
      this.error(
        `Expected comparison operator, found '${operatorToken.raw}'`,
        operatorToken
      );
    }

    const operator = operatorToken.value as
      | "=="
      | "!="
      | "<"
      | ">"
      | "<="
      | ">=";

    this.i++;

    const valueToken = this.current();

    if (
      ![
        "STRING",
        "NUMBER",
        "IDENTIFIER",
        "KEYWORD"
      ].includes(valueToken.type)
    ) {
      this.error(
        `Expected a condition value, found '${valueToken.raw}'`,
        valueToken
      );
    }

    this.i++;

    let value: string | number | boolean =
      valueToken.value;

    if (valueToken.type === "NUMBER") {
      value = Number(valueToken.value);
    }

    if (valueToken.value === "TRUE") {
      value = true;
    }

    if (valueToken.value === "FALSE") {
      value = false;
    }

    return {
      field,
      operator,
      value
    };
  }

  private object(): string {
    const t = this.consumeAny(
      "KEYWORD",
      "IDENTIFIER"
    );

    if (!OBJECTS.has(t.value)) {
      this.error(
        `Unknown forensic object '${t.raw}'`,
        t
      );
    }

    return t.value;
  }

  private match(value: string): boolean {
    if (this.current().value === value) {
      this.i++;
      return true;
    }

    return false;
  }

  private consume(value: string): Token {
    if (this.current().value !== value) {
      this.error(
        `Expected '${value}', found '${this.current().raw}'`,
        this.current()
      );
    }

    return this.tokens[this.i++];
  }

  private consumeAny(
    ...types: Token["type"][]
  ): Token {
    if (!types.includes(this.current().type)) {
      this.error(
        `Expected ${types.join(" or ")}`,
        this.current()
      );
    }

    return this.tokens[this.i++];
  }

  private check(type: Token["type"]): boolean {
    return this.current().type === type;
  }

  private skipNewlines(): void {
    while (this.check("NEWLINE")) {
      this.i++;
    }
  }

  private current(): Token {
    return this.tokens[this.i];
  }

  private error(
    message: string,
    t: Token
  ): never {
    throw new ForaxError(
      message,
      t.line,
      t.column
    );
  }
}
























