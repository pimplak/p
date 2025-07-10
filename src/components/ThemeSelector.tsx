import { Select, Group, Text, ColorSwatch, Stack, Switch } from '@mantine/core';
import { IconPalette, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';
import { isDarkPalette, type ColorPalette, type PaletteId } from '../types/theme';

export function ThemeSelector() {
  const { currentPaletteId, setPalette, getAllPalettes, isDark } = useTheme();
  
  const palettes = getAllPalettes();
  const darkPalettes = palettes.filter((p: ColorPalette) => isDarkPalette(p.id as PaletteId));
  const lightPalettes = palettes.filter((p: ColorPalette) => !isDarkPalette(p.id as PaletteId));
  
  // Prepare select data with custom rendering
  const selectData = palettes.map((palette: ColorPalette) => ({
    value: palette.id,
    label: palette.name,
    palette: palette,
  }));
  
  const handlePaletteChange = (value: string | null) => {
    if (value && value in palettes.reduce((acc: Record<string, ColorPalette>, p: ColorPalette) => ({ ...acc, [p.id]: p }), {})) {
      setPalette(value as PaletteId);
    }
  };

  // Random theme selection based on dark/light mode
  const getRandomTheme = (isDark: boolean) => {
    const availablePalettes = isDark ? darkPalettes : lightPalettes;
    const randomIndex = Math.floor(Math.random() * availablePalettes.length);
    return availablePalettes[randomIndex].id as PaletteId;
  };

  // Quick dark/light mode toggle with random theme
  const toggleDarkMode = (checked: boolean) => {
    const randomPaletteId = getRandomTheme(checked);
    setPalette(randomPaletteId);
  };
  
  return (
    <Stack gap="md">
      {/* Quick Dark/Light Toggle */}
      <Group justify="space-between" align="center">
        <Group gap="sm">
          <IconSun size={18} color="var(--mantine-color-yellow-6)" />
          <Switch 
            checked={isDark}
            onChange={(event) => toggleDarkMode(event.currentTarget.checked)}
            size="md"
            color="indigo"
          />
          <IconMoon size={18} color="var(--mantine-color-blue-6)" />
        </Group>
        <Text size="sm" fw={500} c="dimmed">
          {isDark ? 'Tryb ciemny' : 'Tryb jasny'}
        </Text>
      </Group>

      {/* Full Theme Selector */}
      <Stack gap="xs">
        <Text size="sm" fw={500}>Motyw kolorystyczny</Text>
        <Select
          placeholder="Wybierz paletę"
          leftSection={<IconPalette size={16} />}
          value={currentPaletteId}
          onChange={handlePaletteChange}
          data={selectData}
          searchable={false}
          allowDeselect={false}
          size="sm"
          renderOption={({ option }) => {
            const palette = selectData.find((p: { value: string; label: string; palette: ColorPalette }) => p.value === option.value)?.palette;
            if (!palette) return null;
            const isPaletteDark = isDarkPalette(palette.id as PaletteId);
            
            return (
              <Group justify="space-between" wrap="nowrap">
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
                {isPaletteDark ? <IconMoon size={16} /> : <IconSun size={16} />}
              </Group>
            );
          }}
          comboboxProps={{
            offset: 4,
            withinPortal: true,
            position: 'bottom',
            middlewares: { flip: false, shift: true }
          }}
        />
      </Stack>
    </Stack>
  );
} 