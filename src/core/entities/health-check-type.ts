import { DependencyType } from './dependency-type';
import { HealthCheckStatusEnum } from './health-status-enum';
import { SystemType } from './system-type';

export interface HealthCheckType {
  name: string;
  status: HealthCheckStatusEnum;
  version: string;
  timestamp: number;
  system: SystemType;
  dependencies: DependencyType[];
}
