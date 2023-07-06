import { DependencyRunnerRepository } from '../repository/dependency-runner-repository';

export type UpdateDependencyRunnerType = {
  dependencyName: string;
  runner: DependencyRunnerRepository | null;
};
