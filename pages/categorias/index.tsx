import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  CardActions,
  Divider,
} from '@mui/material';
import { Add, Edit, Delete, Palette, Category } from '@mui/icons-material';
import IconSelector, { getIconByName } from '../../src/ui/components/IconSelector';

interface Tag {
  id: string;
  nome: string;
  cor: string;
  icone?: string;
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
  const [cor, setCor] = useState(coresPredefinidas[0]);
  const [icone, setIcone] = useState('Category');
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
      // Erro ao carregar tags
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setNome(tag.nome);
      setCor(tag.cor);
      setIcone(tag.icone || 'Category');
    } else {
      setEditingTag(null);
      setNome('');
      setCor(coresPredefinidas[0]);
      setIcone('Category');
    }
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setEditingTag(null);
    setNome('');
    setCor(coresPredefinidas[0]);
    setIcone('Category');
  };

  const salvarTag = async () => {
    if (!nome.trim()) {
      setError('Nome da categoria é obrigatório');
      return;
    }

    try {
      setSalvando(true);
      const payload = {
        nome: nome.trim(),
        cor: cor,
        icone: icone,
      };

      let response;
      if (editingTag) {
        response = await fetch(`/api/tags/${editingTag.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        await carregarTags();
        fecharModal();
        setError('');
      } else {
        setError(data.erro || 'Erro ao salvar categoria');
      }
    } catch (error) {
      // Erro ao salvar tag
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
      // Erro ao excluir tag
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
        <Grid container spacing={3}>
          {tags.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box 
                      sx={{ 
                        mr: 2, 
                        p: 1, 
                        borderRadius: 1, 
                        backgroundColor: tag.cor + '20',
                        color: tag.cor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getIconByName(tag.icone || 'Category')}
                    </Box>
                    <Box flexGrow={1}>
                      <Typography variant="h6" component="h3" noWrap>
                        {tag.nome}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Chip
                      size="small"
                      label="Cor"
                      sx={{ 
                        backgroundColor: tag.cor, 
                        color: 'white',
                        minWidth: 60
                      }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Criada em: {new Date(tag.criadaEm).toLocaleDateString('pt-BR')}
                  </Typography>
                </CardContent>
                
                <Divider />
                
                <CardActions sx={{ justifyContent: 'flex-end', p: 1 }}>
                  <IconButton 
                    onClick={() => abrirModal(tag)} 
                    size="small"
                    sx={{ color: 'primary.main' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => excluirTag(tag.id)} 
                    size="small" 
                    sx={{ color: 'error.main' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de Cadastro/Edição */}
      <Dialog open={modalOpen} onClose={fecharModal} maxWidth="md" fullWidth>
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
            
            <Box sx={{ mb: 3 }}>
              <IconSelector
                selectedIcon={icone}
                onIconSelect={setIcone}
              />
            </Box>
            
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Escolha uma cor:
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 3 }}>
              {coresPredefinidas.map((corOption) => (
                <Grid item key={corOption}>
                  <IconButton
                    onClick={() => setCor(corOption)}
                    sx={{
                      bgcolor: corOption,
                      width: 40,
                      height: 40,
                      border: cor === corOption ? '3px solid #000' : '1px solid #ccc',
                      '&:hover': {
                        bgcolor: corOption,
                        opacity: 0.8,
                      },
                    }}
                  >
                    {cor === corOption && <Palette sx={{ color: 'white', fontSize: 20 }} />}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
            
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Pré-visualização:
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                icon={getIconByName(icone)}
                label={nome || 'Nome da categoria'}
                sx={{
                  bgcolor: cor,
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  backgroundColor: cor + '20',
                  color: cor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getIconByName(icone)}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal}>Cancelar</Button>
          <Button
            onClick={salvarTag}
            variant="contained"
            disabled={salvando || !nome.trim()}
          >
            {salvando ? <CircularProgress size={20} /> : (editingTag ? 'Atualizar' : 'Criar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}