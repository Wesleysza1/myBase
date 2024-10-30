import React, { useState, useEffect } from 'react';
import {
  Drawer, Box, TextField, Button, Typography,
  IconButton, Autocomplete, Chip, CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import profissoes from './Profissoes';
import { paisesLista, getCidadesByPais } from './Paises';
import { generateClient } from 'aws-amplify/data';

export default function EditDrawer({ open, onClose, profissional, onSave }) {
  const [formData, setFormData] = useState({
    id: '',  // Adicionando id ao estado inicial
    nome: '',
    profissao: [],
    telefone: '',
    email: '',
    pais: '',
    cidade: '',
    linkedin: '',
    portfolio: '',
  });
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const client = generateClient();

  useEffect(() => {
    if (profissional) {
      // Garantindo que o ID seja incluído no formData
      setFormData({
        id: profissional.id,  // Importante: incluir o ID
        nome: profissional.nome || '',
        profissao: Array.isArray(profissional.profissao) ? profissional.profissao : [],
        telefone: profissional.telefone || '',
        email: profissional.email || '',
        cidade: profissional.cidade || '',
        pais: profissional.pais || '',
        linkedin: profissional.linkedin || '',
        portfolio: profissional.portfolio || '',
      });

      if (profissional.pais) {
        setCidadesDisponiveis(getCidadesByPais(profissional.pais));
      }
    }
  }, [profissional]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfissaoChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      profissao: newValue
    }));
  };

  const handlePaisChange = (event, newValue) => {
    const newCidades = getCidadesByPais(newValue);
    setCidadesDisponiveis(newCidades);

    setFormData(prev => ({
      ...prev,
      pais: newValue,
      cidade: '',
    }));
  };

  const handleCidadeChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      cidade: newValue
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!formData.id) {
        throw new Error('ID do profissional não fornecido');
      }

      // Garantindo que todos os campos sejam strings ou arrays
      const updateData = {
        id: formData.id,
        nome: formData.nome || '',
        profissao: Array.isArray(formData.profissao) ? formData.profissao : [],
        telefone: formData.telefone || '',
        email: formData.email || '',
        cidade: formData.cidade || '',
        pais: formData.pais || '',
        linkedin: formData.linkedin || '',
        portfolio: formData.portfolio || ''
      };

      // Removendo campos vazios, exceto ID e profissao
      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && key !== 'profissao' && !updateData[key]) {
          delete updateData[key];
        }
      });

      console.log('Dados para atualização:', updateData);

      const response = await client.models.Profissional.update(updateData);

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      onSave(response);
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 400, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Editar Profissional</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="nome"
            label="Nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
          />

          <Autocomplete
            multiple
            options={profissoes}
            value={formData.profissao}
            onChange={handleProfissaoChange}
            renderInput={(params) => (
              <TextField {...params} label="Profissão" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
          />

          <TextField
            name="telefone"
            label="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="email"
            label="Email"
            value={formData.email}
            disabled
            fullWidth
          />

          <Autocomplete
            options={paisesLista}
            value={formData.pais}
            onChange={handlePaisChange}
            renderInput={(params) => (
              <TextField {...params} label="País" />
            )}
          />

          <Autocomplete
            options={cidadesDisponiveis}
            value={formData.cidade}
            onChange={handleCidadeChange}
            disabled={!formData.pais}
            renderInput={(params) => (
              <TextField {...params} label="Cidade" />
            )}
          />

          <TextField
            name="linkedin"
            label="LinkedIn"
            value={formData.linkedin}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            name="portfolio"
            label="Portfólio"
            value={formData.portfolio}
            onChange={handleChange}
            fullWidth
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Salvar'
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}