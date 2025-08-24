import React, { useState, useEffect } from 'react';
import {
  Container,
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
  TrendingDown,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import CategorySelector from '../../src/ui/components/CategorySelector';

interface Tag {
  id: string;
  nome: string;
  cor: string;
  icone?: string;
}

interface Despesa {
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

export default function Despesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [despesasResponse, tagsResponse] = await Promise.all([
        fetch('/api/despesas'),
        fetch('/api/tags')
      ]);

      if (!despesasResponse.ok || !tagsResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const despesasData = await despesasResponse.json();
      const tagsData = await tagsResponse.json();

      setDespesas(despesasData);
      setTags(tagsData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (despesa?: Despesa) => {
    if (despesa) {
      setDespesaEditando(despesa);
      setDescricao(despesa.descricao);
      setValor(despesa.valor.toString());
      const dataFormatada = despesa.data ? new Date(despesa.data).toISOString().split('T')[0] : '';
       setData(dataFormatada ?? '');
      setTagsSelecionadas(despesa.tags ? despesa.tags.map(tag => tag.id) : []);
    } else {
      setDespesaEditando(null);
      setDescricao('');
      setValor('');
      setData('');
      setTagsSelecionadas([]);
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setDespesaEditando(null);
    setDescricao('');
    setValor('');
    setData('');
    setTagsSelecionadas([]);
  };

  const salvarDespesa = async () => {
    if (!descricao.trim()) {
      setFeedback({
        open: true,
        message: 'Descrição é obrigatória',
        severity: 'error'
      });
      return;
    }

    if (!valor || parseFloat(valor) <= 0) {
      setFeedback({
        open: true,
        message: 'Valor deve ser maior que zero',
        severity: 'error'
      });
      return;
    }

    if (!data) {
      setFeedback({
        open: true,
        message: 'Data é obrigatória',
        severity: 'error'
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/despesas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao,
          valor: parseFloat(valor),
          data,
          tagIds: tagsSelecionadas
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar despesa');
      }

      await carregarDados();
      fecharModal();
      setFeedback({
        open: true,
        message: 'Despesa salva com sucesso!',
        severity: 'success'
      });
    } catch (err: any) {
      setFeedback({
        open: true,
        message: err.message || 'Erro ao salvar despesa',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const excluirDespesa = async (id: string, descricao: string) => {
    if (!confirm(`Tem certeza que deseja excluir a despesa "${descricao}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/despesas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir despesa');
      }

      await carregarDados();
      setFeedback({
        open: true,
        message: `Despesa "${descricao}" excluída com sucesso!`,
        severity: 'success'
      });
    } catch (err: any) {
      setFeedback({
        open: true,
        message: err.message || 'Erro ao excluir despesa',
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Despesas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gerencie suas despesas e categorias
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirModal()}
            size="large"
          >
            Nova Despesa
          </Button>
        </Box>
        <Divider />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {despesas.length === 0 && !loading && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <TrendingDown sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Nenhuma despesa encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comece adicionando sua primeira despesa
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => abrirModal()}
          >
            Adicionar Despesa
          </Button>
        </Paper>
      )}

      {despesas.length > 0 && (
        <Grid container spacing={3}>
          {despesas.map((despesa) => (
            <Grid item xs={12} sm={6} md={4} key={despesa.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {despesa.descricao}
                      </Typography>
                      <Typography variant="h5" color="error.main" fontWeight="bold">
                        {formatarValor(despesa.valor)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => abrirModal(despesa)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          size="small"
                          onClick={() => excluirDespesa(despesa.id, despesa.descricao)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    color: 'text.secondary'
                  }}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="body2">
                      {formatarData(despesa.data)}
                    </Typography>
                  </Box>

                  {despesa.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {despesa.tags.map((tag) => {
                        return (
                          <Chip
                            key={tag.id}
                            label={tag.nome}
                            size="small"
                            sx={{
                              backgroundColor: tag.cor,
                              color: 'white'
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">
            {despesaEditando ? 'Editar Despesa' : 'Nova Despesa'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: <AttachMoney />
              }}
            />
            <TextField
              label="Data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true
              }}
            />
            <CategorySelector
              tags={tags}
              selectedTags={tagsSelecionadas}
              onChange={setTagsSelecionadas}
              label="Categorias"
              placeholder="Selecione as categorias"
              disabled={submitting}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={fecharModal} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={salvarDespesa}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}