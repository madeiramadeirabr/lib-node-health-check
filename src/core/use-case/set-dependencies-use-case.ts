import { HealthCheckRepository } from '../repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { DependencyType } from '../entities/dependency-type';
import { DependencyRunnerRepository } from '../repository/dependency-runner-repository';
import { DependencyKindEnum } from '../entities/dependency-kind-enum';
import { Container } from '../../container';

export class SetDependenciesUseCase extends UseCaseBase<
  DependencyType[],
  void
> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  getRunner(kind: DependencyKindEnum): DependencyRunnerRepository | undefined {
    switch (kind) {
      case DependencyKindEnum.Mongodb:
        return Container.getMongoDependencyRunner();
      case DependencyKindEnum.Mysql:
      // return new MySqlRunner(); //TODO
      default:
        return undefined;
    }
  }

  async execute(data: DependencyType[]): Promise<void> {
    data.forEach((dependency) => {
      if (dependency.runner === undefined && dependency.internal) {
        dependency.runner = this.getRunner(dependency.kind);
      }
    });
    this.healthCheckRepository.setDependencies(data);
  }
}
