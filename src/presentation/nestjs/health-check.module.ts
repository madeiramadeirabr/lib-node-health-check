// @ts-ignore-start
import { Module, DynamicModule } from '@nestjs/common';
// @ts-ignore-end

import { HealthCheckService } from './health-check.service';
import { HealthCheckOptionsDto } from './health-check-options.dto';

@Module({})
export class HealthCheckModule {
  static forRoot(options: HealthCheckOptionsDto): DynamicModule {
    return {
      module: HealthCheckModule,
      providers: [
        {
          provide: 'HEALTH_CHECK_OPTIONS',
          useValue: options,
        },
        HealthCheckService,
      ],
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
