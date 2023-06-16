export interface Memory {
  set<T>(key: string, value: T): void;
  get<T>(key: string): T;
  clear(): void;
  all<T>(): T[];
}
