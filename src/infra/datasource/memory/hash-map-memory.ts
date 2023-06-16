import { Memory } from './interface/memory-interface';

export class HashMapMemory implements Memory {
  private memory: Map<string, any> = new Map<string, any>();

  clear(): void {
    this.memory.clear();
  }

  all<T>(): T[] {
    return Array.from(this.memory.values());
  }

  set<T>(key: string, value: T): void {
    this.memory.set(key, value);
  }

  get<T>(key: string): T {
    return this.memory.get(key);
  }
}
