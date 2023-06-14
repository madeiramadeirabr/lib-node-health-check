export interface SystemType {
  cpu: CPUType;
  memory: MemoryType;
}

export interface CPUType {
  utilization: number;
}

export interface MemoryType {
  total: number;
  used: number;
}
