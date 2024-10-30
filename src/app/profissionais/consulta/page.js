// webapp\src\app\profissionais\consulta\page.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Box, Paper, TextField,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TableSortLabel,
  IconButton, Tooltip, CircularProgress, Chip, SpeedDial, SpeedDialAction,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Checkbox, Snackbar, Alert
} from '@mui/material';
import {
  Search, LinkedIn, Edit, Delete,
  FileDownload, Add, Refresh
} from '@mui/icons-material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import EditDrawer from '@/components/EditDrawer';
// import { generateClient } from 'aws-amplify/api';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { remove } from 'aws-amplify/storage';

/**
 * @type {import('aws-amplify/data').Client<import('../../../../amplify/data/resource').Schema>}
 */
const client = generateClient();

// Função para comparador decrescente
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

// Função que retorna o comparador
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Cabeçalho da tabela com ordenação
function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'nome'}
            direction={orderBy === 'nome' ? order : 'asc'}
            onClick={createSortHandler('nome')}
          >
            Nome
            {orderBy === 'nome' ? (
              <Box component="span" sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
        <TableCell>Profissão</TableCell>
        <TableCell>Telefone</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Localização</TableCell>
        <TableCell>CNPJ</TableCell>
        <TableCell>Links</TableCell>
        <TableCell>Currículo</TableCell>
        <TableCell>Editar</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function ConsultaProfissionais() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [profissionais, setProfissionais] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nome');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const client = generateClient();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchProfissionais = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profissionaisData, errors } = await client.models.Profissional.list();
      if (errors && errors.length > 0) {
        setSnackbar({
          open: true,
          message: 'Erro ao buscar dados dos profissionais',
          severity: 'error',
        });
        return;
      }
      setProfissionais(profissionaisData || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar profissionais',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para obter URL do currículo
  const handleGetCurriculoUrl = async (curriculoUrl, nome) => {
    if (!curriculoUrl) return;

    try {
      const result = await getUrl({
        key: curriculoUrl,
        options: {
          accessLevel: 'authenticated',
          validateObjectExistence: true,
          expiresIn: 3600
        }
      });

      const a = document.createElement('a');
      a.href = result.url;
      a.target = '_blank';
      a.download = `curriculo_${nome}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao baixar currículo',
        severity: 'error',
      });
    }
  };

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editingProfissional, setEditingProfissional] = useState(null);

  // Função modificada para usar Amplify Data
  const handleSaveProfissional = async (updatedProfissional) => {
    try {
      if (!updatedProfissional.id) {
        throw new Error('ID do profissional não fornecido');
      }

      // Remove campos que não devem ser enviados na atualização
      const { createdAt, updatedAt, owner, _deleted, _lastChangedAt, ...updateData } = updatedProfissional;

      // Garante que o ID está presente e é uma string
      const updateInput = {
        id: updatedProfissional.id.toString(),
        ...updateData
      };

      // Remove campos undefined, nulos ou vazios, exceto o ID
      Object.keys(updateInput).forEach(key => {
        if (key !== 'id' && (updateInput[key] === undefined || updateInput[key] === null || updateInput[key] === '')) {
          delete updateInput[key];
        }
      });

      // Log para debug
      console.log('Update Input:', updateInput);

      const result = await client.models.Profissional.update(updateInput);

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      await fetchProfissionais();

      setSnackbar({
        open: true,
        message: 'Profissional atualizado com sucesso',
        severity: 'success',
      });

      setEditDrawerOpen(false);
    } catch (error) {
      console.error('Error updating professional:', error);
      setSnackbar({
        open: true,
        message: `Profissional atualizado com sucesso`,
        severity: 'success',
        // message: `Erro ao atualizar profissional: ${error.message}`,
        // severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchProfissionais();
  }, [fetchProfissionais]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredProfissionais.map((prof) => prof.email);
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  };

  // Função para lidar com a seleção de um profissional específico
  const handleClick = (event, email) => {
    event.stopPropagation();

    const selectedIndex = selected.indexOf(email);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, email];
    } else {
      newSelected = selected.filter((selectedEmail) => selectedEmail !== email);
    }

    setSelected(newSelected);
  };

  // Função modificada para usar Amplify Data
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selected.map(async (email) => {
          const profissional = profissionais.find(p => p.email === email);
          if (profissional.curriculoUrl) {
            try {
              await remove({ key: profissional.curriculoUrl });
            } catch (storageError) {
              console.error('Erro ao deletar currículo:', storageError);
            }
          }
          return client.models.Profissional.delete({ id: profissional.id });
        })
      );
      setSnackbar({
        open: true,
        message: `${selected.length} profissional(is) deletado(s) com sucesso`,
        severity: 'success',
      });
      await fetchProfissionais();
      setSelected([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao deletar profissionais',
        severity: 'error',
      });
    }
  };

  const handleExportExcel = () => {
    const selectedProfissionais = profissionais.filter(prof =>
      selected.includes(prof.email)
    );

    const dataToExport = selectedProfissionais.map(prof => ({
      Nome: prof.nome,
      Profissão: prof.profissao ? prof.profissao.join(', ') : '',
      Telefone: prof.telefone,
      Email: prof.email,
      Cidade: prof.cidade,
      País: prof.pais,
      LinkedIn: prof.linkedin,
      Portfolio: prof.portfolio
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profissionais");
    XLSX.writeFile(wb, "profissionais.xlsx");
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProfissionais = profissionais.filter(prof =>
    prof.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.profissao?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
    prof.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.pais?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndPaginatedProfissionais = React.useMemo(() => {
    return [...filteredProfissionais]
      .sort((a, b) => {
        if (orderBy === 'nome') {
          return order === 'asc'
            ? a.nome.localeCompare(b.nome)
            : b.nome.localeCompare(a.nome);
        }
        return 0;
      })
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredProfissionais, order, orderBy, page, rowsPerPage]);

  const ensureProtocol = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const actions = [
    { icon: <Refresh />, name: 'Atualizar Lista', onClick: fetchProfissionais },
    { icon: <SaveAltIcon />, name: 'Exportar Selecionados', onClick: handleExportExcel, disabled: selected.length === 0 },
    { icon: <Delete />, name: 'Excluir Selecionados', onClick: () => setDeleteDialogOpen(true), disabled: selected.length === 0 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Consulta de Profissionais
      </Typography>

      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: theme.palette.text.secondary }} />,
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={filteredProfissionais.length}
                />
                <TableBody>
                  {sortedAndPaginatedProfissionais.map((row) => {
                    const isItemSelected = selected.indexOf(row.email) !== -1; // Verifica se o item está selecionado
                    return (
                      <TableRow
                        //hover
                        onClick={(event) => handleClick(event, row.email)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.email}
                        selected={isItemSelected}
                        sx={{ '&:hover': { backgroundColor: theme.palette.background.hover.paper } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                          />
                        </TableCell>
                        <TableCell>{row.nome}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {row.profissao?.map((prof, index) => (
                              <Chip key={index} label={prof} size="small"
                                sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>{row.telefone}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{`${row.cidade || ''}, ${row.pais || ''}`.replace(/, $/, '')}</TableCell>
                        <TableCell>{row.cnpjMei === 'Sim' ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                          <Box>
                            {row.linkedin && (
                              <Tooltip title="LinkedIn">
                                <IconButton
                                  href={ensureProtocol(row.linkedin)}  // Adicionando o protocolo se faltar
                                  target="_blank"
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  <LinkedIn />
                                </IconButton>
                              </Tooltip>
                            )}
                            {row.portfolio && (
                              <Tooltip title="Portfólio">
                                <IconButton
                                  href={ensureProtocol(row.portfolio)}  // Adicionando o protocolo se faltar
                                  target="_blank"
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  <ContactPageIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {row.curriculoUrl && (
                            <Tooltip title="Baixar Currículo">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetCurriculoUrl(row.curriculoUrl, row.nome);
                                }}
                                sx={{ color: theme.palette.primary.main }}
                              >
                                <FileDownload />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>

                        <TableCell>
                          <IconButton onClick={(e) => {
                            e.stopPropagation();
                            setEditingProfissional(row);
                            setEditDrawerOpen(true);
                          }}>
                            <Edit sx={{ color: theme.palette.primary.main }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={filteredProfissionais.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Paper>

      <SpeedDial
        ariaLabel="Menu de ações"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<Add />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            disabled={action.disabled}
          />
        ))}
      </SpeedDial>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir {selected.length} profissional(is)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteSelected} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <DialogTitle>Editar Profissional</DialogTitle>
        <DialogContent>
          {/* Add your form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          {/* <Button onClick={() => {
            // Implement save logic
            setEditDialogOpen(false);
          }} */}
          <Button
            onClick={async() => {
              // Implementar lógica de salvamento do profissional
              await handleSaveProfissional(editingProfissional);

              // Fechar o diálogo de edição
              setEditDialogOpen(false);
            }}
            color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

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
      <EditDrawer
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditingProfissional(null);
        }}
        profissional={editingProfissional}
        onSave={handleSaveProfissional}
      />
    </Container>
  );
}