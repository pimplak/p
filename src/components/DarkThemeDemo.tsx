import { Stack, Card, Text, Group, Badge, Button, ThemeIcon } from '@mantine/core';
import { IconMoon, IconSun, IconPalette, IconCheck } from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';
import { isDarkPalette, type ColorPalette, type PaletteId } from '../types/theme';

export function DarkThemeDemo() {
  const { isDark, currentPalette, setPalette, getAllPalettes } = useTheme();

  const darkPalettes = getAllPalettes().filter((p: ColorPalette) => isDarkPalette(p.id as PaletteId));
  const lightPalettes = getAllPalettes().filter((p: ColorPalette) => !isDarkPalette(p.id as PaletteId));

  return (
    <Stack gap="lg">
      <Card>
        <Group justify="space-between" align="center" mb="md">
          <Group>
            <ThemeIcon 
              size="lg" 
              variant="light"
              style={{ 
                backgroundColor: isDark ? 'var(--color-accent)' : 'var(--color-primary)',
                color: 'white'
              }}
            >
              {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
            </ThemeIcon>
            <div>
              <Text fw={600} size="lg" style={{ color: 'var(--color-text)' }}>
                Aktualny motyw: {currentPalette.name}
              </Text>
              <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                {isDark ? 'Tryb ciemny' : 'Tryb jasny'}
              </Text>
            </div>
          </Group>
          <Badge 
            variant="light" 
            size="lg"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'white'
            }}
          >
            {isDark ? 'DARK' : 'LIGHT'}
          </Badge>
        </Group>

        <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
          Ferro's Advanced Theme System - Brutalne wsparcie dla dark mode z dynamicznymi CSS variables
        </Text>
      </Card>

      <Group grow>
        <Card>
          <Text fw={600} mb="md" style={{ color: 'var(--color-text)' }}>
            Motywy ciemne
          </Text>
          <Stack gap="xs">
            {darkPalettes.map((palette: ColorPalette) => (
              <Button
                key={palette.id}
                variant={currentPalette.id === palette.id ? 'filled' : 'light'}
                leftSection={
                  currentPalette.id === palette.id ? 
                    <IconCheck size={16} /> : 
                    <IconPalette size={16} />
                }
                onClick={() => setPalette(palette.id as PaletteId)}
                size="sm"
                justify="flex-start"
              >
                {palette.name}
              </Button>
            ))}
          </Stack>
        </Card>

        <Card>
          <Text fw={600} mb="md" style={{ color: 'var(--color-text)' }}>
            Motywy jasne
          </Text>
          <Stack gap="xs">
            {lightPalettes.map((palette: ColorPalette) => (
              <Button
                key={palette.id}
                variant={currentPalette.id === palette.id ? 'filled' : 'light'}
                leftSection={
                  currentPalette.id === palette.id ? 
                    <IconCheck size={16} /> : 
                    <IconPalette size={16} />
                }
                onClick={() => setPalette(palette.id as PaletteId)}
                size="sm"
                justify="flex-start"
              >
                {palette.name}
              </Button>
            ))}
          </Stack>
        </Card>
      </Group>
    </Stack>
  );
} 