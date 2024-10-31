<h1 align="center">Welcome to MyBase 👋</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> MyBase é uma aplicação web desenvolvida com Next.js e hospedada no AWS Amplify. A aplicação oferece funcionalidades para o gerenciamento de profissionais e documentos, utilizando serviços do Amplify, como Auth (autenticação), Data (banco de dados) e Storage (armazenamento de arquivos). Ela se integra com Amazon Cognito, Amazon DynamoDB e Amazon S3 para essas funcionalidades.

## Funcionalidades

- **Cadastro de profissionais (Privada)**: Acesso restrito a usuários autenticados via Amazon Cognito. Permite cadastrar profissionais na base de dados.
- **Consulta de profissionais (Privada)**: Permite consultar, editar e excluir profissionais, além de exportar os dados em formato CSV.
- **Política de Privacidade (Privada)**: Visualização e edição da política de privacidade aceita pelos usuários cadastrados.
- **Cadastro de profissionais (Pública)**: Aberta para qualquer usuário, com proteção de reCaptcha V3 do Google.
- **Política de Privacidade (Pública)**: Acessível para visualização por qualquer visitante do site.

## Screenshots
### Tela de Login
![login screen](https://drive.google.com/uc?export=view&id=1WppzDODhgZZAB80p0fwnICwwAU89i_tU)

### Tema Claro
| Página | Captura de Tela |
|--------|----------------|
| Home |  |
| Menu | ![screenshot2](./path_to_image2.png) |
| Cadastro de Profissionais | ![screenshot3](./path_to_image3.png) |
| Consulta de Profissionais | ![screenshot4](./path_to_image4.png) |
| Política de Privacidade | ![screenshot5](./path_to_image5.png) |

### Tema Escuro
| Página | Captura de Tela |
|--------|----------------|
| Home | ![screenshot1](./path_to_image1.png) |
| Menu | ![screenshot2](./path_to_image2.png) |
| Cadastro de Profissionais | ![screenshot3](./path_to_image3.png) |
| Consulta de Profissionais | ![screenshot4](./path_to_image4.png) |
| Política de Privacidade | ![screenshot5](./path_to_image5.png) |

## Relatórios de Segurança

Este projeto segue práticas de segurança recomendadas. Abaixo estão alguns relatórios de segurança gerados:

- [Relatório de Segurança AWS Amplify](./path_to_security_report1.pdf)
- [Relatório de Vulnerabilidades](./path_to_security_report2.pdf)

## Configuração do reCaptcha V3

Para configurar o reCaptcha V3 no seu projeto, adicione as seguintes variáveis no arquivo `.env`:

```
RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

Um exemplo dessas variáveis pode ser encontrado no arquivo `.env.example`.

## Configuração de Políticas do Amplify

Dentro da pasta `example`, estão disponíveis exemplos de políticas para os roles autenticados e não autenticados, que devem ser aplicadas para que o aplicativo funcione corretamente.

- **s3-authenticated-policy.json**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "<S3-Bucket-ARN>",
        "<S3-Bucket-ARN>/*"
      ]
    }
  ]
}
```

- **s3-unauthenticated-policy.json**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "<S3-Bucket-ARN>/public/documentos/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "<S3-Bucket-ARN>/public/curriculos/*"
    }
  ]
}
```

> Substitua `<S3-Bucket-ARN>` pelo ARN correto do bucket gerado pelo Amplify após o deploy.

## Exemplo de Política de Privacidade

Um exemplo de política de privacidade também está disponível na pasta `examples`. Esse arquivo deve ser carregado no bucket S3, dentro da pasta `public/documentos/`.

## Instalação

Para instalar as dependências do projeto, execute:

```sh
npm install
```

## Como executar

Para rodar a aplicação localmente:

```sh
npm run start
```

## Autor

👤 **Wesley Carvalho**

* LinkedIn: [Wesley Carvalho](https://www.linkedin.com/in/wesleysza12/)
* GitHub: [@Wesleysza1](https://github.com/Wesleysza1)
