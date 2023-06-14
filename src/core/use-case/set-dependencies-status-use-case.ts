import { HealthCheckRepository } from 'core/repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { DependencyType } from 'core/entities/dependency-type';

export class SetDependenciesStatusUseCase extends UseCaseBase<
  Pick<DependencyType, 'name' | 'status'>,
  void
> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async execute(data: Pick<DependencyType, 'name' | 'status'>): Promise<void> {
    this.healthCheckRepository.setDependencyStatus(data.name, data.status);
  }
}
