import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Tag {
  id: string;
  nome: string;
  cor: string;
}

export default function CadastrarReceita() {
  const router = useRouter();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    carregarTags();
  }, []);

  const carregarTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTagsDisponiveis(data.tags);
      }
    } catch (err) {
      // Erro ao carregar tags
    }
  };

  const handleTagChange = (event: SelectChangeEvent<typeof tagsSelecionadas>) => {
    const value = event.target.value;
    setTagsSelecionadas(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          descricao,
          valor: parseFloat(valor),
          data: new Date(data || new Date()).toISOString(),
          tagIds: tagsSelecionadas
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.erro || 'Erro ao cadastrar receita');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getTagNome = (tagId: string) => {
    const tag = tagsDisponiveis.find(t => t.id === tagId);
    return tag ? tag.nome : tagId;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Link href="/" passHref>
          <Button startIcon={<ArrowBack />} sx={{ mr: 2 }}>
            Voltar
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Cadastrar Receita
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Receita cadastrada com sucesso! Redirecionando...
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              margin="normal"
              placeholder="Ex: Salário, Freelance, Venda..."
            />

            <TextField
              fullWidth
              label="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              margin="normal"
              inputProps={{ step: '0.01', min: '0' }}
              placeholder="0,00"
            />

            <TextField
              fullWidth
              label="Data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={tagsSelecionadas}
                onChange={handleTagChange}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={getTagNome(value)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {tagsDisponiveis.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    <Chip
                      label={tag.nome}
                      size="small"
                      sx={{ backgroundColor: tag.cor, color: 'white' }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                startIcon={<Save />}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Salvando...' : 'Salvar Receita'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}