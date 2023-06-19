import { Module, DynamicModule } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { HealthCheckOptionsDto } from './health-check-options.dto';

@Module({})
export class HealthCheckModule {
  static forRoot(options?: HealthCheckOptionsDto): DynamicModule {
    const out: any = {
      module: HealthCheckModule,
      providers: [HealthCheckService],
      exports: [HealthCheckService],
    };

    if (options) {
      out.providers.push({
        provide: 'HEALTH_CHECK_OPTIONS',
        useValue: options,
      });
    }

    return out;
  }
}
