import { DependencyRunnerRepository } from '../../../core/repository/dependency-runner-repository';
import { DependencyStatusEnum } from '../../../presentation';
// @ts-ignore
import mongoose from 'mongoose';

export class MongoDependencyRunner implements DependencyRunnerRepository {
  async getStatus(): Promise<DependencyStatusEnum> {
    try {
      const sampleResult = await mongoose.connection.db.admin().listDatabases();
      if (sampleResult.databases.length > 0) {
        return DependencyStatusEnum.Healthy;
      }
    } catch (error) {
      return DependencyStatusEnum.Unavailable;
    }
  }
}
