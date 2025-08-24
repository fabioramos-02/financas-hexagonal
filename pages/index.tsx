import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Add as AddIcon, TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import Link from 'next/link';
import CadastroTransacaoModal from '../src/ui/components/CadastroTransacaoModal';

interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  quantidadeReceitas: number;
  quantidadeDespesas: number;
}

export default function HomePage() {
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarResumo();
  }, []);

  const carregarResumo = async () => {
    try {
      setLoading(true);
      const hoje = new Date();
      const mes = hoje.getMonth() + 1; // getMonth() retorna 0-11
      const ano = hoje.getFullYear();

      const response = await fetch(
        `/api/resumo?mes=${mes}&ano=${ano}`
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar resumo');
      }

      const data = await response.json();
      setResumo(data.resumo);
    } catch (err) {
      setError('Erro ao carregar dados financeiros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Controle Financeiro Pessoal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie suas receitas e despesas de forma simples e eficiente
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Receitas</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {resumo ? formatarMoeda(resumo.totalReceitas) : 'R$ 0,00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {resumo?.quantidadeReceitas || 0} transações
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Despesas</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {resumo ? formatarMoeda(resumo.totalDespesas) : 'R$ 0,00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {resumo?.quantidadeDespesas || 0} transações
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Saldo</Typography>
              </Box>
              <Typography 
                variant="h4" 
                color={resumo && resumo.saldo >= 0 ? 'success.main' : 'error.main'}
              >
                {resumo ? formatarMoeda(resumo.saldo) : 'R$ 0,00'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mês atual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setModalAberto(true)}
            sx={{ py: 2 }}
          >
            Nova Transação
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Link href="/transacoes" passHref>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ py: 2 }}
            >
              Ver Transações
            </Button>
          </Link>
        </Grid>
      </Grid>

      <CadastroTransacaoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={() => {
          carregarResumo();
          setModalAberto(false);
        }}
      />
    </Container>
  );
}