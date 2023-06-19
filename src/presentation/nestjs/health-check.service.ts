import { Injectable, Inject } from '@nestjs/common';

import {
  DependencyStatusEnum,
  DependencyType,
  HealthCheckLib,
  HealthCheckType,
} from '../lib';

@Injectable()
export class HealthCheckService {
  constructor() {}

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
