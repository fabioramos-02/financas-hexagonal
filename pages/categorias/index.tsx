import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Palette,
  Category,
} from '@mui/icons-material';

interface Tag {
  id: string;
  nome: string;
  cor: string;
  criadaEm: string;
}

const coresPredefinidas = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
];

export default function Categorias() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [nome, setNome] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(coresPredefinidas[0]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarTags();
  }, []);

  const carregarTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (response.ok) {
        setTags(data.tags || []);
      } else {
        setError(data.erro || 'Erro ao carregar categorias');
      }
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setNome(tag.nome);
      setCorSelecionada(tag.cor);
    } else {
      setEditingTag(null);
      setNome('');
      setCorSelecionada(coresPredefinidas[0]);
    }
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditingTag(null);
    setNome('');
    setCorSelecionada(coresPredefinidas[0]);
  };

  const salvarTag = async () => {
    if (!nome.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    try {
      setSalvando(true);
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          cor: corSelecionada,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await carregarTags();
        fecharModal();
        setError('');
      } else {
        setError(data.erro || 'Erro ao salvar categoria');
      }
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setSalvando(false);
    }
  };

  const excluirTag = async (tagId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarTags();
      } else {
        const data = await response.json();
        setError(data.erro || 'Erro ao excluir categoria');
      }
    } catch (error) {
      console.error('Erro ao excluir tag:', error);
      setError('Erro ao conectar com o servidor');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciar Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => abrirModal()}
        >
          Nova Categoria
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {tags.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Category sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma categoria cadastrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Crie sua primeira categoria para organizar suas transações
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => abrirModal()}
            >
              Criar Primeira Categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {tags.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      label={tag.nome}
                      sx={{
                        bgcolor: tag.cor,
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => abrirModal(tag)}
                        sx={{ mr: 1 }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => excluirTag(tag.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Criada em: {new Date(tag.criadaEm).toLocaleDateString('pt-BR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de Cadastro/Edição */}
      <Dialog open={modalOpen} onClose={fecharModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTag ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              sx={{ mb: 3 }}
              autoFocus
            />
            
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Escolha uma cor:
            </Typography>
            
            <Grid container spacing={1}>
              {coresPredefinidas.map((cor) => (
                <Grid item key={cor}>
                  <IconButton
                    onClick={() => setCorSelecionada(cor)}
                    sx={{
                      bgcolor: cor,
                      width: 40,
                      height: 40,
                      border: corSelecionada === cor ? '3px solid #000' : '1px solid #ccc',
                      '&:hover': {
                        bgcolor: cor,
                        opacity: 0.8,
                      },
                    }}
                  >
                    {corSelecionada === cor && <Palette sx={{ color: 'white', fontSize: 20 }} />}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
            
            {nome && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Pré-visualização:
                </Typography>
                <Chip
                  label={nome}
                  sx={{
                    bgcolor: corSelecionada,
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button
            onClick={salvarTag}
            variant="contained"
            disabled={salvando || !nome.trim()}
          >
            {salvando ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}