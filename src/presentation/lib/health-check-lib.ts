import { Container } from '../../container';
import { DependencyStatusEnum } from '../../core/entities/dependency-status-enum';
import { DependencyType } from '../../core/entities/dependency-type';
import { HealthCheckBasicInfo } from '../../core/entities/health-check-basic-info-type';
import { HealthCheckType } from '../../core/entities/health-check-type';

export class HealthCheckLib {
  private static instance: HealthCheckLib;

  private constructor() {}

  public static getInstance(): HealthCheckLib {
    if (!HealthCheckLib.instance) {
      HealthCheckLib.instance = new HealthCheckLib();
    }
    return HealthCheckLib.instance;
  }

  public async setDependencies(dependencies: DependencyType[]): Promise<void> {
    const setDependenciesUseCase = Container.getSetDependenciesUseCase();
    await setDependenciesUseCase.execute(dependencies);
  }

  public async setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): Promise<void> {
    const setDependencyStatusUseCase =
      Container.getSetDependenciesStatusUseCase();

    await setDependencyStatusUseCase.execute({
      name: dependencyName,
      status: status,
    });
  }

  public async getHealthCheck(): Promise<HealthCheckType> {
    const getDependenciesUseCase = Container.getGetDependenciesUseCase();
    return await getDependenciesUseCase.execute();
  }

  public async setHealthCheckBasicInfo(
    basicInfo: HealthCheckBasicInfo,
  ): Promise<void> {
    const setHealthCheckBasicInfoUseCase = Container.getSetBasicInfoUseCase();
    await setHealthCheckBasicInfoUseCase.execute(basicInfo);
  }
}
