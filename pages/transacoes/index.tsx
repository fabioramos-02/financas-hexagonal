import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import { ArrowBack, Add, TrendingUp, TrendingDown } from '@mui/icons-material';
import Link from 'next/link';

interface Tag {
  id: string;
  nome: string;
  cor: string;
}

interface Receita {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tags: Tag[];
}

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tags: Tag[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Transacoes() {
  const [tabValue, setTabValue] = useState(0);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      const [receitasResponse, despesasResponse] = await Promise.all([
        fetch('/api/receitas'),
        fetch('/api/despesas')
      ]);

      if (!receitasResponse.ok || !despesasResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const receitasData = await receitasResponse.json();
      const despesasData = await despesasResponse.json();

      setReceitas(receitasData.receitas || []);
      setDespesas(despesasData.despesas || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const renderReceitas = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Receitas ({receitas.length})</Typography>
        <Link href="/receitas/cadastrar" passHref>
          <Button variant="contained" color="success" startIcon={<Add />}>
            Nova Receita
          </Button>
        </Link>
      </Box>
      
      {receitas.length === 0 ? (
        <Alert severity="info">
          Nenhuma receita cadastrada ainda.
        </Alert>
      ) : (
        <List>
          {receitas.map((receita, index) => (
            <React.Fragment key={receita.id}>
              <ListItem sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <TrendingUp color="success" />
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{receita.descricao}</Typography>
                      <Typography variant="h6" color="success.main">
                        {formatarValor(receita.valor)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatarData(receita.data)}
                      </Typography>
                      {receita.tags.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {receita.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.nome}
                              size="small"
                              sx={{ backgroundColor: tag.cor, color: 'white' }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < receitas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  const renderDespesas = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Despesas ({despesas.length})</Typography>
        <Link href="/despesas/cadastrar" passHref>
          <Button variant="contained" color="error" startIcon={<Add />}>
            Nova Despesa
          </Button>
        </Link>
      </Box>
      
      {despesas.length === 0 ? (
        <Alert severity="info">
          Nenhuma despesa cadastrada ainda.
        </Alert>
      ) : (
        <List>
          {despesas.map((despesa, index) => (
            <React.Fragment key={despesa.id}>
              <ListItem sx={{ px: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <TrendingDown color="error" />
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">{despesa.descricao}</Typography>
                      <Typography variant="h6" color="error.main">
                        -{formatarValor(despesa.valor)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatarData(despesa.data)}
                      </Typography>
                      {despesa.tags.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {despesa.tags.map((tag) => (
                            <Chip
                              key={tag.id}
                              label={tag.nome}
                              size="small"
                              sx={{ backgroundColor: tag.cor, color: 'white' }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < despesas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Carregando transações...
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
          Transações
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="transações tabs">
            <Tab label="Receitas" />
            <Tab label="Despesas" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {renderReceitas()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderDespesas()}
        </TabPanel>
      </Card>
    </Container>
  );
}