// amplify\data\resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Profissional: a.model({
    id: a.id().required(),
    nome: a.string().required(),
    telefone: a.string().required(),
    email: a.string().required(),
    profissao: a.string().array().required(),
    linkedin: a.string(),
    portfolio: a.string(),
    cnpjMei: a.string(),
    pais: a.string().required(),
    cidade: a.string().required(),
    curriculoUrl: a.string(),
  })
  .authorization(allow => [allow.publicApiKey()])
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});