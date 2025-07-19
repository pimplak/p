import {
  Select,
  Group,
  Text,
  ColorSwatch,
  Stack,
  Switch,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconPalette,
  IconSun,
  IconMoon,
  IconMoonStars,
} from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';
import {
  isDarkPalette,
  type ColorPalette,
  type PaletteId,
} from '../types/theme';

export function ThemeSelector() {
  const {
    currentPaletteId,
    setPalette,
    getAllPalettes,
    isDark,
    currentPalette,
  } = useTheme();

  const palettes = getAllPalettes();

  // Prepare select data with custom rendering
  const selectData = palettes.map((palette: ColorPalette) => ({
    value: palette.id,
    label: palette.name,
    palette: palette,
  }));

  const handlePaletteChange = (value: string | null) => {
    if (value) {
      const validPalette = palettes.find((p: ColorPalette) => p.id === value);
      if (validPalette) {
        setPalette(value as PaletteId);
      }
    }
  };

  // Smart dark/light mode toggle
  const toggleDarkMode = (checked: boolean) => {
    if (checked) {
      // Przełącz na ciemną wersję obecnego motywu lub domyślną ciemną
      const currentPalette = palettes.find(p => p.id === currentPaletteId);
      if (currentPalette) {
        const darkVersion = getDarkVersion(currentPaletteId);
        setPalette(darkVersion);
      } else {
        setPalette('darkpro');
      }
    } else {
      // Przełącz na jasną wersję obecnego motywu lub domyślną jasną
      const lightVersion = getLightVersion(currentPaletteId);
      setPalette(lightVersion);
    }
  };

  // Helper do znajdowania ciemnej wersji motywu
  const getDarkVersion = (paletteId: string): PaletteId => {
    const darkMap: Record<string, PaletteId> = {
      'earthy': 'earthyDark',
      'ocean': 'oceanDark', 
      'vibrant': 'vibrantDark',
      'arctic': 'darkpro',
      'springblush': 'darkpro',
      'forest': 'darkpro',
      'sunset': 'darkpro',
      'pastel': 'darkpro',
      'bold': 'darkpro',
    };
    return darkMap[paletteId] || 'darkpro';
  };

  // Helper do znajdowania jasnej wersji motywu
  const getLightVersion = (paletteId: string): PaletteId => {
    const lightMap: Record<string, PaletteId> = {
      'earthyDark': 'earthy',
      'oceanDark': 'ocean',
      'vibrantDark': 'vibrant',
      'darkpro': 'arctic',
    };
    return lightMap[paletteId] || 'arctic';
  };

  const handleNextTheme = () => {
    const currentIndex = palettes.findIndex(
      (p: ColorPalette) => p.id === currentPaletteId
    );
    const nextIndex = (currentIndex + 1) % palettes.length;
    setPalette(palettes[nextIndex].id as PaletteId);
  };

  const getThemeIcon = () => {
    switch (currentPaletteId) {
      case 'arctic':
        return <IconSun size={18} color={currentPalette.accent} />;
      case 'springblush':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'darkpro':
        return <IconMoon size={18} color={currentPalette.primary} />;
      case 'earthy':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'forest':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'sunset':
        return <IconSun size={18} color={currentPalette.accent} />;
      case 'ocean':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'vibrant':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'pastel':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'bold':
        return <IconPalette size={18} color={currentPalette.primary} />;
      case 'earthyDark':
        return <IconMoon size={18} color={currentPalette.primary} />;
      case 'oceanDark':
        return <IconMoon size={18} color={currentPalette.primary} />;
      case 'vibrantDark':
        return <IconMoon size={18} color={currentPalette.primary} />;
      default:
        return <IconPalette size={18} color={currentPalette.primary} />;
    }
  };

  const getTooltipText = () => {
    const currentIndex = palettes.findIndex(
      (p: ColorPalette) => p.id === currentPaletteId
    );
    const nextIndex = (currentIndex + 1) % palettes.length;
    const nextPalette = palettes[nextIndex];
    return `Zmień na: ${nextPalette.name}`;
  };

  return (
    <Stack gap='md'>
      {/* Quick Dark/Light Toggle */}
      <Group justify='space-between' align='center'>
        <Group gap='sm'>
          <Tooltip label={getTooltipText()} withArrow>
            <ActionIcon
              onClick={handleNextTheme}
              size='lg'
              variant='subtle'
              style={{
                backgroundColor: `${currentPalette.primary}20`,
                color: currentPalette.primary,
              }}
              styles={{
                root: {
                  '&:hover': {
                    backgroundColor: `${currentPalette.accent}30`,
                    color: currentPalette.accent,
                  },
                },
              }}
            >
              {getThemeIcon()}
            </ActionIcon>
          </Tooltip>
          <Switch
            checked={isDark}
            onChange={event => toggleDarkMode(event.currentTarget.checked)}
            onLabel={
              <IconSun size={16} stroke={2.5} color={currentPalette.text} />
            }
            offLabel={
              <IconMoonStars
                size={16}
                stroke={2.5}
                color={currentPalette.accent}
              />
            }
            size='md'
          />
        </Group>
        <Text size='sm' fw={500} c='dimmed'>
          {isDark ? 'Tryb ciemny' : 'Tryb jasny'}
        </Text>
      </Group>

      {/* Full Theme Selector */}
      <Stack gap='xs'>
        <Text size='sm' fw={500}>
          Motyw kolorystyczny
        </Text>
        <Select
          placeholder='Wybierz paletę'
          leftSection={<IconPalette size={16} />}
          value={currentPaletteId}
          onChange={handlePaletteChange}
          data={selectData}
          searchable={false}
          allowDeselect={false}
          size='sm'
          renderOption={({ option }) => {
            const palette = selectData.find(
              (p: { value: string; label: string; palette: ColorPalette }) =>
                p.value === option.value
            )?.palette;
            if (!palette) return null;
            const isPaletteDark = isDarkPalette(palette.id as PaletteId);

            return (
              <Group justify='space-between' wrap='nowrap'>
                <Group gap='sm'>
                  <Group gap={2}>
                    <ColorSwatch color={palette.background} size={12} />
                    <ColorSwatch color={palette.surface} size={12} />
                    <ColorSwatch color={palette.primary} size={12} />
                    <ColorSwatch color={palette.accent} size={12} />
                    <ColorSwatch color={palette.text} size={12} />
                  </Group>
                  <Text size='sm'>{palette.name}</Text>
                </Group>
                {isPaletteDark ? <IconMoon size={16} /> : <IconSun size={16} />}
              </Group>
            );
          }}
          comboboxProps={{
            offset: 4,
            withinPortal: true,
            position: 'bottom',
            middlewares: { flip: false, shift: true },
          }}
        />
      </Stack>
    </Stack>
  );
}
