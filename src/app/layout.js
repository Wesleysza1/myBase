// src/app/layout.js
"use client";
// React and Next.js imports
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

// Material UI Core Components
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Button,
  Collapse,
} from '@mui/material';

// Material UI Icons
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import LogoIrraBlack from '@/components/icons/LogoIrraBlack';
import AnimatedIconButton from '@/components/AnimatedIconButton';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// Theme and Page Titles
import { lightTheme, darkTheme } from './theme';
import pageTitles from '../components/PageTitle';

// Authentication Related
import CustomAuthComponent from '../components/CustomAuthComponent';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useAuth } from '../components/AuthContext';
import outputs from "../../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';
import PublicIcon from '@mui/icons-material/Public';
import ThemeSwitch from '@/components/ThemeSwitch';

Amplify.configure(outputs);

function isPublicRoute(pathname) {
  return pathname.startsWith('/public');
}

function useTituloDinamico() {
  const pathname = usePathname();
  return pageTitles[pathname] || 'MyBase'; // Retorna o título com base na rota
}

// Componente para a barra de navegação pública
function PublicAppBar({ darkMode, toggleTheme }) {
  const router = useRouter();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main }}>
        <Toolbar>
          <IconButton onClick={() => router.push('/')}>
            <LogoIrraBlack sx={{ fontSize: 35 }} />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            color={darkMode ? darkTheme.palette.primary.contrastText : lightTheme.palette.primary.contrastText}
          >
            MyBase
          </Typography>
          <ThemeSwitch darkMode={darkMode} toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// Componente para a barra de navegação autenticada
