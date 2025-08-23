import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Add, Palette } from '@mui/icons-material';
import Link from 'next/link';

interface Tag {
  id: string;
  nome: string;
  cor: string;
}

const coresPredefinidas = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
];

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaTag, setNovaTag] = useState({ nome: '', cor: coresPredefinidas[0] });
  const [salvandoTag, setSalvandoTag] = useState(false);

  useEffect(() => {
    carregarTags();
  }, []);

  const carregarTags = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('Erro ao carregar tags');
      }

      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirDialog = () => {
    setNovaTag({ nome: '', cor: coresPredefinidas[0] });
    setDialogOpen(true);
  };

  const handleFecharDialog = () => {
    setDialogOpen(false);
    setNovaTag({ nome: '', cor: coresPredefinidas[0] });
  };

  const handleSalvarTag = async () => {
    if (!novaTag.nome.trim()) {
      setError('Nome da tag é obrigatório');
      return;
    }

    setSalvandoTag(true);
    setError(null);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: novaTag.nome.trim(),
          cor: novaTag.cor
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.erro || 'Erro ao criar tag');
      }

      setSuccess('Tag criada com sucesso!');
      handleFecharDialog();
      carregarTags();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSalvandoTag(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando tags...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowBack />} sx={{ mr: 2 }}>
            Voltar
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Gerenciar Tags
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Tags Cadastradas ({tags.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAbrirDialog}
            >
              Nova Tag
            </Button>
          </Box>

          {tags.length === 0 ? (
            <Alert severity="info">
              Nenhuma tag cadastrada ainda. Crie sua primeira tag para organizar suas transações!
            </Alert>
          ) : (
            <List>
              {tags.map((tag) => (
                <ListItem key={tag.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={tag.nome}
                          sx={{ backgroundColor: tag.cor, color: 'white' }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {tag.cor}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Dialog para criar nova tag */}
      <Dialog open={dialogOpen} onClose={handleFecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Tag</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Tag"
            fullWidth
            variant="outlined"
            value={novaTag.nome}
            onChange={(e) => setNovaTag({ ...novaTag, nome: e.target.value })}
            placeholder="Ex: Alimentação, Transporte, Trabalho..."
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Escolha uma cor:
          </Typography>
          
          <Grid container spacing={1}>
            {coresPredefinidas.map((cor) => (
              <Grid item key={cor}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: cor,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: novaTag.cor === cor ? '3px solid #000' : '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setNovaTag({ ...novaTag, cor })}
                >
                  {novaTag.cor === cor && <Palette sx={{ color: 'white', fontSize: 20 }} />}
                </Box>
              </Grid>
            ))}
          </Grid>

          {novaTag.nome && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Pré-visualização:</Typography>
              <Chip
                label={novaTag.nome}
                sx={{ backgroundColor: novaTag.cor, color: 'white' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>Cancelar</Button>
          <Button
            onClick={handleSalvarTag}
            variant="contained"
            disabled={!novaTag.nome.trim() || salvandoTag}
          >
            {salvandoTag ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}