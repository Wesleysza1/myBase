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
<img width="950" alt="login" src="https://github.com/user-attachments/assets/7a7f7f34-d6d1-4235-91c5-c020173157ab">

### Tema Claro
| Página | Captura de Tela |
|--------|----------------|
| Home | <img width="667" alt="home_white" src="https://github.com/user-attachments/assets/dcc31c68-d09b-417a-a273-89a19485e65f"> |
| Menu | <img width="674" alt="menu_white" src="https://github.com/user-attachments/assets/e3e78ac2-ae09-4172-ad1d-4b2dd6417572"> |
| Cadastro de Profissionais | <img width="666" alt="cadastro_white_public" src="https://github.com/user-attachments/assets/613f960d-78a3-47c2-b201-63ecba278806"> |
| Consulta de Profissionais | <img width="664" alt="consulta_white" src="https://github.com/user-attachments/assets/01c04931-4515-472e-b0dd-6f08d8d0635c"> |
| Política de Privacidade | <img width="666" alt="privacidade_white" src="https://github.com/user-attachments/assets/f3c3c0b8-9639-4f69-9bbc-9e41e98a9e9b"> |

### Tema Escuro
| Página | Captura de Tela |
|--------|----------------|
| Home | <img width="668" alt="home_black" src="https://github.com/user-attachments/assets/6ddc828d-f35c-4795-9113-95618224fc33"> |
| Menu | <img width="673" alt="menu_black" src="https://github.com/user-attachments/assets/899f1be5-fa30-4844-a9af-1d2c16cfe63f"> |
| Cadastro de Profissionais | <img width="667" alt="cadastro_black_public" src="https://github.com/user-attachments/assets/b976ba9e-2239-49bf-a61a-2272dc9e0d6a"> |
| Consulta de Profissionais | <img width="670" alt="consulta_black" src="https://github.com/user-attachments/assets/7666a526-43e5-48fe-8a81-393c0a927be0"> |
| Política de Privacidade | <img width="668" alt="privacidade_black" src="https://github.com/user-attachments/assets/d9ac3dff-c1fa-4675-a123-3a0807b33a71"> |

## Relatórios de Segurança

Este projeto segue práticas de segurança recomendadas. Abaixo estão alguns relatórios de segurança gerados:

| Scan Site | Scan Result |
|--------|----------------|
| [immuniweb](www.immuniweb.com) | ![image](https://github.com/user-attachments/assets/90bfe348-726b-4bb0-b05b-44132cd4f935) |
| [pentest-tools](https://pentest-tools.com) | ![image](https://github.com/user-attachments/assets/1358dde3-f1e3-4065-a6fc-bec3c3da8607) |
| [sucuri](sitecheck.sucuri.net) | ![image](https://github.com/user-attachments/assets/c92c1c29-3572-47f2-a7d4-4f903b4b4804) |
| [sitelock](www.sitelock.com) | ![image](https://github.com/user-attachments/assets/b10d06e1-9de2-449d-b785-1d1df9e73a5a) |
| [securityheaders](securityheaders.com) | ![image](https://github.com/user-attachments/assets/0c4150a6-4f21-4644-85f1-f9f74484ab22) |

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
