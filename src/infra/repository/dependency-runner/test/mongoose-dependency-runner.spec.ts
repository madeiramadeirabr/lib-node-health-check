import { DependencyStatusEnum } from '../../../../core/entities/dependency-status-enum';
import { MongooseDependencyRunner } from '../mongoose-dependency-runner';

describe('MongooseDependencyRunner', () => {
  let mongooseDependencyRunner: MongooseDependencyRunner;

  beforeEach(() => {
    mongooseDependencyRunner = new MongooseDependencyRunner();
  });
 

  it('should not throw error', async () => {
    await expect(mongooseDependencyRunner.getStatus()).resolves.not.toThrow();    
  }); 
});
