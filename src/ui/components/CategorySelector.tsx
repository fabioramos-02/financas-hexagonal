import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { getIconByName } from './IconSelector';

interface Tag {
  id: string;
  nome: string;
  cor: string;
  icone?: string;
}

interface CategorySelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CategorySelector({
  tags,
  selectedTags,
  onChange,
  label = 'Categorias',
  placeholder = 'Selecione as categorias',
  disabled = false,
}: CategorySelectorProps) {
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedTags}
        onChange={(e) => onChange(e.target.value as string[])}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            ) : (
              selected.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <Chip
                    key={tagId}
                    label={tag.nome}
                    size="small"
                    icon={tag.icone ? getIconByName(tag.icone) : undefined}
                    sx={{
                      backgroundColor: tag.cor + '20',
                      color: tag.cor,
                      border: `1px solid ${tag.cor}40`,
                      '& .MuiChip-icon': {
                        color: tag.cor,
                      },
                      '& .MuiChip-deleteIcon': {
                        color: tag.cor,
                        '&:hover': {
                          color: tag.cor,
                          opacity: 0.7,
                        },
                      },
                    }}
                  />
                ) : null;
              })
            )}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        {tags.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Nenhuma categoria disponível
            </Typography>
          </MenuItem>
        ) : (
          tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                size="small"
                sx={{
                  color: tag.cor,
                  '&.Mui-checked': {
                    color: tag.cor,
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                {tag.icone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: tag.cor }}>
                    {getIconByName(tag.icone)}
                  </Box>
                )}
                <ListItemText
                  primary={tag.nome}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: selectedTags.includes(tag.id) ? 600 : 400,
                  }}
                />
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: tag.cor,
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}