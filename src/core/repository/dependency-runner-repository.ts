import { DependencyStatusEnum } from '../entities/dependency-status-enum';

export interface DependencyRunnerRepository {
  getStatus(): Promise<DependencyStatusEnum>;
}
