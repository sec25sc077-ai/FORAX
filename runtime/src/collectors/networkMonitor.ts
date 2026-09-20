import {
  collectNetworkConnections,
  NetworkConnectionEvidence
} from "./networkCollector";

export interface NetworkSnapshot {
  timestamp: string;
  connections: NetworkConnectionEvidence[];
}

export class NetworkMonitor {
  private running = false;
  private snapshots: NetworkSnapshot[] = [];
  private monitorTask: Promise<void> | null = null;

  async start(): Promise<NetworkSnapshot> {
    if (this.running) {
      const latest = this.snapshots[this.snapshots.length - 1];

      if (latest) {
        return latest;
      }
    }

    this.running = true;

    const initialSnapshot = await this.capture();

    this.monitorTask = this.monitorLoop();

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
  ): Promise<NetworkSnapshot> {
    if (durationSeconds <= 0) {
      throw new Error(
        "Network monitoring duration must be greater than zero seconds."
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
        "Network monitoring completed without a snapshot."
      );
    }

    return latest;
  }
  async capture(): Promise<NetworkSnapshot> {
    const connections = await collectNetworkConnections();

    const snapshot: NetworkSnapshot = {
      timestamp: new Date().toISOString(),
      connections
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

  getSnapshots(): NetworkSnapshot[] {
    return [...this.snapshots];
  }

  private sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}

