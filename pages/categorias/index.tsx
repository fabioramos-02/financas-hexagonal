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
  Avatar,
  Tooltip,
  Fade,
  Zoom,
  Snackbar,
  Slide
} from '@mui/material';
import { Add, Edit, Delete, Palette, Category, CheckCircle } from '@mui/icons-material';
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
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

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
      setFeedback({
        open: true,
        message: 'Nome da categoria é obrigatório',
        severity: 'warning'
      });
      return;
    }

    if (!icone) {
      setError('Ícone da categoria é obrigatório');
      setFeedback({
        open: true,
        message: 'Ícone da categoria é obrigatório',
        severity: 'warning'
      });
      return;
    }

    try {
      setSalvando(true);
      setError('');
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
        setFeedback({
          open: true,
          message: `Categoria "${nome}" ${editingTag ? 'atualizada' : 'criada'} com sucesso!`,
          severity: 'success'
        });
      } else {
        const errorMessage = data.erro || 'Erro ao salvar categoria';
        setError(errorMessage);
        setFeedback({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      // Erro ao salvar tag
      const errorMessage = 'Erro ao conectar com o servidor';
      setError(errorMessage);
      setFeedback({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setSalvando(false);
    }
  };

  const excluirTag = async (tagId: string, tagNome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${tagNome}"?`)) {
      return;
    }

    try {
      setExcluindo(tagId);
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await carregarTags();
        setFeedback({
          open: true,
          message: `Categoria "${tagNome}" excluída com sucesso!`,
          severity: 'success'
        });
      } else {
        const data = await response.json();
        const errorMessage = data.erro || 'Erro ao excluir categoria';
        setError(errorMessage);
        setFeedback({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      // Erro ao excluir tag
      const errorMessage = 'Erro ao conectar com o servidor';
      setError(errorMessage);
      setFeedback({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setExcluindo(null);
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
            <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
              <Zoom in={true} timeout={300}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: tag.cor,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2.5}>
                      <Avatar
                        sx={{ 
                          width: 56,
                          height: 56,
                          backgroundColor: tag.cor + '15',
                          color: tag.cor,
                          mr: 2,
                          fontSize: '1.5rem'
                        }}
                      >
                        {getIconByName(tag.icone || 'Category')}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            color: 'text.primary'
                          }}
                          noWrap
                        >
                          {tag.nome}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(tag.criadaEm).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Chip
                        size="small"
                        label={tag.cor.toUpperCase()}
                        sx={{ 
                          backgroundColor: tag.cor + '20',
                          color: tag.cor,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: `1px solid ${tag.cor}30`
                        }}
                      />
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="Editar categoria" arrow>
                          <IconButton 
                            onClick={() => abrirModal(tag)} 
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'primary.dark'
                              }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir categoria" arrow>
                          <IconButton 
                            onClick={() => excluirTag(tag.id, tag.nome)} 
                            disabled={excluindo === tag.id}
                            size="small" 
                            sx={{ 
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'error.light',
                                color: 'error.dark'
                              }
                            }}
                          >
                            {excluindo === tag.id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <Delete fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de Cadastro/Edição */}
      <Dialog 
        open={modalOpen} 
        onClose={fecharModal} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: editingTag ? 'primary.main' : 'success.main',
              width: 32,
              height: 32
            }}
          >
            {editingTag ? <Edit /> : <Add />}
          </Avatar>
          <Typography variant="h6" component="div">
            {editingTag ? 'Editar Categoria' : 'Nova Categoria'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ minHeight: 500 }}>
            {/* Seção de Configuração */}
            <Grid item xs={12} md={7} sx={{ p: 3, borderRight: { md: '1px solid', borderColor: 'divider' } }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category color="primary" />
                Informações da Categoria
              </Typography>
              
              <TextField
                fullWidth
                label="Nome da Categoria"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                sx={{ mb: 4 }}
                autoFocus
                required
                error={!nome.trim() && nome !== ''}
                helperText={!nome.trim() && nome !== '' ? 'Nome é obrigatório' : ''}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette color="primary" />
                  Escolha uma Cor
                </Typography>
                
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={1.5}>
                    {coresPredefinidas.map((corOption) => (
                      <Grid item key={corOption}>
                        <Tooltip title={corOption} arrow>
                          <IconButton
                            onClick={() => setCor(corOption)}
                            sx={{
                              bgcolor: corOption,
                              width: 48,
                              height: 48,
                              border: cor === corOption ? '3px solid' : '2px solid',
                              borderColor: cor === corOption ? 'primary.main' : 'transparent',
                              boxShadow: cor === corOption ? 2 : 1,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: corOption,
                                transform: 'scale(1.1)',
                                boxShadow: 3,
                              },
                            }}
                          >
                            {cor === corOption && <CheckCircle sx={{ color: 'white', fontSize: 24 }} />}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Box>
              
              <Box>
                <IconSelector
                  selectedIcon={icone}
                  onIconSelect={setIcone}
                />
              </Box>
            </Grid>
            
            {/* Seção de Pré-visualização */}
            <Grid item xs={12} md={5} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category color="primary" />
                Pré-visualização
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Como aparecerá na listagem:
                </Typography>
                
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      backgroundColor: cor,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2.5}>
                      <Avatar
                        sx={{ 
                          width: 56,
                          height: 56,
                          backgroundColor: cor + '15',
                          color: cor,
                          mr: 2,
                          fontSize: '1.5rem'
                        }}
                      >
                        {getIconByName(icone)}
                      </Avatar>
                      <Box flexGrow={1}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            color: 'text.primary'
                          }}
                        >
                          {nome || 'Nome da categoria'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date().toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip
                      size="small"
                      label={cor ? cor.toUpperCase() : ''}
                      sx={{ 
                        backgroundColor: cor ? cor + '20' : 'transparent',
                        color: cor || 'inherit',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        border: `1px solid ${cor || 'transparent'}30`
                      }}
                    />
                  </CardContent>
                </Card>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Como aparecerá como chip:
                </Typography>
                
                <Box display="flex" gap={2} flexWrap="wrap">
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
                  
                  <Chip
                    icon={getIconByName(icone)}
                    label={nome || 'Nome da categoria'}
                    variant="outlined"
                    sx={{
                      borderColor: cor,
                      color: cor,
                      '& .MuiChip-icon': {
                        color: cor
                      }
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
          <Button 
            onClick={fecharModal}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={salvarTag}
            variant="contained"
            disabled={salvando || !nome.trim() || !icone}
            startIcon={salvando ? <CircularProgress size={16} /> : (editingTag ? <Edit /> : <Add />)}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {salvando ? 'Salvando...' : (editingTag ? 'Atualizar' : 'Criar Categoria')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
          severity={feedback.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}