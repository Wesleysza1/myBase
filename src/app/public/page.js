"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Button,
    Divider,
    useTheme,
    Snackbar,
    Alert
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PublicIcon from '@mui/icons-material/Public';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const copyToClipboard = (url, setSnackbar) => {
    navigator.clipboard.writeText(url)
        .then(() => {
            setSnackbar({
                open: true,
                message: 'URL copiada para a área de transferência!',
                severity: 'success'
            });
        })
        .catch((error) => {
            setSnackbar({
                open: true,
                message: 'Erro ao copiar a URL!',
                severity: 'error'
            });
            console.error('Erro ao copiar a URL:', error);
        });
};

function NavigationCard({ title, description, href, icon: Icon, setSnackbar }) {
    const theme = useTheme();
    const [fullUrl, setFullUrl] = useState(href);

    useEffect(() => {
        // Atualiza a URL completa apenas quando estiver no cliente
        setFullUrl(`${window.location.origin}${href}`);
    }, [href]);

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
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Button
                    size="small"
                    component={Link}
                    href={href}
                    sx={{ color: theme.palette.primary.dark }}
                >
                    Acessar
                </Button>
                <Button
                    size="small"
                    onClick={() => copyToClipboard(fullUrl, setSnackbar)}
                    startIcon={<ContentCopyIcon />}
                    sx={{ color: theme.palette.primary.dark }}
                >
                    Copiar URL
                </Button>
            </CardActions>
        </Card>
    );
}

export default function Home() {
    const theme = useTheme();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ marginTop: 5 }}>
            <Divider component="div" role="presentation">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PublicIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontFamily: '"Audiowide", "system-ui"' }}>
                        Páginas Públicas
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
                            href="/public/cadastro"
                            setSnackbar={setSnackbar}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <NavigationCard
                            icon={TextSnippetIcon}
                            title="Política de Privacidade"
                            description="Política de privacidade aceita pelos profissionais ao se cadastrar na base de dados."
                            href="/public/politica-privacidade"
                            setSnackbar={setSnackbar}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        backgroundColor: theme.palette.mode === 'light'
                            ? theme.palette.grey[50]
                            : theme.palette.grey[900],
                        color: theme.palette.text.primary,
                        '& .MuiAlert-icon': {
                            color: snackbar.severity === 'success'
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                        },
                        border: `1px solid ${snackbar.severity === 'success'
                            ? theme.palette.success.main
                            : theme.palette.error.main
                        }`,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}