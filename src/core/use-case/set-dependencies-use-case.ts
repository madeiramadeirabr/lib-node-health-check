import { HealthCheckRepository } from 'core/repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { DependencyType } from 'core/entities/dependency-type';

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
