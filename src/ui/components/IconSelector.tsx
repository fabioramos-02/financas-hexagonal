import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  Chip,
} from '@mui/material';
import {
  Search,
  // Ícones de categorias financeiras
  AttachMoney,
  ShoppingCart,
  LocalGasStation,
  Restaurant,
  Home,
  DirectionsCar,
  School,
  LocalHospital,
  SportsEsports,
  Movie,
  FitnessCenter,
  Pets,
  Flight,
  Hotel,
  ShoppingBag,
  Phone,
  Wifi,
  ElectricBolt,
  Water,
  LocalLaundryService,
  Checkroom,
  MenuBook,
  Coffee,
  Fastfood,
  LocalBar,
  IceCream,
  Cake,
  // Ícones de trabalho e renda
  Work,
  BusinessCenter,
  AccountBalance,
  CreditCard,
  Savings,
  TrendingUp,
  MonetizationOn,
  // Ícones gerais
  Category,
  Star,
  Favorite,
  Build,
  Settings,
  Security,
  HealthAndSafety,
  Psychology,
  SelfImprovement,
  // Ícones de transporte
  DirectionsBus,
  Train,
  LocalTaxi,
  TwoWheeler,
  // Ícones de entretenimento
  TheaterComedy,
  MusicNote,
  LibraryBooks,
  Videogame,
  SportsBaseball,
  Pool,
} from '@mui/icons-material';

interface IconOption {
  name: string;
  icon: React.ReactElement;
  keywords: string[];
}

const iconOptions: IconOption[] = [
  // Receitas/Renda
  { name: 'AttachMoney', icon: <AttachMoney />, keywords: ['dinheiro', 'salário', 'renda', 'pagamento'] },
  { name: 'Work', icon: <Work />, keywords: ['trabalho', 'emprego', 'salário'] },
  { name: 'BusinessCenter', icon: <BusinessCenter />, keywords: ['negócio', 'empresa', 'trabalho'] },
  { name: 'AccountBalance', icon: <AccountBalance />, keywords: ['banco', 'conta', 'investimento'] },
  { name: 'TrendingUp', icon: <TrendingUp />, keywords: ['investimento', 'lucro', 'crescimento'] },
  { name: 'MonetizationOn', icon: <MonetizationOn />, keywords: ['monetização', 'renda', 'ganho'] },
  { name: 'Savings', icon: <Savings />, keywords: ['poupança', 'economia', 'reserva'] },
  
  // Alimentação
  { name: 'Restaurant', icon: <Restaurant />, keywords: ['restaurante', 'comida', 'alimentação', 'jantar'] },
  { name: 'Fastfood', icon: <Fastfood />, keywords: ['fast food', 'lanche', 'hambúrguer'] },
  { name: 'Coffee', icon: <Coffee />, keywords: ['café', 'bebida', 'cafeteria'] },
  { name: 'LocalBar', icon: <LocalBar />, keywords: ['bar', 'bebida', 'álcool'] },
  { name: 'IceCream', icon: <IceCream />, keywords: ['sorvete', 'doce', 'sobremesa'] },
  { name: 'Cake', icon: <Cake />, keywords: ['bolo', 'doce', 'festa', 'aniversário'] },
  { name: 'MenuBook', icon: <MenuBook />, keywords: ['cardápio', 'menu', 'restaurante'] },
  
  // Compras
  { name: 'ShoppingCart', icon: <ShoppingCart />, keywords: ['compras', 'supermercado', 'carrinho'] },
  { name: 'ShoppingBag', icon: <ShoppingBag />, keywords: ['compras', 'sacola', 'loja'] },
  { name: 'Checkroom', icon: <Checkroom />, keywords: ['roupas', 'vestuário', 'moda'] },
  
  // Transporte
  { name: 'DirectionsCar', icon: <DirectionsCar />, keywords: ['carro', 'automóvel', 'transporte'] },
  { name: 'LocalGasStation', icon: <LocalGasStation />, keywords: ['combustível', 'gasolina', 'posto'] },
  { name: 'DirectionsBus', icon: <DirectionsBus />, keywords: ['ônibus', 'transporte público'] },
  { name: 'Train', icon: <Train />, keywords: ['trem', 'metrô', 'transporte'] },
  { name: 'LocalTaxi', icon: <LocalTaxi />, keywords: ['táxi', 'uber', 'transporte'] },
  { name: 'TwoWheeler', icon: <TwoWheeler />, keywords: ['moto', 'bicicleta', 'transporte'] },
  { name: 'Flight', icon: <Flight />, keywords: ['avião', 'viagem', 'voo'] },
  
  // Casa e Utilidades
  { name: 'Home', icon: <Home />, keywords: ['casa', 'moradia', 'aluguel'] },
  { name: 'ElectricBolt', icon: <ElectricBolt />, keywords: ['energia', 'luz', 'eletricidade'] },
  { name: 'Water', icon: <Water />, keywords: ['água', 'conta', 'utilidade'] },
  { name: 'Wifi', icon: <Wifi />, keywords: ['internet', 'wifi', 'conexão'] },
  { name: 'Phone', icon: <Phone />, keywords: ['telefone', 'celular', 'comunicação'] },
  { name: 'LocalLaundryService', icon: <LocalLaundryService />, keywords: ['lavanderia', 'limpeza', 'roupa'] },
  
  // Saúde e Educação
  { name: 'LocalHospital', icon: <LocalHospital />, keywords: ['hospital', 'saúde', 'médico'] },
  { name: 'HealthAndSafety', icon: <HealthAndSafety />, keywords: ['saúde', 'segurança', 'bem-estar'] },
  { name: 'School', icon: <School />, keywords: ['escola', 'educação', 'estudo'] },
  { name: 'LibraryBooks', icon: <LibraryBooks />, keywords: ['livros', 'biblioteca', 'estudo'] },
  { name: 'Psychology', icon: <Psychology />, keywords: ['psicologia', 'mente', 'terapia'] },
  
  // Entretenimento
  { name: 'Movie', icon: <Movie />, keywords: ['filme', 'cinema', 'entretenimento'] },
  { name: 'TheaterComedy', icon: <TheaterComedy />, keywords: ['teatro', 'comédia', 'show'] },
  { name: 'MusicNote', icon: <MusicNote />, keywords: ['música', 'som', 'áudio'] },
  { name: 'SportsEsports', icon: <SportsEsports />, keywords: ['jogos', 'games', 'videogame'] },
  { name: 'Videogame', icon: <Videogame />, keywords: ['videogame', 'console', 'jogos'] },
  { name: 'SportsBaseball', icon: <SportsBaseball />, keywords: ['esporte', 'baseball', 'atividade'] },
  { name: 'FitnessCenter', icon: <FitnessCenter />, keywords: ['academia', 'fitness', 'exercício'] },
  { name: 'Pool', icon: <Pool />, keywords: ['piscina', 'natação', 'esporte'] },
  
  // Outros
  { name: 'Pets', icon: <Pets />, keywords: ['pets', 'animais', 'cachorro', 'gato'] },
  { name: 'Hotel', icon: <Hotel />, keywords: ['hotel', 'hospedagem', 'viagem'] },
  { name: 'CreditCard', icon: <CreditCard />, keywords: ['cartão', 'crédito', 'pagamento'] },
  { name: 'Build', icon: <Build />, keywords: ['ferramentas', 'construção', 'reparo'] },
  { name: 'Settings', icon: <Settings />, keywords: ['configurações', 'ajustes', 'opções'] },
  { name: 'Security', icon: <Security />, keywords: ['segurança', 'proteção', 'seguro'] },
  { name: 'SelfImprovement', icon: <SelfImprovement />, keywords: ['melhoria', 'desenvolvimento', 'crescimento'] },
  { name: 'Category', icon: <Category />, keywords: ['categoria', 'geral', 'outros'] },
  { name: 'Star', icon: <Star />, keywords: ['estrela', 'favorito', 'importante'] },
  { name: 'Favorite', icon: <Favorite />, keywords: ['favorito', 'coração', 'amor'] },
];

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
}

