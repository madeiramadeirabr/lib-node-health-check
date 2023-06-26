import { DependencyStatusEnum } from '../../../core/entities/dependency-status-enum';
import { DependencyType } from '../../../core/entities/dependency-type';
import { HealthCheckBasicInfo } from '../../../core/entities/health-check-basic-info-type';
import { HealthCheckType } from '../../../core/entities/health-check-type';
import { HealthCheckRepository } from '../../../core/repository/health-check-repository';
import { HealthCheckStatusEnum } from '../../../core/entities/health-status-enum';
import { SystemType } from '../../../core/entities/system-type';
import { Memory } from '../../datasource/memory/interface/memory-interface';
import os from 'os';

export class HashMapHealthCheck implements HealthCheckRepository {
  private readonly DependenciesKey = 'dependencies';
  private readonly basicInfoKey = 'basic-info';
  private readonly RUNNER_INTERVAL = 1000;
  private interval: NodeJS.Timeout | undefined;

  constructor(private cache: Memory) {}

  init(): void {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.processRunners();
    }, this.RUNNER_INTERVAL);
  }

  public async processRunners() {
    const dependencies =
      this.cache.get<DependencyType[]>(this.DependenciesKey) || [];
    await Promise.allSettled(
      dependencies.map(async (dependency) => {
        if (dependency.runner) {
          const status = await dependency.runner.getStatus();
          if (status) {
            this.setDependencyStatus(dependency.name, status);
          }
        }
        return dependency;
      }),
    );
  }

  setHealthCheckBasicInfo(basicInfo: HealthCheckBasicInfo): void {
    this.cache.set(this.basicInfoKey, basicInfo);
  }

  getBasicInfo(): HealthCheckBasicInfo {
    return this.cache.get<HealthCheckBasicInfo>(this.basicInfoKey);
  }

  async getHealthCheck(): Promise<HealthCheckType> {
    const dependencies = this.cache.get<DependencyType[]>(this.DependenciesKey);
    const basicInfo = this.getBasicInfo();
    let currentStatus = HealthCheckStatusEnum.Healthy;

    if (
      dependencies.some(
        (dependency) =>
          dependency.status === DependencyStatusEnum.Unavailable &&
          !dependency.optional,
      )
    ) {
      currentStatus = HealthCheckStatusEnum.Unavailable;
    } else if (
      dependencies.some(
        (dependency) =>
          dependency.status === DependencyStatusEnum.Unhealthy &&
          !dependency.optional,
      )
    ) {
      currentStatus = HealthCheckStatusEnum.Unhealthy;
    }

    const system: SystemType = this.getSystemStatus();

    //we cant expose the runner to the client
    const dependenciesWithoutRunner = dependencies.map((dependency) => {
      dependency.runner = undefined;
      return dependency;
    });

    const output: HealthCheckType = {
      status: currentStatus,
      dependencies: dependenciesWithoutRunner,
      ...basicInfo,
      timestamp: Date.now(),
      system,
    };

    return output;
  }

  setDependencies(dependencies: DependencyType[]): void {
    this.cache.set(this.DependenciesKey, dependencies);
  }

  setDependencyStatus(
    dependencyName: string,
    status: DependencyStatusEnum,
  ): void {
    this.cache
      .get<DependencyType[]>(this.DependenciesKey)
      .forEach((dependency) => {
        if (dependency.name === dependencyName) {
          dependency.status = status;
        }
      });
  }

  private getSystemStatus(): SystemType {
    const cpu = {
      utilization: this.getCpuUtilization(),
    };

    const memory = {
      total: this.getTotalMemory(),
      used: this.getUsedMemory(),
    };

    return {
      cpu,
      memory,
    };
  }

  private getCpuUtilization(): number {
    const cpuInfo = os.cpus();
    const totalIdle = cpuInfo.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick = cpuInfo.reduce(
      (acc, cpu) =>
        Object.values(cpu.times).reduce((tickAcc, tick) => tickAcc + tick, 0),
      0,
    );

    return (1 - totalIdle / totalTick) * 100;
  }

  private getTotalMemory(): number {
    return os.totalmem();
  }

  private getUsedMemory(): number {
    return os.totalmem() - os.freemem();
  }
}
