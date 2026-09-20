import {
  collectProcesses,
  ProcessEvidence
} from "./processCollector";

export interface ProcessSnapshot {
  timestamp: string;
  processes: ProcessEvidence[];
}

export class ProcessMonitor {
  private running = false;
  private snapshots: ProcessSnapshot[] = [];
  private monitorTask: Promise<void> | null = null;

  async start(): Promise<ProcessSnapshot> {
    if (this.running) {
      const latest =
        this.snapshots[this.snapshots.length - 1];

      if (latest) {
        return latest;
      }
    }

    this.running = true;

    const initialSnapshot =
      await this.capture();

    this.monitorTask =
      this.monitorLoop();

    return initialSnapshot;
  }

  private async monitorLoop(): Promise<void> {
    while (this.running) {
      await this.sleep(2000);

      if (!this.running) {
        break;
      }

      try {
        await this.capture();
      } catch {
        // Monitoring remains active if one polling cycle fails.
      }
    }
  }

  async monitorFor(
    durationSeconds: number
  ): Promise<ProcessSnapshot> {
    if (durationSeconds <= 0) {
      throw new Error(
        "Process monitoring duration must be greater than zero seconds."
      );
    }

    await this.start();

    try {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, durationSeconds * 1000);
      });
    } finally {
      await this.stop();
    }

    const latest =
      this.snapshots[this.snapshots.length - 1];

    if (!latest) {
      throw new Error(
        "Process monitoring completed without a snapshot."
      );
    }

    return latest;
  }
  async capture(): Promise<ProcessSnapshot> {
    const processes =
      await collectProcesses();

    const snapshot: ProcessSnapshot = {
      timestamp: new Date().toISOString(),
      processes
    };

    this.snapshots.push(snapshot);

    return snapshot;
  }

  async stop(): Promise<void> {
    this.running = false;

    if (this.monitorTask) {
      await this.monitorTask;
      this.monitorTask = null;
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  getSnapshots(): ProcessSnapshot[] {
    return [...this.snapshots];
  }

  private sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}

