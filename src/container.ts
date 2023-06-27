import { HealthCheckRepository } from './core/repository/health-check-repository';
import { GetDependenciesUseCase } from './core/use-case/get-health-check-use-case';
import { SetBasicInfoUseCase } from './core/use-case/set-basic-info-use-case';
import { SetDependenciesStatusUseCase } from './core/use-case/set-dependencies-status-use-case';
import { SetDependenciesUseCase } from './core/use-case/set-dependencies-use-case';
import { HashMapMemory } from './infra/datasource/memory/hash-map-memory';
import { Memory } from './infra/datasource/memory/interface/memory-interface';
import { HashMapHealthCheck } from './infra/repository/hash-map-health-check/hash-map-health-check';

export class Container {
  private static dependencies: Map<string, any> = new Map();

  private static make<T = any>(key: string, makeDependency: () => T): T {
    const dependency = Container.dependencies.get(key);
    if (dependency) return dependency;
    const dependencyInstance = makeDependency();
    Container.dependencies.set(key, dependencyInstance);
    return dependencyInstance;
  }

  public static getHealthCheckRepository() {
    return Container.make<HealthCheckRepository>(
      'HealthCheckRepository',
      () => {
        const healthCheck = new HashMapHealthCheck(Container.getMemory());
        return healthCheck;
      },
    );
  }

  public static getMemory() {
    return Container.make<Memory>('Memory', () => {
      return new HashMapMemory();
    });
  }

  public static getSetDependenciesStatusUseCase() {
    return Container.make<SetDependenciesStatusUseCase>(
      'SetDependenciesStatusUseCase',
      () => {
        return new SetDependenciesStatusUseCase(
          Container.getHealthCheckRepository(),
        );
      },
    );
  }

  public static getSetDependenciesUseCase() {
    return Container.make<SetDependenciesUseCase>(
      'SetDependenciesUseCase',
      () => {
        return new SetDependenciesUseCase(Container.getHealthCheckRepository());
      },
    );
  }

  public static getGetDependenciesUseCase() {
    return Container.make<GetDependenciesUseCase>(
      'GetDependenciesUseCase',
      () => {
        return new GetDependenciesUseCase(Container.getHealthCheckRepository());
      },
    );
  }

  public static getSetBasicInfoUseCase() {
    return Container.make<SetBasicInfoUseCase>('SetBasicInfoUseCase', () => {
      return new SetBasicInfoUseCase(Container.getHealthCheckRepository());
    });
  }
}
