export class ForaxError extends Error {
  constructor(
    message: string,
    public readonly line: number,
    public readonly column: number
  ) {
    super(`FORAX error at ${line}:${column}: ${message}`);
    this.name = "ForaxError";
  }
}
