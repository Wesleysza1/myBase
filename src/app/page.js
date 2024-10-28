"use client";
import * as React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardActions, 
  CardContent, 
  Typography, 
  Button, 
  Divider, 
  useTheme 
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon, 
  Search as SearchIcon,
  People as PeopleIcon, 
  Folder as FolderIcon 
} from '@mui/icons-material';
import Link from 'next/link';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Updated NavigationCard component
function NavigationCard({ title, description, href, icon: Icon }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: 2,
        "&:hover": {
          backgroundColor: theme.palette.background.hover.paper,
        },
      }}
      variant="outlined"
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {Icon && <Icon sx={{ mr: 1, color: theme.palette.primary.main }} />}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          component={Link}
          href={href}
          sx={{ color: theme.palette.primary.dark }}
        >
          Acessar
        </Button>
      </CardActions>
    </Card>
  );
}

// Updated Home page
export default function Home() {
  const theme = useTheme();
  return (
    <Box sx={{ marginTop: 5 }}>
      <Divider component="div" role="presentation">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: '"Audiowide", "system-ui"' }}>
            Gestão de Profissionais
          </Typography>
        </Box>
      </Divider>
      <Box sx={{ flexGrow: 1, padding: 3, borderRadius: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <NavigationCard
              icon={PersonAddIcon}
              title="Cadastro de Profissionais"
              description="Página para registro de novos profissionais."
              href="/profissionais/cadastro"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NavigationCard
              icon={SearchIcon}
              title="Consulta de Profissionais"
              description="Consulte a base de dados de profissionais."
              href="/profissionais/consulta"
            />
          </Grid>
        </Grid>
      </Box>
      <Divider component="div" role="presentation">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FolderIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: '"Audiowide", "system-ui"' }}>
            Documentos
          </Typography>
        </Box>
      </Divider>
      <Box sx={{ flexGrow: 1, padding: 3, borderRadius: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <NavigationCard
              icon={TextSnippetIcon}
              title="Política de Privacidade"
              description="Política de privacidade aceita pelos profissionais ao se cadastrar na base de dados."
              href="/documentos/politica-privacidade"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}