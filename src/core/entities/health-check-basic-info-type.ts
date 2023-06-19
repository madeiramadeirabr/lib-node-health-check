import { HealthCheckType } from './health-check-type';

export type HealthCheckBasicInfo = Pick<
  HealthCheckType | undefined,
  'name' | 'version'
>;
