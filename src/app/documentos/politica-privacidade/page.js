'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Box, Paper, Snackbar, Alert, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function PoliticaPrivacidade() {
  const theme = useTheme();
  const [conteudo, setConteudo] = useState('');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const { authStatus } = useAuthenticator();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPolicyContent();
  }, []);

  const fetchPolicyContent = async () => {
    try {
      // Primeiro, obtemos a URL do arquivo
      const { url } = await getUrl({
        key: 'documentos/privacy-policy.md',
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true
        }
      });

      // Depois, fazemos o fetch do conteúdo
      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao carregar arquivo');
      const content = await response.text();
      setConteudo(content);
    } catch (error) {
      console.error('Erro ao carregar a política:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar a política de privacidade.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEdicao = () => {
    if (authStatus !== 'authenticated') {
      setSnackbar({
        open: true,
        message: 'Você precisa estar autenticado para editar a política.',
        severity: 'warning'
      });
      return;
    }
    setEditando(!editando);
  };

  const handleSave = async () => {
    try {
      // Converte o texto para um Blob para upload
      const blob = new Blob([conteudo], { type: 'text/markdown' });
      
      await uploadData({
        key: 'documentos/privacy-policy.md',
        data: blob,
        options: {
          accessLevel: 'public',
          // accessLevel: 'protected',
          contentType: 'text/markdown'
        }
      }).result;

      setEditando(false);
      setSnackbar({
        open: true,
        message: 'Política de privacidade atualizada com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar a política de privacidade. Tente novamente.',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const markdownStyles = {
    h1: {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(2),
    },
    h2: {
      color: theme.palette.text.primary,
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(2),
    },
    p: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2),
    },
    ul: {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(2),
    },
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            sx={{
              backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[700],
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
              }
            }}
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        {!editando ? (
          <Box>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <Typography variant="h3" sx={markdownStyles.h1} {...props} />,
                h2: ({ node, ...props }) => <Typography variant="h4" sx={markdownStyles.h2} {...props} />,
                p: ({ node, ...props }) => <Typography variant="body1" sx={markdownStyles.p} {...props} />,
                ul: ({ node, ...props }) => <Box component="ul" sx={markdownStyles.ul} {...props} />,
                li: ({ node, ...props }) => <Typography component="li" variant="body1" sx={markdownStyles.p} {...props} />,
              }}
            >
              {conteudo}
            </ReactMarkdown>
            <Button
              variant="contained"
              onClick={toggleEdicao}
              sx={{
                mt: 2,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                }
              }}
            >
              Editar
            </Button>
          </Box>
        ) : (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              variant="outlined"
              sx={{
                mt: 2,
                backgroundColor: theme.palette.background.default,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.dark,
                  },
                },
              }}
              InputProps={{
                sx: { color: theme.palette.text.primary }
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                Salvar
              </Button>
              <Button
                variant="outlined"
                onClick={toggleEdicao}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: 'transparent',
                  }
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color: theme.palette.mode === 'light'
                ? snackbar.severity === 'success'
                  ? theme.palette.success.main
                  : theme.palette.error.main
                : snackbar.severity === 'success'
                  ? theme.palette.success.light
                  : theme.palette.error.light
            },
            border: `1px solid ${snackbar.severity === 'success'
                ? theme.palette.success.main
                : theme.palette.error.main
              }`
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}