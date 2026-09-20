import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface ProcessEvidence {
  pid: number;
  parentPid: number | null;
  processName: string;
  executablePath: string | null;
  commandLine: string | null;
}

export async function collectProcesses(): Promise<ProcessEvidence[]> {
  if (process.platform !== "win32") {
    throw new Error(
      "The current process collector supports Windows only."
    );
  }

  const { stdout } = await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `
      Get-CimInstance Win32_Process |
      Select-Object ProcessId,ParentProcessId,Name,ExecutablePath,CommandLine |
      ConvertTo-Json -Compress
      `
    ],
    {
      windowsHide: true,
      maxBuffer: 20 * 1024 * 1024
    }
  );

  if (!stdout.trim()) {
    return [];
  }

  const parsed: unknown = JSON.parse(stdout);

  const rows = Array.isArray(parsed) ? parsed : [parsed];

  return rows.map((row: any) => ({
    pid: Number(row.ProcessId),
    parentPid:
      row.ParentProcessId == null
        ? null
        : Number(row.ParentProcessId),
    processName: String(row.Name ?? ""),
    executablePath:
      row.ExecutablePath == null
        ? null
        : String(row.ExecutablePath),
    commandLine:
      row.CommandLine == null
        ? null
        : String(row.CommandLine)
  }));
}