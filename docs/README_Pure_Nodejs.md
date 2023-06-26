# Documentação Técnica

Esta documentação fornece uma visão geral de como configurar uma aplicação Node.js usando o Express e o MongoDB com a biblioteca HealthCheck. Ela abrange a instalação de dependências, a configuração da aplicação e as instruções de uso. A aplicação inclui uma rota padrão e uma rota /health para executar uma verificação de saúde usando a biblioteca HealthCheck. Também é descrito o tratamento de erros para erros de conexão do MongoDB e falhas na verificação de saúde.
## HealthCheckLib

Métodos

- `getHealthCheck(): Promise<HealthCheckType> `
  Este método retorna uma Promise que é resolvida para um objeto HealthCheckType. O HealthCheckType é um tipo personalizado que representa o status geral da verificação de saúde do sistema ou aplicação. A Promise permite a obtenção assíncrona do status da verificação de saúde.

- `setDependencies(dependencies: DependencyType[]): void`
  Este método define as dependências para a verificação de saúde. Ele recebe como parâmetro um array de objetos DependencyType. O DependencyType é um tipo personalizado que representa uma dependência do sistema ou aplicação. Ao fornecer um array de dependências, é possível configurar a verificação de saúde para monitorar vários componentes ou serviços necessários pelo sistema ou aplicação.

- `setDependencyStatus(dependencyName: string, status: DependencyStatusEnum): void`
  Este método atualiza o status de uma dependência individual. Ele recebe dois parâmetros: dependencyName, que é uma string representando o nome ou identificador da dependência, e status, que é um valor de enumeração do tipo DependencyStatusEnum. O DependencyStatusEnum é um tipo de enumeração personalizado que define diferentes valores de status para uma dependência.

- `setHealthCheckBasicInfo(basicInfo: HealthCheckBasicInfoType): void`
  Este método define as informações básicas da verificação de saúde. Ele recebe como parâmetro um objeto HealthCheckBasicInfoType. O HealthCheckBasicInfoType é um tipo personalizado que representa as informações básicas da verificação de saúde. Ele inclui o nome e a versão da aplicação ou sistema.

- `DependencyRunner` 
  Esta classe é usada para executar verificações de saúde para dependências individuais. Ela retorna um estado de verificação de saúde para uma dependência específica. Ela é usada internamente pela biblioteca HealthCheck para executar verificações de saúde para cada dependência.

### Exemplo de uso


```javascript
const express = require('express');
const mongoose = require('mongoose');
const {
  HealthCheckLib,
  DependencyType,
  DependencyKindEnum,
  DependencyStatusEnum,
} = require('lib-node-health-check');

// Create an Express application
const app = express();

// Configure MongoDB connection
mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// Handle MongoDB connection success
db.once('open', () => {
  console.log('MongoDB connected successfully');

  // Initialize the HealthCheck library
  const healthCheck = HealthCheckLib.getInstance();
  //create a list of dependencies
  const dependencies: DependencyType[] = [
    {
      name: 'my-app-db-1',
      kind: DependencyKindEnum.Mongodb,
      status: DependencyStatusEnum.Healthy,
      optional: false,
      internal: false,
    },
  ];
  //set the dependencies
  healthCheck.setDependencies(dependencies);
  healthCheck.setHealthCheckBasicInfo({
    name : 'my-app',
    version : '1.0.1',
  })

  db.on('disconnected', () => {
    // Set the dependency status to unavailable
    healthCheck.setDependencyStatus(
      'my-app-db-1',
      DependencyStatusEnum.Unavailable,
    );
  });

  // Set up routes
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.post('/create/book', (req, res) => {
    db.collection('books').insertOne(req.body, (error, result) => {
      if (error) {
        console.error('Error creating book:', error);
        // Set the dependency status to unhealthy
        healthCheck.setDependencyStatus(
          'my-app-db-1',
          DependencyStatusEnum.Unhealthy,
        );
        res.status(500).json({ error: 'Error creating book' });
      } else {
        // Set the dependency status to healthy
        healthCheck.setDependencyStatus(
          'my-app-db-1',
          DependencyStatusEnum.Healthy,
        );
        res.status(201).json(result.ops[0]);
      }
    });
  });

  app.get('/health', async (req, res) => {
    try {
      // Perform health check and retrieve results
      const healthCheckResult = await healthCheck.getHealthCheck();
      res.json(healthCheckResult);
    } catch (error) {
      res.status(500).json({ error: 'Health check failed' });
    }
  });

  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
```
### DependencyRunner

A lib possui um `DependencyRunner` incluso chamado de `MongooseDepencyRunner` ele e incluido automaticamente quando o `kind` e interno, e não foi informado nenhum outro runner.

Exemplo de como implementar um Runner

```javascript

const { DependencyRunnerRepository, DependencyStatusEnum } = require('lib-node-health-check');

class APIPokemonRunner extends DependencyRunnerRepository {
  constructor() {
    super();
  }

  async getStatus(): Promise<DependencyStatusEnum | undefined> {
    try {
      const response = await axios.get('https://pokeapi.co/alive');
      if (response.status === 200) {
        return DependencyStatusEnum.Healthy;
      }
      return DependencyStatusEnum.Unhealthy;
    } catch (error) {
      // return DependencyStatusEnum.Unavailable;
      return undefined; //retornamos undefined quando não temos um status para atualizar na dependencia
    }
  }
}

const healthCheck = HealthCheckLib.getInstance();
//create a list of dependencies
const dependencies: DependencyType[] = [
  {
    name: 'pokemon-api',
    kind: DependencyKindEnum.WebService,
    status: DependencyStatusEnum.Healthy,
    optional: false,
    internal: false,
    runner: new APIPokemonRunner(),
  },
];
//set the dependencies
healthCheck.setDependencies(dependencies);

```