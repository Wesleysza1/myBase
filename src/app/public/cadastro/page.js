// src\app\public\cadastro\page.js
'use client';
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import paises from '../../../components/Paises';
import profissoes from '../../../components/Profissoes';
import {
  TextField, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup,
  Container, Grid, Typography, InputLabel, MenuItem, Select, OutlinedInput,
  ListItemText, Box, Paper, Link, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Script from 'next/script';

/** 
 * @type {import('aws-amplify/data').Client<import('../../../../amplify/data/resource').Schema>} 
 */
const client = generateClient();

export default function CadastroProfissionais() {
  // Estado para garantir que o componente só seja renderizado no cliente
  const [isClient, setIsClient] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const theme = useTheme();

  const normalizeString = (str) => {
    return str
      .normalize('NFD') // Decompõe os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais, mantendo apenas letras e números
  };

  // Função para carregar o reCAPTCHA
  const handleRecaptchaLoad = () => {
    setRecaptchaLoaded(true);
  };

  // Função para executar o reCAPTCHA
  const executeRecaptcha = async () => {
    try {
      const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, {
        action: 'submit'
      });

      const verifyResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const verifyData = await verifyResponse.json();
      return verifyData.success;
    } catch (error) {
      console.error('Erro ao verificar reCAPTCHA:', error);
      return false;
    }
  };

  // Garante que o componente é renderizado apenas no lado do cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    profissao: [],
    linkedin: '',
    portfolio: '',
    cnpjMei: '',
    pais: '',
    cidade: '',
    curriculo: null,
  });

  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [erros, setErros] = useState({
    nome: false,
    telefone: false,
    email: false,
    portfolio: false,
    profissao: false,
    curriculoInvalido: false,
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (allowedTypes.includes(file.type)) {
        // Normaliza o nome do arquivo antes de criar o novo arquivo
        const fileExtension = file.name.split('.').pop();
        const normalizedFileName = `${normalizeString(formData.nome)}.${fileExtension}`;

        // Cria um novo arquivo com o nome normalizado
        const normalizedFile = new File(
          [file],
          normalizedFileName,
          { type: file.type }
        );

        setFormData(prev => ({ ...prev, curriculo: normalizedFile }));
        setSelectedFileName(normalizedFile.name);
        setErros(prev => ({ ...prev, curriculoInvalido: false }));
      } else {
        setErros(prev => ({ ...prev, curriculoInvalido: true }));
        setFormData(prev => ({ ...prev, curriculo: null }));
        setSelectedFileName('');
      }
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove tudo que não for número ou '+'
    const cleaned = value.replace(/[^\d+]/g, '');

    // Se começar com '+' ou '00', considera como número internacional
    if (cleaned.startsWith('+') || cleaned.startsWith('00')) {
      // Para números internacionais, mantemos apenas uma formatação básica
      // Removemos '00' se existir e substituímos por '+'
      let formatted = cleaned.startsWith('00')
        ? '+' + cleaned.slice(2)
        : cleaned;

      // Limita o tamanho total do número
      return formatted.slice(0, 16);
    } else {
      // Formato brasileiro
      const numbers = cleaned.replace(/\D/g, '');
      if (numbers.length <= 11) {
        let formatted = numbers;
        if (numbers.length > 2) {
          formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }
        if (numbers.length > 7) {
          formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
        return formatted;
      }
    }
    return value;
  };

  const isValidPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Verifica se é um número internacional
    if (cleaned.startsWith('+') || cleaned.startsWith('00')) {
      // Remove o '+' ou '00' do início e verifica se tem pelo menos 7 dígitos
      const digits = cleaned.replace(/^\+|^00/, '');
      return digits.length >= 7 && digits.length <= 15;
    } else {
      // Validação para números brasileiros
      const numbers = cleaned.replace(/\D/g, '');
      return numbers.length >= 10 && numbers.length <= 11;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'telefone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));

      // Atualiza o erro do telefone
      setErros(prev => ({
        ...prev,
        telefone: value.length > 0 && !isValidPhoneNumber(formattedPhone)
      }));
    } else if (name === 'curriculo' && files) {
      // ... resto do código para currículo permanece igual
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePaisChange = (event) => {
    const paisSelecionado = event.target.value;
    setFormData({ ...formData, pais: paisSelecionado, cidade: '' });
    setCidadesDisponiveis(paises[paisSelecionado] || []);
  };

  const handleProfissaoChange = (event) => {
    const { target: { value } } = event;
    setFormData({
      ...formData,
      profissao: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const validarFormulario = () => {
    const novosErros = {
      nome: formData.nome === '',
      telefone: formData.telefone === '',
      email: formData.email === '',
      portfolio: formData.portfolio === '',
      profissao: formData.profissao.length === 0,
    };
    setErros({ ...erros, ...novosErros });
    return !Object.values(novosErros).includes(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      try {
        setUploading(true);

        const recaptchaSuccess = await executeRecaptcha();
        if (!recaptchaSuccess) {
          setStatusMessage('Falha na verificação de segurança. Por favor, tente novamente.');
          setAlertType('error');
          setAlertOpen(true);
          setUploading(false);
          return;
        }

        let curriculoUrl = '';

        // Upload do currículo se existir
        if (formData.curriculo) {
          console.log('Iniciando upload do currículo:', formData.curriculo.name);
          const timestamp = Date.now();
          const normalizedFileName = normalizeString(formData.curriculo.name);
          const fileName = `curriculos/${timestamp}-${normalizedFileName}`;

          try {
            const result = await uploadData({
              key: fileName,
              data: formData.curriculo,
              options: {
                contentType: formData.curriculo.type,
                metadata: {
                  nome: normalizeString(formData.nome),
                  email: formData.email
                }
              }
            });
            console.log('Upload concluído:', result);
            curriculoUrl = fileName;
          } catch (error) {
            console.error('Erro ao fazer upload do currículo:', error);
            setStatusMessage('Erro ao fazer upload do currículo. Tente novamente.');
            setAlertType('error');
            setAlertOpen(true);
            setUploading(false);
            return;
          }
        }

        // Prepare os dados conforme o schema
        const profissionalData = {
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          profissao: formData.profissao,
          linkedin: formData.linkedin || '',
          portfolio: formData.portfolio,
          cnpjMei: formData.cnpjMei || 'Não',
          pais: formData.pais,
          cidade: formData.cidade,
          curriculoUrl: curriculoUrl // Adiciona a URL do currículo
        };

        console.log('Dados do profissional a serem salvos:', profissionalData);

        // Use o cliente do Amplify para criar o registro
        const { data: newProfissional, errors } = await client.models.Profissional.create(profissionalData);

        if (errors) {
          throw new Error(errors.join(', '));
        }

        setStatusMessage('Profissional cadastrado com sucesso!');
        setAlertType('success');

        // Limpe o formulário
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          profissao: [],
          linkedin: '',
          portfolio: '',
          cnpjMei: '',
          pais: '',
          cidade: '',
          curriculo: null,
        });
        setSelectedFileName('');
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        setStatusMessage('Erro ao cadastrar profissional. Tente novamente.');
        setAlertType('error');
      } finally {
        setUploading(false);
        setAlertOpen(true);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (!isClient) {
    return null; // Não renderiza nada até o componente estar no cliente
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        onLoad={handleRecaptchaLoad}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Sobre Nós
          </Typography>
          <Typography paragraph sx={{ color: theme.palette.text.primary }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography paragraph sx={{ color: theme.palette.text.primary }}>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: theme.palette.primary.white, textAlign: 'center', fontFamily: '"Audiowide", "system-ui"' }}>
              Seja Nosso Freela!!
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                color='theme.palette.primary.black'
                error={erros.nome}
                helperText={erros.nome ? 'Preenchimento obrigatório' : ''}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.primary.black
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                placeholder="(99) 99999-9999 ou +1234567890"
                color='theme.palette.primary.black'
                error={erros.telefone}
                helperText={erros.telefone ? 'Número de telefone inválido' : ''}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.primary.black
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                color='theme.palette.primary.black'
                error={erros.email}
                helperText={erros.email ? 'Preenchimento obrigatório' : ''}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.primary.black
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  },
                }}
              />

              <FormControl fullWidth margin="normal" required error={erros.profissao}>
                <InputLabel sx={{ color: theme.palette.primary.black }}>Profissão</InputLabel>
                <Select
                  multiple
                  value={formData.profissao}
                  onChange={handleProfissaoChange}
                  input={<OutlinedInput label="Profissão" />}
                  renderValue={(selected) => selected.join(', ')}
                  color='theme.palette.primary.black'
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.primary.black, // Background preto dentro da caixa de seleção
                        color: theme.pal, // Texto branco dentro da caixa
                      },
                    },
                  }}
                >
                  {profissoes.map((profissao) => (
                    <MenuItem key={profissao} value={profissao} sx={{ color: theme.palette.primary.white }}>
                      <Checkbox checked={formData.profissao.indexOf(profissao) > -1} />
                      <ListItemText primary={profissao} />
                    </MenuItem>
                  ))}
                </Select>
                {erros.profissao && <Typography color="error">Preenchimento obrigatório</Typography>}
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: theme.palette.primary.black }}>País</InputLabel>
                <Select
                  value={formData.pais}
                  onChange={handlePaisChange}
                  label="País"
                  input={<OutlinedInput label="País" />}
                  color='theme.palette.primary.black'
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.primary.black, // Background preto dentro da caixa de seleção
                        color: theme.pal, // Texto branco dentro da caixa
                      },
                    },
                  }}
                >
                  {Object.keys(paises).map((pais) => (
                    <MenuItem key={pais} value={pais} sx={{ color: theme.palette.primary.white }}>
                      {pais}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: theme.palette.primary.black }}>Cidade</InputLabel>
                <Select
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  label="Cidade"
                  input={<OutlinedInput label="Cidade" />}
                  disabled={!formData.pais}
                  color='theme.palette.primary.black'
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.black
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.primary.black, // Background preto dentro da caixa de seleção
                        color: theme.pal, // Texto branco dentro da caixa
                      },
                    },
                  }}
                >
                  {cidadesDisponiveis.map((cidade) => (
                    <MenuItem key={cidade} value={cidade} sx={{ color: theme.palette.primary.white }}>
                      {cidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Link do Portfólio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                color='theme.palette.primary.black'
                error={erros.portfolio}
                helperText={erros.portfolio ? 'Preenchimento obrigatório' : ''}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.primary.black
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                color='theme.palette.primary.black'
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.black
                  }
                }}
                InputLabelProps={{
                  sx: {
                    color: theme.palette.primary.black
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta ao passar o mouse
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.black, // Borda preta quando focada
                    },
                  },
                }}
              />

              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body1" sx={{ mr: 1, color: theme.palette.primary.black }}>
                  Possui CNPJ ou MEI?
                </Typography>
                <RadioGroup
                  row
                  name="cnpjMei"
                  value={formData.cnpjMei}
                  onChange={handleChange}
                >
                  <FormControlLabel style={{ color: theme.palette.primary.black }} value="Sim" control={<Radio sx={{ color: theme.palette.primary.black, '&.Mui-checked': { color: theme.palette.primary.black } }} />} label="Sim" />
                  <FormControlLabel style={{ color: theme.palette.primary.black }} value="Não" control={<Radio sx={{ color: theme.palette.primary.black, '&.Mui-checked': { color: theme.palette.primary.black } }} />} label="Não" />
                </RadioGroup>
              </Box>

              <Box mt={2}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                    color: theme.palette.primary.black,
                    borderColor: theme.palette.primary.black,
                    '&:hover': {
                      color: theme.palette.primary.white
                    }
                  }}
                >
                  {selectedFileName || 'Anexar Currículo (opcional)'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                </Button>
                {erros.curriculoInvalido && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Formato de arquivo inválido. Deve ser PDF.
                  </Typography>
                )}
              </Box>

              <Box mt={2}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.white,
                    color: theme.palette.primary.black,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.white
                    }
                  }}
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Cadastrando...
                    </Box>
                  ) : (
                    'Cadastrar'
                  )}
                </Button>
              </Box>

              <Typography variant="body2" align="center" sx={{ color: theme.palette.primary.white, mt: 2 }}>
                Ao fornecer seus dados pessoais, você concorda com nossa{' '}
                <Link href="/public/politica-privacidade" target="_blank" sx={{ color: theme.palette.primary.black }}>
                  Política de Privacidade
                </Link>.
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertType}
          sx={{
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color: theme.palette.mode === 'light'
                ? alertType === 'success'
                  ? theme.palette.success.main
                  : theme.palette.error.main
                : alertType === 'success'
                  ? theme.palette.success.light
                  : theme.palette.error.light
            },
            border: `1px solid ${alertType === 'success'
              ? theme.palette.success.main
              : theme.palette.error.main
              }`
          }}
        >
          {statusMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}