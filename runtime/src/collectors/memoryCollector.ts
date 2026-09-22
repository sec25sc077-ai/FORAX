export interface MemoryEvidence {
  MEMORY_SIZE: number;
  MEMORY_PATH: string;
}

export async function collectMemory(): Promise<MemoryEvidence> {
  return {
    MEMORY_SIZE: 0,
    MEMORY_PATH: ""
  };
}
