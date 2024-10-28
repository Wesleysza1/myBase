// src/app/page.js
"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles'; // Hook para acessar o tema atual

// Componente do Card
function NavigationCard({ title, description, href }) {
  const theme = useTheme(); // Acessa o tema atual (claro ou escuro)

  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: theme.palette.background.paper, // Usa o fundo do tema
        color: theme.palette.text.primary, // Usa o texto do tema
        borderRadius: 2,
        "&:hover": {
          backgroundColor: theme.palette.background.hover.paper, // Hover com cor de fundo do tema
        },
      }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={Link}
          href={href}
          sx={{ color: theme.palette.primary.dark }} // Cor do botão definida pelo tema
        >
          Acessar
        </Button>
      </CardActions>
    </Card>
  );
}

// Página Home
export default function Home() {
  const theme = useTheme(); // Acessa o tema atual

  return (
    <Box sx={{ marginTop: 5 }}>
      <Divider component="div" role="presentation">
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily:'"Ubuntu Mono", "monospace"' }}>
          Gestão de Profissionais
        </Typography>
      </Divider>

      <Box sx={{ flexGrow: 1, padding: 3, borderRadius: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/* Card para Cadastro */}
            <NavigationCard
              title="Cadastro de Profissionais"
              description="Página para registro de novos profissionais."
              href="/profissionais/cadastro"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Card para Consulta */}
            <NavigationCard
              title="Consulta de Profissionais"
              description="Consulte a base de dados de profissionais."
              href="/profissionais/consulta"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}