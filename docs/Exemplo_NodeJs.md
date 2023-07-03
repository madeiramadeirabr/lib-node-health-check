# Configuração de um APP com express e mongoose

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
mongoose.connect('mongodb://localhost/my-app', {
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
    name: 'my-app',
    version: '1.0.1',
  });

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

# Exemplo de configuração de um Dependency Runner

```javascript
const {
  DependencyRunnerRepository,
  DependencyStatusEnum,
} = require('lib-node-health-check');

//NOTE - Em javascript puro voce não consegue implementar a interface DependencyRunnerRepository

class APIPokemonRunner extends DependencyRunnerRepository {
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

class MongoStatus extends DependencyRunnerRepository {
  protected async getStatus() {
    try {
      const connectionStatus = mongoose.connection.readyState;
      if (connectionStatus === 1) return DependencyStatusEnum.Healthy;
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
  {
    name: 'mongodb',
    kind: DependencyKindEnum.Mongodb,
    status: DependencyStatusEnum.Healthy,
    optional: false,
    internal: true,
    runner: new MongoStatus(),
  },
];
//set the dependencies
healthCheck.setDependencies(dependencies);
```
