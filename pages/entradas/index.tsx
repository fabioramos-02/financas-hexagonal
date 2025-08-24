import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Slide,
  Tooltip,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '../../src/ui/components/Layout';
import { getIconByName } from '../../src/ui/components/IconSelector';

interface Tag {
  id: string;
  nome: string;
  cor: string;
  icone?: string;
}

interface Entrada {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tags: Tag[];
}

interface Feedback {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning';
}

export default function Entradas() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState<Entrada | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ open: false, message: '', severity: 'success' });
  
  // Estados do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [entradasResponse, tagsResponse] = await Promise.all([
        fetch('/api/receitas'),
        fetch('/api/tags')
      ]);

      if (!entradasResponse.ok || !tagsResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const entradasData = await entradasResponse.json();
      const tagsData = await tagsResponse.json();

      setEntradas(entradasData.receitas || []);
      setTags(tagsData.tags || []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados. Tente novamente.');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (entrada?: Entrada) => {
    if (entrada) {
      setEditingEntrada(entrada);
      setDescricao(entrada.descricao);
      setValor(entrada.valor.toString());
      setData(entrada.data.split('T')[0]);
      setSelectedTags(entrada.tags.map(tag => tag.id));
    } else {
      setEditingEntrada(null);
      setDescricao('');
      setValor('');
      setData('');
      setSelectedTags([]);
    }
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditingEntrada(null);
    setDescricao('');
    setValor('');
    setData('');
    setSelectedTags([]);
  };

  const salvarEntrada = async () => {
    if (!descricao.trim()) {
      setFeedback({
        open: true,
        message: 'Descrição é obrigatória',
        severity: 'warning'
      });
      return;
    }

    if (!valor || parseFloat(valor) <= 0) {
      setFeedback({
        open: true,
        message: 'Valor deve ser maior que zero',
        severity: 'warning'
      });
      return;
    }

    if (!data) {
      setFeedback({
        open: true,
        message: 'Data é obrigatória',
        severity: 'warning'
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: descricao.trim(),
          valor: parseFloat(valor),
          data: data,
          tagIds: selectedTags
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao salvar entrada');
      }

      await carregarDados();
      fecharModal();
      setFeedback({
        open: true,
        message: editingEntrada ? 'Entrada atualizada com sucesso!' : 'Entrada criada com sucesso!',
        severity: 'success'
      });
    } catch (err: any) {
      setFeedback({
        open: true,
        message: err.message || 'Erro ao salvar entrada',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const excluirEntrada = async (id: string, descricao: string) => {
    if (!confirm(`Tem certeza que deseja excluir a entrada "${descricao}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/receitas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir entrada');
      }

      await carregarDados();
      setFeedback({
        open: true,
        message: `Entrada "${descricao}" excluída com sucesso!`,
        severity: 'success'
      });
    } catch (err: any) {
      setFeedback({
        open: true,
        message: err.message || 'Erro ao excluir entrada',
        severity: 'error'
      });
    }
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Entradas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gerencie suas receitas e ganhos
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirModal()}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Nova Entrada
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {entradas.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
            <TrendingUp sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma entrada encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comece criando sua primeira entrada de receita
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => abrirModal()}
            >
              Criar Primeira Entrada
            </Button>
          </Paper>
        )}

        {/* Entradas Grid */}
        {entradas.length > 0 && (
          <Grid container spacing={3}>
            {entradas.map((entrada) => (
              <Grid item xs={12} sm={6} lg={4} key={entrada.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      borderColor: 'success.main',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Header do Card */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          fontWeight="bold" 
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            mb: 1
                          }}
                        >
                          {entrada.descricao}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatarData(entrada.data)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <Tooltip title="Editar entrada">
                          <IconButton
                            size="small"
                            onClick={() => abrirModal(entrada)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir entrada">
                          <IconButton
                            size="small"
                            onClick={() => excluirEntrada(entrada.id, entrada.descricao)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Valor */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 2,
                      p: 2,
                      bgcolor: 'success.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'success.200'
                    }}>
                      <AttachMoney sx={{ color: 'success.main' }} />
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        {formatarValor(entrada.valor)}
                      </Typography>
                    </Box>

                    {/* Tags */}
                    {entrada.tags.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Categorias:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {entrada.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.nome}
                              size="small"
                              icon={tag.icone ? getIconByName(tag.icone) : undefined}
                              sx={{
                                backgroundColor: tag.cor + '20',
                                color: tag.cor,
                                border: `1px solid ${tag.cor}40`,
                                '& .MuiChip-icon': {
                                  color: tag.cor,
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal de Criação/Edição */}
        <Dialog
          open={modalOpen}
          onClose={fecharModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {editingEntrada ? 'Editar Entrada' : 'Nova Entrada'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingEntrada ? 'Atualize os dados da entrada' : 'Preencha os dados da nova entrada'}
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  fullWidth
                  required
                  placeholder="Ex: Salário, Freelance, Venda..."
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor"
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                  placeholder="0,00"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categorias</InputLabel>
                  <Select
                    multiple
                    value={selectedTags}
                    onChange={(e) => setSelectedTags(e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tagId) => {
                          const tag = tags.find(t => t.id === tagId);
                          return tag ? (
                            <Chip
                              key={tagId}
                              label={tag.nome}
                              size="small"
                              icon={tag.icone ? getIconByName(tag.icone) : undefined}
                              sx={{
                                backgroundColor: tag.cor + '20',
                                color: tag.cor,
                                '& .MuiChip-icon': {
                                  color: tag.cor,
                                },
                              }}
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {tag.icone && getIconByName(tag.icone)}
                          <Typography>{tag.nome}</Typography>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: tag.cor,
                              ml: 'auto'
                            }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={fecharModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              onClick={salvarEntrada}
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <AddIcon />}
            >
              {submitting ? 'Salvando...' : (editingEntrada ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Feedback Snackbar */}
        <Snackbar
          open={feedback.open}
          autoHideDuration={4000}
          onClose={() => setFeedback({ ...feedback, open: false })}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setFeedback({ ...feedback, open: false })}
            severity={feedback.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {feedback.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
}