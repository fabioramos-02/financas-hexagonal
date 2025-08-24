import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export interface ConfirmDeleteModalProps {
  /** Controla se o modal está aberto */
  open: boolean;
  /** Função chamada quando o modal é fechado */
  onClose: () => void;
  /** Função chamada quando a exclusão é confirmada */
  onConfirm: () => void;
  /** Tipo do item sendo excluído (entrada, saída, categoria, etc.) */
  itemType: string;
  /** Nome específico do item sendo excluído (opcional) */
  itemName?: string;
  /** Título customizado do modal (opcional) */
  title?: string;
  /** Mensagem customizada de confirmação (opcional) */
  message?: string;
  /** Indica se a operação de exclusão está em andamento */
  loading?: boolean;
  /** Texto do botão de confirmação (padrão: "Excluir") */
  confirmText?: string;
  /** Texto do botão de cancelamento (padrão: "Cancelar") */
  cancelText?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemType,
  itemName,
  title,
  message,
  loading = false,
  confirmText = 'Excluir',
  cancelText = 'Cancelar'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Gera título padrão se não fornecido
  const defaultTitle = `Confirmar Exclusão`;
  
  // Gera mensagem padrão se não fornecida
  const defaultMessage = itemName 
    ? `Tem certeza que deseja excluir ${itemType.toLowerCase()} "${itemName}"?`
    : `Tem certeza que deseja excluir ${itemType.toLowerCase()}?`;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-description"
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2
        }
      }}
    >
      <DialogTitle
        id="confirm-delete-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon 
            color="warning" 
            sx={{ fontSize: 24 }}
            aria-hidden="true"
          />
          <Typography variant="h6" component="span">
            {title || defaultTitle}
          </Typography>
        </Box>
        
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
          aria-label="Fechar modal"
          sx={{
            color: theme.palette.grey[500],
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Typography 
          id="confirm-delete-description"
          variant="body1"
          color="text.primary"
          sx={{ 
            lineHeight: 1.6,
            textAlign: 'center'
          }}
        >
          {message || defaultMessage}
        </Typography>
        
        <Typography 
          variant="body2"
          color="text.secondary"
          sx={{ 
            mt: 2,
            textAlign: 'center',
            fontStyle: 'italic'
          }}
        >
          Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          pt: 1,
          gap: 1,
          flexDirection: isMobile ? 'column-reverse' : 'row',
          '& > button': {
            minWidth: isMobile ? '100%' : 100
          }
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          color="inherit"
          size="large"
          sx={{
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.primary,
            '&:hover': {
              borderColor: theme.palette.grey[400],
              backgroundColor: theme.palette.grey[50]
            }
          }}
        >
          {cancelText}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="error"
          size="large"
          sx={{
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.dark
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground
            }
          }}
        >
          {loading ? 'Excluindo...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;