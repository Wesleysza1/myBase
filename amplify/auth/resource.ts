// amplify\auth\resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    //email: true,
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Código de Acesso: MyBase",
      verificationEmailBody: (createCode) => `Use o código a seguir para redefinir sua senha: ${createCode()}`,
      userInvitation:{
        emailSubject: "Dados de Acesso: MyBase",
        emailBody: (user, code) =>
          `Segue abaixo dados para acesso ao nosso app: <br>
          <br>
          Usuário: ${user()} <br>
          Senha: ${code()}`,
      }
    }
  },
  multifactor: {
    mode: 'REQUIRED',
    totp: true
  },
  userAttributes: {
    nickname: {
      mutable: true,
      required: true,
    },
  },
});