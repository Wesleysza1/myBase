'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Alert, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { getUrl } from 'aws-amplify/storage';

export default function PoliticaPrivacidade() {
  const theme = useTheme();
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPolicyContent();
  }, []);

  const fetchPolicyContent = async () => {
    try {
      const { url } = await getUrl({
        key: 'documentos/privacy-policy.md',
        options: {
          accessLevel: 'guest',
          validateObjectExistence: true
        }
      });

      const response = await fetch(url);
      if (!response.ok) throw new Error('Falha ao carregar arquivo');
      const content = await response.text();
      setConteudo(content);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar a política:', error);
      setError('Erro ao carregar a política de privacidade.');
    } finally {
      setLoading(false);
    }
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
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
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
        )}
      </Paper>
    </Container>
  );
}