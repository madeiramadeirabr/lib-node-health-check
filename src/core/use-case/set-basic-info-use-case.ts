import { HealthCheckRepository } from '../repository/health-check-repository';
import { UseCaseBase } from './use-case';
import { HealthCheckBasicInfo } from '../entities/health-check-basic-info-type';

export class SetBasicInfoUseCase extends UseCaseBase<
  HealthCheckBasicInfo,
  void
> {
  constructor(private healthCheckRepository: HealthCheckRepository) {
    super();
  }

  async execute(data: HealthCheckBasicInfo): Promise<void> {
    this.healthCheckRepository.setHealthCheckBasicInfo(data);
  }
}