export default function IconSelector({ selectedIcon, onIconSelect }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = iconOptions.filter(option => {
    const searchLower = searchTerm.toLowerCase();
    return (
      option.name.toLowerCase().includes(searchLower) ||
      option.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  const getIconByName = (iconName: string) => {
    const option = iconOptions.find(opt => opt.name === iconName);
    return option ? option.icon : <Category />;
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Escolha um ícone:
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Buscar ícone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
        size="small"
      />
      
      {selectedIcon && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Ícone selecionado:
          </Typography>
          <Chip
            icon={getIconByName(selectedIcon)}
            label={selectedIcon}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
      
      <Paper 
        sx={{ 
          maxHeight: 300, 
          overflow: 'auto', 
          p: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={1}>
          {filteredIcons.map((option) => (
            <Grid item key={option.name}>
              <IconButton
                onClick={() => onIconSelect(option.name)}
                sx={{
                  width: 48,
                  height: 48,
                  border: selectedIcon === option.name ? '2px solid' : '1px solid',
                  borderColor: selectedIcon === option.name ? 'primary.main' : 'divider',
                  bgcolor: selectedIcon === option.name ? 'primary.light' : 'transparent',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    borderColor: 'primary.main',
                  },
                }}
                title={`${option.name} - ${option.keywords.join(', ')}`}
              >
                {option.icon}
              </IconButton>
            </Grid>
          ))}
        </Grid>
        
        {filteredIcons.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Nenhum ícone encontrado para &quot;{searchTerm}&quot;
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

// Função utilitária para obter ícone por nome
export function getIconByName(iconName: string): React.ReactElement {
  const option = iconOptions.find(opt => opt.name === iconName);
  return option ? React.cloneElement(option.icon) : <Category />;
}