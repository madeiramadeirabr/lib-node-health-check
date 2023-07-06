# Documentação Técnica

Esta documentação fornece uma visão geral de como configurar uma aplicação Node.js usando o Express e o MongoDB com a biblioteca HealthCheck. Ela abrange a instalação de dependências, a configuração da aplicação e as instruções de uso. A aplicação inclui uma rota padrão e uma rota /health para executar uma verificação de saúde usando a biblioteca HealthCheck. Também é descrito o tratamento de erros para erros de conexão do MongoDB e falhas na verificação de saúde. caso a sua aplicação seja feita em nestjs consulte o arquivo [NestJs](READE_NESTJS.md)


# HealthCheckLib

Métodos

- `getHealthCheck(): Promise<HealthCheckType> `
  Este método retorna uma Promise que é resolvida para um objeto HealthCheckType. O HealthCheckType é um tipo personalizado que representa o status geral da verificação de saúde do sistema ou aplicação. A Promise permite a obtenção assíncrona do status da verificação de saúde.

- `setDependencies(dependencies: DependencyType[]): void`
  Este método define as dependências para a verificação de saúde. Ele recebe como parâmetro um array de objetos DependencyType. O DependencyType é um tipo personalizado que representa uma dependência do sistema ou aplicação. Ao fornecer um array de dependências, é possível configurar a verificação de saúde para monitorar vários componentes ou serviços necessários pelo sistema ou aplicação.

- `setDependencyStatus(dependencyName: string, status: DependencyStatusEnum): void`
  Este método atualiza o status de uma dependência individual. Ele recebe dois parâmetros: dependencyName, que é uma string representando o nome ou identificador da dependência, e status, que é um valor de enumeração do tipo DependencyStatusEnum. O DependencyStatusEnum é um tipo de enumeração personalizado que define diferentes valores de status para uma dependência.

- `setHealthCheckBasicInfo(basicInfo: HealthCheckBasicInfoType): void`
  Este método define as informações básicas da verificação de saúde. Ele recebe como parâmetro um objeto HealthCheckBasicInfoType. O HealthCheckBasicInfoType é um tipo personalizado que representa as informações básicas da verificação de saúde. Ele inclui o nome e a versão da aplicação ou sistema.

- `updateRunnerInDependency(dependencyName: string, runner: DependencyRunnerRepository): Promise<void>`
  Este método atualiza o runner de uma dependência individual. Ele recebe dois parâmetros: dependencyName, que é uma string representando o nome ou identificador da dependência, e runner, que é um objeto DependencyRunnerRepository. O DependencyRunnerRepository é um tipo personalizado que representa um runner de uma dependência. Ele inclui o método run, que é uma função assíncrona que retorna uma Promise. O método run é usado para executar uma verificação de saúde para uma dependência específica.

# Exemplo de uso

Checar o arquivo [Exemplos](Exemplo_NodeJs.md#configuração-de-um-app-com-express-e-mongoose)

# DependencyRunner

Exemplo de como implementar um Runner

Checar o arquivo [Exemplos](Exemplo_NodeJs.md#exemplo-de-configuração-de-um-dependency-runner)