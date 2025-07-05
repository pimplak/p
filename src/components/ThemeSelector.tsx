import { Select, Group, Box, Text, ColorSwatch, Button, Stack } from '@mantine/core';
import { IconPalette, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';
import type { PaletteId } from '../types/theme';

export function ThemeSelector() {
  const { currentPaletteId, setPalette, getAllPalettes, isDark } = useTheme();
  
  const palettes = getAllPalettes();
  
  // Prepare select data with custom rendering
  const selectData = palettes.map(palette => ({
    value: palette.id,
    label: palette.name,
    palette: palette,
  }));
  
  const handlePaletteChange = (value: string | null) => {
    if (value && value in palettes.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})) {
      setPalette(value as PaletteId);
    }
  };

  // Quick dark/light mode toggle
  const toggleDarkMode = () => {
    if (isDark) {
      setPalette('arctic'); // Default light theme
    } else {
      setPalette('darkpro'); // Default dark theme
    }
  };
  
  return (
    <Stack gap="md">
      {/* Quick Dark/Light Toggle */}
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>Tryb ciemny</Text>
        <Button
          variant={isDark ? 'filled' : 'light'}
          leftSection={isDark ? <IconMoon size={16} /> : <IconSun size={16} />}
          onClick={toggleDarkMode}
          size="sm"
        >
          {isDark ? 'Ciemny' : 'Jasny'}
        </Button>
      </Group>

      {/* Full Theme Selector */}
      <Select
        label="Motyw kolorystyczny"
        placeholder="Wybierz paletę"
        leftSection={<IconPalette size={16} />}
        value={currentPaletteId}
        onChange={handlePaletteChange}
        data={selectData}
        searchable={false}
        allowDeselect={false}
        renderOption={({ option }) => {
          const palette = selectData.find(p => p.value === option.value)?.palette;
          if (!palette) return null;
          
          return (
            <Group gap="sm">
              <Group gap={2}>
                <ColorSwatch color={palette.background} size={12} />
                <ColorSwatch color={palette.surface} size={12} />
                <ColorSwatch color={palette.primary} size={12} />
                <ColorSwatch color={palette.accent} size={12} />
                <ColorSwatch color={palette.text} size={12} />
              </Group>
              <Text size="sm">{palette.name}</Text>
            </Group>
          );
        }}
        comboboxProps={{
          offset: 4,
          withinPortal: false,
        }}
      />
    </Stack>
  );
}

// Preview component for current palette
export function ThemePreview() {
  const { currentPalette } = useTheme();
  
  return (
    <Box
      p="md"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: `1px solid var(--color-primary)`,
        borderRadius: '8px',
      }}
    >
      <Text size="sm" fw={600} mb="xs" style={{ color: 'var(--color-text)' }}>
        Aktualna paleta: {currentPalette.name}
      </Text>
      
      <Group gap="xs">
        <Group gap={2}>
          <ColorSwatch color={currentPalette.background} size={16} />
          <Text size="xs" c="dimmed">Tło</Text>
        </Group>
        
        <Group gap={2}>
          <ColorSwatch color={currentPalette.surface} size={16} />
          <Text size="xs" c="dimmed">Powierzchnia</Text>
        </Group>
        
        <Group gap={2}>
          <ColorSwatch color={currentPalette.primary} size={16} />
          <Text size="xs" c="dimmed">Primary</Text>
        </Group>
        
        <Group gap={2}>
          <ColorSwatch color={currentPalette.accent} size={16} />
          <Text size="xs" c="dimmed">Akcent</Text>
        </Group>
        
        <Group gap={2}>
          <ColorSwatch color={currentPalette.text} size={16} />
          <Text size="xs" c="dimmed">Tekst</Text>
        </Group>
      </Group>
    </Box>
  );
} 