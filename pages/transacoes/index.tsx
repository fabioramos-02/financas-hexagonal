import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { AttachMoney, AccountBalance, Assessment, TrendingUp, TrendingDown, PieChart, BarChart } from '@mui/icons-material';

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
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTag, setFiltroTag] = useState<string>('');
  const [filtroMes, setFiltroMes] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    carregarDados();
    carregarTags();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [receitasRes, despesasRes] = await Promise.all([
        fetch('/api/receitas'),
        fetch('/api/despesas')
      ]);
      
      if (!receitasRes.ok || !despesasRes.ok) {
        throw new Error('Erro ao carregar dados');
      }
      
      const receitasData = await receitasRes.json();
      const despesasData = await despesasRes.json();
      
      setReceitas(receitasData.receitas || []);
      setDespesas(despesasData.despesas || []);
    } catch (err) {
      setError('Erro ao carregar transações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (err) {
      console.error('Erro ao carregar tags:', err);
    }
  };

  const handleFiltroTagChange = (event: SelectChangeEvent) => {
    setFiltroTag(event.target.value);
  };

  const handleFiltroMesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroMes(event.target.value);
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

  const filtrarTransacoes = <T extends { tags: Tag[]; data: string }>(transacoes: T[]) => {
    return transacoes.filter(transacao => {
      const filtroTagMatch = !filtroTag || transacao.tags.some(tag => tag.id === filtroTag);
      const filtroMesMatch = !filtroMes || transacao.data.startsWith(filtroMes);
      return filtroTagMatch && filtroMesMatch;
    });
  };

  const receitasFiltradas = filtrarTransacoes(receitas);
  const despesasFiltradas = filtrarTransacoes(despesas);
  const totalReceitas = receitasFiltradas.reduce((acc, receita) => acc + receita.valor, 0);
  const totalDespesas = despesasFiltradas.reduce((acc, despesa) => acc + despesa.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  const estatisticasPorTag = () => {
    const stats: { [key: string]: { nome: string; cor: string; receitas: number; despesas: number } } = {};
    
    receitasFiltradas.forEach(receita => {
      if (receita.tags) {
        receita.tags.forEach(tag => {
           if (!stats[tag.id]) {
             stats[tag.id] = { nome: tag.nome, cor: tag.cor, receitas: 0, despesas: 0 };
           }
           stats[tag.id]!.receitas += receita.valor;
         });
      }
    });
    
    despesasFiltradas.forEach(despesa => {
      if (despesa.tags) {
        despesa.tags.forEach(tag => {
           if (!stats[tag.id]) {
             stats[tag.id] = { nome: tag.nome, cor: tag.cor, receitas: 0, despesas: 0 };
           }
           stats[tag.id]!.despesas += despesa.valor;
         });
      }
    });
    
    return Object.values(stats);
  };

  // Função para obter top categorias
  const getTopCategorias = () => {
    const stats = estatisticasPorTag();
    return stats
      .map(stat => ({
        ...stat,
        total: stat.receitas + stat.despesas
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Função para obter evolução mensal
  const getEvolucaoMensal = () => {
    const meses: { [key: string]: { receitas: number; despesas: number } } = {};
    
    receitas.forEach(receita => {
      const mes = receita.data.substring(0, 7);
      if (!meses[mes]) meses[mes] = { receitas: 0, despesas: 0 };
      meses[mes].receitas += receita.valor;
    });
    
    despesas.forEach(despesa => {
      const mes = despesa.data.substring(0, 7);
      if (!meses[mes]) meses[mes] = { receitas: 0, despesas: 0 };
      meses[mes].despesas += despesa.valor;
    });
    
    return Object.entries(meses)
      .map(([mes, dados]) => ({ mes, ...dados }))
      .sort((a, b) => a.mes.localeCompare(b.mes));
  };

  // Função para obter percentual por categoria
  const getPercentualPorCategoria = () => {
    const stats = estatisticasPorTag();
    const totalGeral = stats.reduce((acc, stat) => acc + stat.receitas + stat.despesas, 0);
    
    return stats.map(stat => ({
      ...stat,
      percentual: totalGeral > 0 ? ((stat.receitas + stat.despesas) / totalGeral) * 100 : 0
    }));
  };

  // Renderização da evolução mensal
  const renderEvolucaoMensal = () => {
    const evolucao = getEvolucaoMensal();
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <BarChart sx={{ mr: 1 }} />
            Evolução Mensal
          </Typography>
          <Grid container spacing={2}>
            {evolucao.map((item) => {
              const mesFormatado = new Date(item.mes + '-01').toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'long' 
              });
              const saldoMes = item.receitas - item.despesas;
              
              return (
                <Grid item xs={12} md={6} lg={4} key={item.mes}>
                  <Paper sx={{ p: 2, border: saldoMes >= 0 ? '2px solid #4caf50' : '2px solid #f44336' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'capitalize' }}>
                      {mesFormatado}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', mb: 0.5 }}>
                      Receitas: {formatarValor(item.receitas)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', mb: 1 }}>
                      Despesas: {formatarValor(item.despesas)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: saldoMes >= 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      Saldo: {formatarValor(saldoMes)}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Renderização do top categorias
  const renderTopCategorias = () => {
    const topCategorias = getTopCategorias();
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PieChart sx={{ mr: 1 }} />
            Top 5 Categorias por Volume
          </Typography>
          <Grid container spacing={2}>
            {topCategorias.map((categoria, index) => {
              const percentualReceitas = categoria.total > 0 ? (categoria.receitas / categoria.total) * 100 : 0;
              
              return (
                <Grid item xs={12} key={categoria.nome}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ minWidth: 30, mr: 2, color: 'primary.main' }}>
                      #{index + 1}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {categoria.nome}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentualReceitas}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: categoria.cor,
                            borderRadius: 4
                          }
                        }} 
                      />
                    </Box>
                    <Box sx={{ ml: 2, textAlign: 'right', minWidth: 120 }}>
                      <Typography variant="body2" sx={{ color: 'success.main' }}>
                        Receitas: {formatarValor(categoria.receitas)} ({percentualReceitas.toFixed(1)}%)
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'error.main' }}>
                        Despesas: {formatarValor(categoria.despesas)} ({(100 - percentualReceitas).toFixed(1)}%)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Renderização de métricas de performance
  const renderMetricasPerformance = () => {
    const mediaReceitas = receitas.length > 0 ? totalReceitas / receitas.length : 0;
    const mediaDespesas = despesas.length > 0 ? totalDespesas / despesas.length : 0;
    const taxaEconomia = totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas) * 100 : 0;
    
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" sx={{ color: 'success.main' }}>
                Média Receitas
              </Typography>
              <Typography variant="h5">
                {formatarValor(mediaReceitas)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h6" sx={{ color: 'error.main' }}>
                Média Despesas
              </Typography>
              <Typography variant="h5">
                {formatarValor(mediaDespesas)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Taxa de Economia
              </Typography>
              <Typography variant="h5" sx={{
                color: taxaEconomia >= 0 ? 'success.main' : 'error.main'
              }}>
                {taxaEconomia.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" sx={{ color: 'info.main' }}>
                Total Transações
              </Typography>
              <Typography variant="h5">
                {receitas.length + despesas.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Relatório Administrativo Financeiro
      </Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filtrar por Categoria</InputLabel>
              <Select value={filtroTag} onChange={handleFiltroTagChange}>
                <MenuItem value="">Todas as categorias</MenuItem>
                {tags.map(tag => (
                  <MenuItem key={tag.id} value={tag.id}>
                    <Chip 
                      label={tag.nome} 
                      size="small" 
                      sx={{ bgcolor: tag.cor, color: 'white' }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filtrar por Mês"
              type="month"
              value={filtroMes}
              onChange={handleFiltroMesChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Cards de Resumo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Receitas</Typography>
                <Typography variant="h4">{formatarValor(totalReceitas)}</Typography>
                <Typography variant="body2">{receitasFiltradas.length} transações</Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 48, opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Despesas</Typography>
                <Typography variant="h4">{formatarValor(totalDespesas)}</Typography>
                <Typography variant="body2">{despesasFiltradas.length} transações</Typography>
              </Box>
              <TrendingDown sx={{ fontSize: 48, opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            bgcolor: saldo >= 0 ? 'success.light' : 'error.light',
            color: saldo >= 0 ? 'success.contrastText' : 'error.contrastText'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Saldo</Typography>
                <Typography variant="h4">{formatarValor(saldo)}</Typography>
                <Typography variant="body2">{saldo >= 0 ? 'Superávit' : 'Déficit'}</Typography>
              </Box>
              <AccountBalance sx={{ fontSize: 48, opacity: 0.7 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Métricas de Performance */}
      {renderMetricasPerformance()}
      
      {/* Evolução Mensal */}
      {renderEvolucaoMensal()}
      
      {/* Top Categorias */}
      {renderTopCategorias()}
      
      {/* Estatísticas Detalhadas por Categoria */}
      {estatisticasPorTag().length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Análise Detalhada por Categoria</Typography>
            <Grid container spacing={2}>
              {getPercentualPorCategoria().map((stat) => (
                <Grid item xs={12} md={6} lg={4} key={stat.nome}>
                  <Paper sx={{ p: 2, border: `2px solid ${stat.cor}`, position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Typography variant="caption" sx={{ 
                        bgcolor: stat.cor, 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1 
                      }}>
                        {stat.percentual.toFixed(1)}%
                      </Typography>
                    </Box>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, pr: 4 }}>
                      {stat.nome}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'success.main', mb: 0.5 }}>
                        Receitas: {formatarValor(stat.receitas)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={stat.receitas > 0 ? (stat.receitas / (stat.receitas + stat.despesas)) * 100 : 0}
                        sx={{ 
                          height: 4, 
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': { bgcolor: 'success.main' }
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'error.main', mb: 0.5 }}>
                        Despesas: {formatarValor(stat.despesas)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={stat.despesas > 0 ? (stat.despesas / (stat.receitas + stat.despesas)) * 100 : 0}
                        sx={{ 
                          height: 4, 
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': { bgcolor: 'error.main' }
                        }} 
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: (stat.receitas - stat.despesas) >= 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      Saldo: {formatarValor(stat.receitas - stat.despesas)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}