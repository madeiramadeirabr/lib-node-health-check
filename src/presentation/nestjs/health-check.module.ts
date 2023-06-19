import { Module, DynamicModule } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';

@Module({})
export class HealthCheckModule {
  static forRoot(): DynamicModule {
    return {
      module: HealthCheckModule,
      providers: [HealthCheckService],
      exports: [HealthCheckService],
    };
  }
  static forFeature(): DynamicModule {
    return {
      module: HealthCheckModule,
      providers: [HealthCheckService],
      exports: [HealthCheckService],
    };
  }
}
