import { HealthCheckRepository } from './core/repository/health-check-repository';
import { GetDependenciesUseCase } from './core/use-case/get-health-check-use-case';
import { SetDependenciesStatusUseCase } from './core/use-case/set-dependencies-status-use-case';
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
        return new HashMapHealthCheck(Container.getMemory());
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
    return Container.make<SetDependenciesStatusUseCase>(
      'SetDependenciesUseCase',
      () => {
        return new SetDependenciesStatusUseCase(
          Container.getHealthCheckRepository(),
        );
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
}