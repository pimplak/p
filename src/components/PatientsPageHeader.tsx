import { Title, Group, Button, Switch } from '@mantine/core';
import { IconPlus, IconDownload, IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { useTheme } from '../hooks/useTheme';

interface PatientsPageHeaderProps {
  showArchived: boolean;
  onToggleArchived: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onAddPatient: () => void;
}

export function PatientsPageHeader({
  showArchived,
  onToggleArchived,
  onExport,
  onAddPatient
}: PatientsPageHeaderProps) {
  const { mantineTheme } = useTheme();

  return (
    <Group justify="space-between" wrap="wrap">
      <Title order={1}>Pacjenci</Title>
      <Group gap={mantineTheme?.spacing?.sm || 'sm'} visibleFrom="md">
        <Switch
          label="Pokaż zarchiwizowanych"
          checked={showArchived}
          onChange={onToggleArchived}
          size={mantineTheme?.other?.defaultSizes?.input || 'sm'}
          thumbIcon={
            showArchived ? (
              <IconArchiveOff size={mantineTheme?.other?.iconSizes?.xs || 14} stroke={3} />
            ) : (
              <IconArchive size={mantineTheme?.other?.iconSizes?.xs || 14} stroke={3} />
            )
          }
        />
        <Button 
          leftSection={<IconDownload size={mantineTheme?.other?.iconSizes?.sm || 16} />} 
          variant="light"
          size={mantineTheme?.other?.defaultSizes?.button || 'sm'}
          onClick={onExport}
        >
          Eksport
        </Button>
        <Button 
          leftSection={<IconPlus size={mantineTheme?.other?.iconSizes?.sm || 16} />} 
          size={mantineTheme?.other?.defaultSizes?.button || 'sm'}
          onClick={onAddPatient}
        >
          Dodaj pacjenta
        </Button>
      </Group>
    </Group>
  );
} 