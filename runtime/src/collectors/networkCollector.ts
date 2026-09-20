import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface NetworkConnectionEvidence {
  protocol: string;
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: string;
  pid: number | null;
}

export async function collectNetworkConnections(): Promise<
  NetworkConnectionEvidence[]
> {
  if (process.platform !== "win32") {
    throw new Error(
      "The current network collector supports Windows only."
    );
  }

  const { stdout } = await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `
      Get-NetTCPConnection |
      Select-Object State,
        LocalAddress,
        LocalPort,
        RemoteAddress,
        RemotePort,
        OwningProcess |
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
    protocol: "TCP",
    localAddress: String(row.LocalAddress ?? ""),
    localPort: Number(row.LocalPort ?? 0),
    remoteAddress: String(row.RemoteAddress ?? ""),
    remotePort: Number(row.RemotePort ?? 0),
    state: String(row.State ?? ""),
    pid:
      row.OwningProcess == null
        ? null
        : Number(row.OwningProcess)
  }));
}