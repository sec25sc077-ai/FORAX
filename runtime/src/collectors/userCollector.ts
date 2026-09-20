import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface UserEvidence {
  userName: string;
  domain: string | null;
  sid: string | null;
  status: string | null;
}

export async function collectUsers(): Promise<UserEvidence[]> {
  if (process.platform !== "win32") {
    throw new Error("The current user collector supports Windows only.");
  }

  const { stdout } = await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `
      Get-CimInstance Win32_UserAccount |
      Select-Object Name,Domain,SID,Status |
      ConvertTo-Json -Compress
      `
    ],
    {
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024
    }
  );

  if (!stdout.trim()) {
    return [];
  }

  const parsed: unknown = JSON.parse(stdout);
  const rows = Array.isArray(parsed) ? parsed : [parsed];

  return rows.map((row: any) => ({
    userName: String(row.Name ?? ""),
    domain:
      row.Domain == null
        ? null
        : String(row.Domain),
    sid:
      row.SID == null
        ? null
        : String(row.SID),
    status:
      row.Status == null
        ? null
        : String(row.Status)
  }));
}
