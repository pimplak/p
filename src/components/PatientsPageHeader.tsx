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
      <Group gap={mantineTheme.spacing.sm} visibleFrom="md">
        <Switch
          label="Pokaż zarchiwizowanych"
          checked={showArchived}
          onChange={onToggleArchived}
          size={mantineTheme.other.defaultSizes.input}
          thumbIcon={
            showArchived ? (
              <IconArchiveOff size={mantineTheme.other.iconSizes.xs} stroke={3} />
            ) : (
              <IconArchive size={mantineTheme.other.iconSizes.xs} stroke={3} />
            )
          }
        />
        <Button 
          leftSection={<IconDownload size={mantineTheme.other.iconSizes.sm} />} 
          variant="light"
          size={mantineTheme.other.defaultSizes.button}
          onClick={onExport}
        >
          Eksport
        </Button>
        <Button 
          leftSection={<IconPlus size={mantineTheme.other.iconSizes.sm} />} 
          size={mantineTheme.other.defaultSizes.button}
          onClick={onAddPatient}
        >
          Dodaj pacjenta
        </Button>
      </Group>
    </Group>
  );
} 