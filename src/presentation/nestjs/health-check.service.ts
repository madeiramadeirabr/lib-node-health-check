// @ts-ignore-start
import { Injectable, Inject, Optional } from '@nestjs/common';
// @ts-ignore-end

import {
  DependencyStatusEnum,
  DependencyType,
  HealthCheckBasicInfo,
  HealthCheckLib,
  HealthCheckType,
} from '..';
import { HealthCheckOptionsDto } from './health-check-options.dto';

@Injectable()
export class HealthCheckService {
  constructor(
    @Optional()
    @Inject('HEALTH_CHECK_OPTIONS')
    private healthCheckOptionsDto?: HealthCheckOptionsDto,
  ) {
    HealthCheckLib.getInstance();
    if (healthCheckOptionsDto) {
      this.setHealthCheckBasicInfo({
        name: healthCheckOptionsDto.name,
        version: healthCheckOptionsDto.version,
      });
    }
  }

  public async setHealthCheckBasicInfo(
    basicInfo: HealthCheckBasicInfo,
  ): Promise<void> {
    await HealthCheckLib.getInstance().setHealthCheckBasicInfo(basicInfo);
  }

  public async setDependencies(dependencies: DependencyType[]): Promise<void> {
    await HealthCheckLib.getInstance().setDependencies(dependencies);
  }

  public async setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): Promise<void> {
    await HealthCheckLib.getInstance().setDependencyStatus(
      dependencyName,
      status,
    );
  }

  public async getHealthCheck(): Promise<HealthCheckType> {
    return await HealthCheckLib.getInstance().getHealthCheck();
  }
}