function AuthenticatedAppBar({ darkMode, toggleTheme }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userNickname, setUserNickname] = useState('Usuário');
  const [profissionaisOpen, setProfissionaisOpen] = useState(false);
  const [documentosOpen, setDocumentosOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const getUserAttributes = async () => {
      try {
        const attributes = await fetchUserAttributes();
        if (attributes.nickname) {
          setUserNickname(attributes.nickname);
        }
      } catch (error) {
        console.error('Erro ao buscar atributos do usuário:', error);
      }
    };

    if (user) {
      getUserAttributes();
    }
  }, [user]);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    router.push('/');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUserNickname('Usuário'); // Resetar o nickname ao fazer logout
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProfissionaisClick = () => {
    setProfissionaisOpen(!profissionaisOpen);
  };

  const handleDocumentosClick = () => {
    setDocumentosOpen(!documentosOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="Menu"
            title='Menu'
            sx={{ mr: 2, paddingTop: 2, color: darkMode ? darkTheme.palette.primary.contrastText : lightTheme.palette.primary.contrastText, '&:hover': { color: '#ffffff' } }}
            onClick={toggleDrawer(true)}
            disableRipple
          >
            {/* <MenuIcon /> */}
            <AnimatedIconButton
              darkMode={darkMode}
              onClick={toggleDrawer(true)}
            />
          </IconButton>
          <IconButton onClick={handleHomeClick}>
            <LogoIrraBlack sx={{ fontSize: 40 }} />
          </IconButton>
          <Typography
            variant="h4"
            component="a"
            onClick={handleHomeClick}
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
            color={darkMode ? darkTheme.palette.primary.contrastText : lightTheme.palette.primary.contrastText}
          >
            MyBase
          </Typography>

          <ThemeSwitch darkMode={darkMode} toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? darkTheme.palette.background.paper : lightTheme.palette.background.paper,
            color: darkMode ? darkTheme.palette.text.primary : lightTheme.palette.text.primary,
          }
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={(event) => {
            // Prevent drawer from closing when clicking on expandable items
            if (event.target.closest('.nested-list-item')) {
              event.stopPropagation();
            } else {
              toggleDrawer(false)();
            }
          }}
        >
          {/* User Profile Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 1
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 40, color: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main }} />
            <Typography variant="h6">
              {userNickname}
            </Typography>
          </Box>

          <List>
            <Divider component="div" role="presentation">
              <Typography variant="h6">Menu</Typography>
            </Divider>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/"
                sx={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  '&:hover': {
                    backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                  },
                  ...(pathname === '/' && {
                    borderRight: 5,
                    borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    color: darkMode ? darkTheme.palette.text.primary : lightTheme.palette.text.primary,
                  }),
                }}
              >
                <ListItemIcon>
                  <HomeIcon color={pathname === '/' ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            {/* Documentos */}
            <ListItem disablePadding className="nested-list-item">
              <ListItemButton
                onClick={handleDocumentosClick}
                sx={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  '&:hover': {
                    backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                  },
                  ...(pathname.startsWith('/documentos') && {
                    borderRight: 5,
                    borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    color: darkMode ? darkTheme.palette.text.primary : lightTheme.palette.text.primary,
                  }),
                }}
              >
                <ListItemIcon>
                  <FolderIcon color={pathname.startsWith('/documentos') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Documentos" />
                {documentosOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={documentosOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  href="/documentos/politica-privacidade"
                  sx={{
                    pl: 4,
                    marginLeft: "5px",
                    marginRight: "5px",
                    '&:hover': {
                      backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                    },
                    ...(pathname === '/documentos/politica-privacidade' && {
                      borderRight: 5,
                      borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    }),
                  }}
                >
                  <ListItemIcon>
                    <TextSnippetIcon color={pathname === '/documentos/politica-privacidade' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Política de Privacidade" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Gestão de Profissionais */}
            <ListItem disablePadding className="nested-list-item">
              <ListItemButton
                onClick={handleProfissionaisClick}
                sx={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  '&:hover': {
                    backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                  },
                  ...(pathname.startsWith('/profissionais') && {
                    borderRight: 5,
                    borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    color: darkMode ? darkTheme.palette.text.primary : lightTheme.palette.text.primary,
                  }),
                }}
              >
                <ListItemIcon>
                  <PeopleIcon color={pathname.startsWith('/profissionais') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Gestão de Profissionais" />
                {profissionaisOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>

            <Collapse in={profissionaisOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  component={Link}
                  href="/profissionais/cadastro"
                  sx={{
                    pl: 4,
                    marginLeft: "5px",
                    marginRight: "5px",
                    '&:hover': {
                      backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                    },
                    ...(pathname === '/profissionais/cadastro' && {
                      borderRight: 5,
                      borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    }),
                  }}
                >
                  <ListItemIcon>
                    <PersonAddIcon color={pathname === '/profissionais/cadastro' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Cadastro" />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  href="/profissionais/consulta"
                  sx={{
                    pl: 4,
                    marginLeft: "5px",
                    marginRight: "5px",
                    '&:hover': {
                      backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                    },
                    ...(pathname === '/profissionais/consulta' && {
                      borderRight: 5,
                      borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                    }),
                  }}
                >
                  <ListItemIcon>
                    <SearchIcon color={pathname === '/profissionais/consulta' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Consulta" />
                </ListItemButton>
              </List>
            </Collapse>

            {/* Páginas Públicas */}
            <ListItemButton
              component={Link}
              href="/public"
              sx={{
                marginLeft: "5px",
                marginRight: "5px",
                '&:hover': {
                  backgroundColor: darkMode ? darkTheme.palette.background.default : lightTheme.palette.background.default,
                },
                ...(pathname === '/public' && {
                  borderRight: 5,
                  borderColor: darkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main,
                }),
              }}
            >
              <ListItemIcon>
                <PublicIcon color={pathname === '/public' ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary="Páginas Públicas" />
            </ListItemButton>

          </List>
          <Divider></Divider>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
            gap: 1,
          }}
          >
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
              sx={{
                mt: 1,
                color: 'inherit',
                borderColor: 'inherit',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}

// AppBar global com Drawer e Switch para alternar entre temas
function ButtonAppBar({ darkMode, toggleTheme, isPublic }) {
  if (isPublic) {
    return <PublicAppBar darkMode={darkMode} toggleTheme={toggleTheme} />;
  }
  return <AuthenticatedAppBar darkMode={darkMode} toggleTheme={toggleTheme} />;
}

// Layout principal do app com alternância de tema
export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const pathname = usePathname();
  const isPublic = isPublicRoute(pathname);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark' || savedTheme === null);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const tituloPagina = useTituloDinamico();

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="F1ztPexNeRgfupAjU5wDGXm1UdG_Utuy1VIT04z865o" />
        <link rel="icon" href="/favicon.ico" />
        <title>{tituloPagina}</title>
      </head>
      <body>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <CssBaseline />
          {isPublic ? (
            <>
              <ButtonAppBar darkMode={darkMode} toggleTheme={toggleTheme} isPublic={true} />
              <Box component="main" sx={{ padding: 2, marginTop: 5 }}>
                {children}
              </Box>
            </>
          ) : (
            <CustomAuthComponent>
              <ButtonAppBar darkMode={darkMode} toggleTheme={toggleTheme} isPublic={false} />
              <Box component="main" sx={{ padding: 2, marginTop: 5 }}>
                {children}
              </Box>
            </CustomAuthComponent>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}