import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import { Add, AttachMoney, AccountBalance, Assessment } from '@mui/icons-material';
import CadastroTransacaoModal from '../../src/ui/components/CadastroTransacaoModal';

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



export default function Transacoes() {
  const [tabValue, setTabValue] = useState(0);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'receita' | 'despesa'>('receita');
  const [filtroTag, setFiltroTag] = useState<string>('');
  const [filtroMes, setFiltroMes] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    carregarDados();
    carregarTags();
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

  const carregarTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
      }
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFiltroTagChange = (event: SelectChangeEvent) => {
    setFiltroTag(event.target.value);
  };

  const handleFiltroMesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroMes(event.target.value);
  };

  const abrirModal = (tipo: 'receita' | 'despesa') => {
    setModalType(tipo);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    carregarDados(); // Recarregar dados após cadastro
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

  // Funções de filtro
  const filtrarTransacoes = (transacoes: (Receita | Despesa)[]) => {
    return transacoes.filter(transacao => {
      const passaFiltroTag = !filtroTag || transacao.tags.some(tag => tag.id === filtroTag);
      const passaFiltroMes = !filtroMes || new Date(transacao.data).toISOString().slice(0, 7) === filtroMes;
      return passaFiltroTag && passaFiltroMes;
    });
  };

  // Cálculos do dashboard
  const receitasFiltradas = filtrarTransacoes(receitas);
  const despesasFiltradas = filtrarTransacoes(despesas);
  
  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + receita.valor, 0);
  const totalDespesas = despesasFiltradas.reduce((acc, despesa) => acc + despesa.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  // Estatísticas por categoria
  const estatisticasPorTag = () => {
    const stats: { [key: string]: { nome: string; cor: string; receitas: number; despesas: number } } = {};
    
    receitasFiltradas.forEach(receita => {
      receita.tags.forEach(tag => {
        if (!stats[tag.id]) {
          stats[tag.id] = { nome: tag.nome, cor: tag.cor, receitas: 0, despesas: 0 };
        }
        stats[tag.id].receitas += receita.valor;
      });
    });
    
    despesasFiltradas.forEach(despesa => {
      despesa.tags.forEach(tag => {
        if (!stats[tag.id]) {
          stats[tag.id] = { nome: tag.nome, cor: tag.cor, receitas: 0, despesas: 0 };
        }
        stats[tag.id].despesas += despesa.valor;
      });
    });
    
    return Object.values(stats);
  };

  const renderReceitas = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Receitas ({receitasFiltradas.length})</Typography>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<Add />}
          onClick={() => abrirModal('receita')}
        >
          Nova Receita
        </Button>
      </Box>
      
      {receitasFiltradas.length === 0 ? (
        <Alert severity="info">
          {receitas.length === 0 ? 'Nenhuma receita cadastrada ainda.' : 'Nenhuma receita encontrada com os filtros aplicados.'}
        </Alert>
      ) : (
        <List>
          {receitasFiltradas.map((receita, index) => (
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
              {index < receitasFiltradas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  const renderDespesas = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Despesas ({despesasFiltradas.length})</Typography>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<Add />}
          onClick={() => abrirModal('despesa')}
        >
          Nova Despesa
        </Button>
      </Box>
      
      {despesasFiltradas.length === 0 ? (
        <Alert severity="info">
          {despesas.length === 0 ? 'Nenhuma despesa cadastrada ainda.' : 'Nenhuma despesa encontrada com os filtros aplicados.'}
        </Alert>
      ) : (
        <List>
          {despesasFiltradas.map((despesa, index) => (
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
              {index < despesasFiltradas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Dashboard Financeiro
      </Typography>
      
      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <AttachMoney sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Total Receitas</Typography>
            <Typography variant="h4">{formatarValor(totalReceitas)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light', color: 'white' }}>
            <AccountBalance sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Total Despesas</Typography>
            <Typography variant="h4">{formatarValor(totalDespesas)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            bgcolor: saldo >= 0 ? 'success.main' : 'error.main', 
            color: 'white' 
          }}>
            <Assessment sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Saldo</Typography>
            <Typography variant="h4">{formatarValor(saldo)}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filtros</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por Categoria</InputLabel>
              <Select
                value={filtroTag}
                label="Filtrar por Categoria"
                onChange={handleFiltroTagChange}
              >
                <MenuItem value="">Todas as categorias</MenuItem>
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    <Chip 
                      label={tag.nome} 
                      size="small" 
                      sx={{ 
                        bgcolor: tag.cor, 
                        color: 'white',
                        mr: 1
                      }} 
                    />
                    {tag.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="month"
              label="Filtrar por Mês"
              value={filtroMes}
              onChange={handleFiltroMesChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Estatísticas por Categoria */}
      {estatisticasPorTag().length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Estatísticas por Categoria</Typography>
          <Grid container spacing={2}>
            {estatisticasPorTag().map((stat) => (
              <Grid item xs={12} md={6} lg={4} key={stat.nome}>
                <Paper sx={{ p: 2, border: `2px solid ${stat.cor}` }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.nome}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Receitas: {formatarValor(stat.receitas)}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    Despesas: {formatarValor(stat.despesas)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Saldo: {formatarValor(stat.receitas - stat.despesas)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Tabs de Transações */}
      <Paper sx={{ p: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Receitas" />
          <Tab label="Despesas" />
        </Tabs>
        
        {tabValue === 0 && renderReceitas()}
        {tabValue === 1 && renderDespesas()}
      </Paper>
      
      {/* Modal de Cadastro */}
      <CadastroTransacaoModal
        open={modalOpen}
        onClose={fecharModal}
        tipo={modalType}
      />
    </Box>
  );
}