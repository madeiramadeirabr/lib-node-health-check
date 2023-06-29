# Configuração de um APP com express e mongoose

```javascript
import { HealthCheckService, DependencyType, DependencyKindEnum, DependencyStatusEnum } from 'lib-node-health-check';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    HealthCheckModule.forRoot({
      name : 'my-app',
      version : '1.0.1',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  static public DB_NAME = 'MongoDB';
  constructor(private readonly healthCheckLib: HealthCheckService) {
    const dependencies: DependencyType[] = [
      {
        name: AppModule.DB_NAME,
        kind: DependencyKindEnum.Mongodb,
        status: DependencyStatusEnum.Healthy,
      },
    ];
    this.healthCheckLib.setDependencies(dependencies);
  }
}
```

### Já no arquivo controller e ou service voce receberá a seguinte injeção: `HealthCheckService`

```javascript
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckService } from 'lib-node-health-check';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthCheckLib: HealthCheckService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('book')
  async createBook(): Promise<any> {
    try {
      const book = await this.appService.createBook();
      this.healthCheckLib.setDependencyStatus(AppModule.DB_NAME, DependencyStatusEnum.Healthy);
      return {
        message: 'Book created successfully',
        book,
      };
    } catch (error) {
        this.healthCheckLib.setDependencyStatus(AppModule.DB_NAME, DependencyStatusEnum.Unhealthy);
        throw error;
    }
  }

  @Get('health')
  async getHealthCheck(): Promise<any> {
    const healthCheck = await this.healthCheckLib.getHealthCheck();
    return healthCheck;
  }
}
```

### Para importar em outros módulos, use o método estático forFeature do módulo HealthCheckModule.

```javascript
import { HealthCheckModule } from 'lib-node-health-check';

@Module({
  imports: [
    HealthCheckModule.forFeature(), //use o forFeature para nao ter que configurar as dependências novamente
  ],
})
export class CatModule {}
```

```javascript
import { HealthCheckService } from 'lib-node-health-check';

@Injectable()
export class CatsService {
  constructor(private readonly healthCheckLib: HealthCheckService) {}
}
```

# Exemplo de uso do dependency runner

Atenção o exemplo abaixo usa typescritpt

```javascript

import { DependencyRunnerRepository, DependencyType, DependencyStatusEnum } from 'lib-node-health-check';

const mongo_name = 'MongoDB';
const dependencies: DependencyType[] = [
  {
    name: mongo_name,
    kind: DependencyKindEnum.Mongodb,
    status: DependencyStatusEnum.Healthy,
    optional: false,
    internal: true,
  },
];

class MongooseRunner extends DependencyRunnerRepository {
  constructor(private readonly connection: any) {
    super()
  }

  protected async getStatus(): Promise<DependencyStatusEnum | undefined> {
    try {
      if (this.connection.readyState === 1) return DependencyStatusEnum.Healthy;
      return DependencyStatusEnum.Unhealthy;
    } catch (error) {
      // return DependencyStatusEnum.Unavailable;
      return undefined; //retornamos undefined quando não temos um status para atualizar na dependencia
    }
  }
}

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/my-app', {
      connectionFactory: (connection) => {
        dependencies[0].runner = new MongooseRunner(connection);
        return connection;
      },
    }),
    // MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    HealthCheckModule.forFeature(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public static DB_NAME = mongo_name;
  constructor(private readonly healthCheckLib: HealthCheckService) {
    this.healthCheckLib.setDependencies(dependencies);
  }
}

```
