import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  SelectChangeEvent,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Snackbar,
  InputAdornment,
  IconButton
} from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { ptBR } from 'date-fns/locale';
import { Close, Save, Cancel } from '@mui/icons-material';

interface Tag {
  id: string;
  nome: string;
  cor: string;
}

interface CadastroTransacaoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tipo?: 'receita' | 'despesa';
}

type TipoTransacao = 'receita' | 'despesa';

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
      id={`transacao-tabpanel-${index}`}
      aria-labelledby={`transacao-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `transacao-tab-${index}`,
    'aria-controls': `transacao-tabpanel-${index}`,
  };
}

const formatarValorMonetario = (valor: string): string => {
  // Remove tudo que não é dígito
  const apenasNumeros = valor.replace(/\D/g, '');
  
  // Converte para número e divide por 100 para ter centavos
  const numero = parseInt(apenasNumeros) / 100;
  
  // Formata como moeda brasileira
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const parseValorMonetario = (valorFormatado: string): number => {
  // Remove formatação e converte para número
  const apenasNumeros = valorFormatado.replace(/\D/g, '');
  return parseInt(apenasNumeros) / 100;
};

export default function CadastroTransacaoModal({
  open,
  onClose,
  onSuccess,
  tipo
}: CadastroTransacaoModalProps) {
  const [tipoTransacao, setTipoTransacao] = useState<number>(tipo === 'despesa' ? 1 : 0); // 0 = receita, 1 = despesa
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState<Date | null>(new Date());
  const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validações
  const [errors, setErrors] = useState({
    descricao: '',
    valor: '',
    data: ''
  });

  useEffect(() => {
    if (open) {
      carregarTags();
      resetForm();
    }
  }, [open]);

  // Atualizar tipo quando prop mudar
  useEffect(() => {
    if (tipo) {
      setTipoTransacao(tipo === 'despesa' ? 1 : 0);
    }
  }, [tipo]);

  const carregarTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTagsDisponiveis(data.tags);
      }
    } catch (error) {
      // Erro ao carregar tags
    }
  };

  const resetForm = () => {
    setDescricao('');
    setValor('');
    setData(new Date());
    setTagsSelecionadas([]);
    setError(null);
    setErrors({ descricao: '', valor: '', data: '' });
    setTipoTransacao(0);
  };

  const validarFormulario = (): boolean => {
    const novosErros = { descricao: '', valor: '', data: '' };
    let valido = true;

    if (!descricao.trim()) {
      novosErros.descricao = 'Descrição é obrigatória';
      valido = false;
    }

    if (!valor || parseValorMonetario(valor) <= 0) {
      novosErros.valor = 'Valor deve ser maior que zero';
      valido = false;
    }

    if (!data) {
      novosErros.data = 'Data é obrigatória';
      valido = false;
    }

    setErrors(novosErros);
    return valido;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = tipoTransacao === 0 ? '/api/receitas' : '/api/despesas';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descricao: descricao.trim(),
          valor: parseValorMonetario(valor),
          data: data?.toISOString(),
          tagIds: tagsSelecionadas,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao salvar transação');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (event: SelectChangeEvent<typeof tagsSelecionadas>) => {
    const value = event.target.value;
    setTagsSelecionadas(typeof value === 'string' ? value.split(',') : value);
  };

  const handleValorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValorMonetario(event.target.value);
    setValor(valorFormatado);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h2" fontWeight="600">
              Nova Transação
            </Typography>
            <IconButton onClick={handleClose} disabled={loading}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={tipoTransacao}
              onChange={(_, newValue) => setTipoTransacao(newValue)}
              aria-label="tipo de transação"
              variant="fullWidth"
            >
              <Tab
                label="Receita"
                {...a11yProps(0)}
                sx={{
                  color: tipoTransacao === 0 ? 'success.main' : 'text.secondary',
                  fontWeight: tipoTransacao === 0 ? 600 : 400
                }}
              />
              <Tab
                label="Despesa"
                {...a11yProps(1)}
                sx={{
                  color: tipoTransacao === 1 ? 'error.main' : 'text.secondary',
                  fontWeight: tipoTransacao === 1 ? 600 : 400
                }}
              />
            </Tabs>
          </Box>

          <TabPanel value={tipoTransacao} index={0}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                error={!!errors.descricao}
                helperText={errors.descricao}
                fullWidth
                required
                disabled={loading}
              />

              <TextField
                label="Valor"
                value={valor}
                onChange={handleValorChange}
                error={!!errors.valor}
                helperText={errors.valor}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />

              <TextField
                label="Data"
                type="date"
                value={data ? data.toISOString().split('T')[0] : ''}
                onChange={(e) => setData(new Date(e.target.value))}
                fullWidth
                error={!!errors.data}
                helperText={errors.data}
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={tagsSelecionadas}
                  onChange={handleTagChange}
                  input={<OutlinedInput label="Tags" />}
                  disabled={loading}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((tagId) => {
                        const tag = tagsDisponiveis.find(t => t.id === tagId);
                        return tag ? (
                          <Chip
                            key={tagId}
                            label={tag.nome}
                            size="small"
                            sx={{
                              backgroundColor: tag.cor,
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {tagsDisponiveis.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Chip
                        label={tag.nome}
                        size="small"
                        sx={{
                          backgroundColor: tag.cor,
                          color: 'white',
                          mr: 1
                        }}
                      />
                      {tag.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </TabPanel>

          <TabPanel value={tipoTransacao} index={1}>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                error={!!errors.descricao}
                helperText={errors.descricao}
                fullWidth
                required
                disabled={loading}
              />

              <TextField
                label="Valor"
                value={valor}
                onChange={handleValorChange}
                error={!!errors.valor}
                helperText={errors.valor}
                fullWidth
                required
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />

              <TextField
                label="Data"
                type="date"
                value={data ? data.toISOString().split('T')[0] : ''}
                onChange={(e) => setData(new Date(e.target.value))}
                fullWidth
                error={!!errors.data}
                helperText={errors.data}
                required
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={tagsSelecionadas}
                  onChange={handleTagChange}
                  input={<OutlinedInput label="Tags" />}
                  disabled={loading}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((tagId) => {
                        const tag = tagsDisponiveis.find(t => t.id === tagId);
                        return tag ? (
                          <Chip
                            key={tagId}
                            label={tag.nome}
                            size="small"
                            sx={{
                              backgroundColor: tag.cor,
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {tagsDisponiveis.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Chip
                        label={tag.nome}
                        size="small"
                        sx={{
                          backgroundColor: tag.cor,
                          color: 'white',
                          mr: 1
                        }}
                      />
                      {tag.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </TabPanel>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            color="inherit"
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color={tipoTransacao === 0 ? 'success' : 'error'}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {tipoTransacao === 0 ? 'Receita' : 'Despesa'} cadastrada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
}