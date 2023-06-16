import { HealthCheckRepository } from '../repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { HealthCheckType } from '../entities/health-check-type';

export class GetDependenciesUseCase extends UseCaseBase<void, HealthCheckType> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async execute(): Promise<HealthCheckType> {
    return this.healthCheckRepository.getHealthCheck();
  }
}
