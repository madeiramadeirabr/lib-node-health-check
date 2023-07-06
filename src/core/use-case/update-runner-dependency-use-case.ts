import { UpdateDependencyRunnerType } from '../entities/update-dependency-runner-type';
import { HealthCheckRepository } from '../repository/health-check-repository';
import { UseCaseBase } from './use-case';

export class UpdateDependencyRunnerUseCase extends UseCaseBase<
  UpdateDependencyRunnerType,
  void
> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async execute(data: UpdateDependencyRunnerType) {
    this.healthCheckRepository.updateRunnerInDependency(
      data.dependencyName,
      data.runner,
    );
  }
}
