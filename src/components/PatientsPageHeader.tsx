import { Title, Button, Group, Switch } from '@mantine/core';
import { 
  IconDownload, 
  IconPlus, 
  IconArchive,
  IconArchiveOff 
} from '@tabler/icons-react';

interface PatientsPageHeaderProps {
  showArchived: boolean;
  onToggleArchived: () => void;
  onExport: () => void;
  onAddPatient: () => void;
}

export function PatientsPageHeader({
  showArchived,
  onToggleArchived,
  onExport,
  onAddPatient
}: PatientsPageHeaderProps) {
  return (
    <Group justify="space-between" wrap="wrap">
      <Title order={1}>Pacjenci</Title>
      <Group gap="xs" visibleFrom="md">
        <Switch
          label="Pokaż zarchiwizowanych"
          checked={showArchived}
          onChange={onToggleArchived}
          thumbIcon={
            showArchived ? (
              <IconArchiveOff size="0.8rem" stroke={3} />
            ) : (
              <IconArchive size="0.8rem" stroke={3} />
            )
          }
        />
        <Button 
          leftSection={<IconDownload size="1rem" />} 
          variant="light"
          onClick={onExport}
        >
          Eksport
        </Button>
        <Button 
          leftSection={<IconPlus size="1rem" />} 
          onClick={onAddPatient}
        >
          Dodaj pacjenta
        </Button>
      </Group>
    </Group>
  );
} 