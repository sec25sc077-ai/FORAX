import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface DeviceEvidence {
  computerName: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  biosVersion: string | null;
  operatingSystem: string | null;
}

export async function collectDevice(): Promise<DeviceEvidence> {
  if (process.platform !== "win32") {
    throw new Error("The current device collector supports Windows only.");
  }

  const { stdout } = await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      `
      $computer = Get-CimInstance Win32_ComputerSystem
      $bios = Get-CimInstance Win32_BIOS
      $os = Get-CimInstance Win32_OperatingSystem

      [PSCustomObject]@{
        ComputerName = $computer.Name
        Manufacturer = $computer.Manufacturer
        Model = $computer.Model
        SerialNumber = $bios.SerialNumber
        BIOSVersion = (($bios.SMBIOSBIOSVersion) -join ', ')
        OperatingSystem = $os.Caption
      } | ConvertTo-Json -Compress
      `
    ],
    {
      windowsHide: true,
      maxBuffer: 5 * 1024 * 1024
    }
  );

  const row: any = JSON.parse(stdout);

  return {
    computerName: String(row.ComputerName ?? ""),
    manufacturer:
      row.Manufacturer == null
        ? null
        : String(row.Manufacturer),
    model:
      row.Model == null
        ? null
        : String(row.Model),
    serialNumber:
      row.SerialNumber == null
        ? null
        : String(row.SerialNumber),
    biosVersion:
      row.BIOSVersion == null
        ? null
        : String(row.BIOSVersion),
    operatingSystem:
      row.OperatingSystem == null
        ? null
        : String(row.OperatingSystem)
  };
}
