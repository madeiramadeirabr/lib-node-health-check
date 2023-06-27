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

  async execute(data: DependencyType[]): Promise<void> {
    this.healthCheckRepository.setDependencies(data);
  }
}
