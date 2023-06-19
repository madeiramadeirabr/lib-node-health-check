# Documentação Técnica

Esta documentação fornece uma visão geral de como configurar uma aplicação Node.js usando o NestJs com a biblioteca HealthCheck. Ela abrange a instalação de dependências, a configuração da aplicação e as instruções de uso. A aplicação inclui uma rota padrão e uma rota /health para executar uma verificação de saúde usando a biblioteca HealthCheck. Também é descrito o tratamento de erros para erros de conexão do MongoDB e falhas na verificação de saúde.

## HealthCheckLib

Métodos

- `getHealthCheck(): Promise<HealthCheckType> `
  Este método retorna uma Promise que é resolvida para um objeto HealthCheckType. O HealthCheckType é um tipo personalizado que representa o status geral da verificação de saúde do sistema ou aplicação. A Promise permite a obtenção assíncrona do status da verificação de saúde.

- `setDependencies(dependencies: DependencyType[]): void`
  Este método define as dependências para a verificação de saúde. Ele recebe como parâmetro um array de objetos DependencyType. O DependencyType é um tipo personalizado que representa uma dependência do sistema ou aplicação. Ao fornecer um array de dependências, é possível configurar a verificação de saúde para monitorar vários componentes ou serviços necessários pelo sistema ou aplicação.

- `setDependencyStatus(dependencyName: string, status: DependencyStatusEnum): void`
  Este método atualiza o status de uma dependência individual. Ele recebe dois parâmetros: dependencyName, que é uma string representando o nome ou identificador da dependência, e status, que é um valor de enumeração do tipo DependencyStatusEnum. O DependencyStatusEnum é um tipo de enumeração personalizado que define diferentes valores de status para uma dependência.

### Exemplo de uso

No seu módulo principal, importe o módulo HealthCheckModule e injete a biblioteca HealthCheckLib no construtor. Em seguida, defina as dependências para a verificação de saúde usando o método setDependencies. Por fim, defina o status de cada dependência usando o método setDependencyStatus.

```javascript
import { HealthCheckService, DependencyType, DependencyKindEnum, DependencyStatusEnum } from 'lib-node-health-check/presentation/nestjs';
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
    HealthCheckModule.register(),
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
        kind: DependencyKindEnum.DATABASE,
        status: DependencyStatusEnum.UP,
      },
    ];
    this.healthCheckLib.setDependencies(dependencies);
  }
}
```

```javascript
import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckService } from 'lib-node-health-check/presentation/nestjs';

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
