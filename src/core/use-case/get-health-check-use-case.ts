import { HealthCheckRepository } from 'core/repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { HealthCheckType } from 'core/entities/health-check-type';

export class SetDependenciesUseCase extends UseCaseBase<void, HealthCheckType> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async execute(): Promise<HealthCheckType> {
    return this.healthCheckRepository.getHealthCheck();
  }
}
