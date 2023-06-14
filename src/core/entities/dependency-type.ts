import { DependencyKindEnum } from './dependency-kind-enum';
import { DependencyStatusEnum } from './dependency-status-enum';

export interface DependencyType {
  name: string;
  kind: DependencyKindEnum;
  status: DependencyStatusEnum;
  latency?: number;
  optional: boolean;
  internal: boolean;
}
