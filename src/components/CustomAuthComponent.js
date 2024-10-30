// src\components\CustomAuthComponent.js
import React from 'react';
import { Authenticator, useTheme, View, Heading, useAuthenticator, Button, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './custom-auth-styles.css';
import { Typography } from '@mui/material';
import { AuthContext } from './AuthContext';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const messages = {
  'Incorrect username or password.': 'Usuário ou senha incorretos.',
  'Password must have at least 12 characters': 'A senha deve ter pelo menos 12 caracteres',
  'Password must have lower case letters': 'A senha deve ter letras minúsculas',
  'Password must have upper case letters': 'A senha deve ter letras maiúsculas',
  'Password must have numbers': 'A senha deve ter números',
  'Password must have special characters': 'A senha deve ter caracteres especiais',
  'Reset Password': 'Redefinir Senha',
  'Back to Sign In': 'Voltar para Login',
  'Forgot Password?': 'Esqueceu a senha?',
  'Submit': 'Confirmar',
  'Sign in to your account': 'Entrar na sua conta',
  'Sign In': 'Entrar',
  'Create Account': 'Criar Conta',
  'Confirm': 'Confirmar',
  'Skip': 'Pular',
  'Send Code': 'Enviar Código',
  'Confirm Sign In': 'Confirmar Login',
  'Confirm Sign Up': 'Confirmar Cadastro',
  'Enter Information:': 'Digite as informações:',
  'Sign Out': 'Sair'
};

const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <RocketLaunchIcon sx={{ fontSize: 70, color: '#5865F2' }}/>
        <Typography variant='h2' sx={{ color: '#5865F2' }}>MyBase</Typography>
      </View>
    );
  },

  Footer() {
    return null;
  },

  SignIn: {
    Header() {
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();
      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Esqueceu a senha?
          </Button>
        </View>
      );
    },
  },

  ForgotPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          level={5}
          textAlign='center'
        >
          Recuperar Senha
        </Heading>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View textAlign="center">
        </View>
      );
    },
  },

  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          level={5}
          textAlign='center'
        >
          Redefinir Senha
        </Heading>
      );
    },
    Footer() {
      return null;
    },
  },

  SetupTotp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          level={5}
          textAlign='center'
        >
          Configurar Auth
        </Heading>
      );
    },
    Footer() {
      return null;
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Digite seu email',
      label: 'Email',
      isRequired: true,
    },
    password: {
      placeholder: 'Digite sua senha',
      label: 'Senha',
      isRequired: true,
    },
  },
  forgotPassword: {
    username: {
      placeholder: 'Digite seu email',
      label: 'Email',
      isRequired: true,
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      label: 'Código',
      placeholder: 'Digite o código de confirmação',
      isRequired: true,
    },
    password: {
      label: 'Nova senha',
      placeholder: 'Digite sua nova senha',
      isRequired: true,
    },
    confirm_password: {
      label: 'Confirmar senha',
      placeholder: 'Confirme sua nova senha',
      isRequired: true,
    },
  },
  forceNewPassword: {
    password: {
      label: 'Nova senha',
      placeholder: 'Digite sua nova senha',
      isRequired: true,
    },
    confirm_password: {
      label: 'Confirmar senha',
      placeholder: 'Confirme sua nova senha',
      isRequired: true,
    },
    nickname: {
      label: 'Nome',
      placeholder: 'Digite seu nome',
      isRequired: true,
    },
  },
};

const CustomAuthComponent = ({ children }) => {
  return (
    <Authenticator
      initialState="signIn"
      components={components}
      formFields={formFields}
      hideSignUp={true}
      messages={messages}
      variation="modal"
      loginMechanisms={['email']}
      socialProviders={[]}
    >
      {({ signOut, user }) => (
        <AuthContext.Provider value={{ user, signOut }}>
          {children}
        </AuthContext.Provider>
      )}
    </Authenticator>
  );
};

export default CustomAuthComponent;