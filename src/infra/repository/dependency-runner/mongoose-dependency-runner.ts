import { DependencyRunnerRepository } from '../../../core/repository/dependency-runner-repository';
import { DependencyStatusEnum } from '../../../core/entities/dependency-status-enum';

export class MongooseDependencyRunner implements DependencyRunnerRepository {
  async getStatus(): Promise<DependencyStatusEnum | undefined> {
    try {
      // @ts-ignore
      const mongoose = require('mongoose');

      if (mongoose.connection.readyState === 1) {
        return DependencyStatusEnum.Healthy;
      }

      return DependencyStatusEnum.Unavailable;
    } catch (error) {
      return undefined
    }
  }
}
