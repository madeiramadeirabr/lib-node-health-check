import { SetBasicInfoUseCase } from '../set-basic-info-use-case';
import { HealthCheckRepository } from '../../repository/health-check-repository';
import { createMock } from 'ts-auto-mock';
import { HealthCheckBasicInfo } from '../../entities/health-check-basic-info-type';

describe('SetBasicInfoUseCase', () => {
  let healthCheckRepository: HealthCheckRepository;
  let setBasicInfoUseCase: SetBasicInfoUseCase;

  beforeEach(() => {
    healthCheckRepository = createMock<HealthCheckRepository>({
      setDependencies: jest.fn(),
    });
    setBasicInfoUseCase = new SetBasicInfoUseCase(healthCheckRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set basic info', async () => {
    const basicInfo: HealthCheckBasicInfo = {
      name: 'name',
      version: 'version'
    };

    await setBasicInfoUseCase.execute(basicInfo);

    expect(healthCheckRepository.setHealthCheckBasicInfo).toHaveBeenCalledWith(
      basicInfo,
    );
  });
});
