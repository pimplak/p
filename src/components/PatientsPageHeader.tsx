import { Title, Group, Button, Switch } from '@mantine/core';
import { IconPlus, IconDownload, IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { DESIGN_SYSTEM, getIconSize } from '../theme/designSystem';

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
  return (
    <Group justify="space-between" wrap="wrap">
      <Title order={1}>Pacjenci</Title>
      <Group gap={DESIGN_SYSTEM.spacing.sm} visibleFrom="md">
        <Switch
          label="Pokaż zarchiwizowanych"
          checked={showArchived}
          onChange={onToggleArchived}
          size={DESIGN_SYSTEM.sizes.input}
          thumbIcon={
            showArchived ? (
              <IconArchiveOff size={getIconSize('xs')} stroke={3} />
            ) : (
              <IconArchive size={getIconSize('xs')} stroke={3} />
            )
          }
        />
        <Button 
          leftSection={<IconDownload size={getIconSize('sm')} />} 
          variant="light"
          size={DESIGN_SYSTEM.sizes.button}
          onClick={onExport}
        >
          Eksport
        </Button>
        <Button 
          leftSection={<IconPlus size={getIconSize('sm')} />} 
          size={DESIGN_SYSTEM.sizes.button}
          onClick={onAddPatient}
        >
          Dodaj pacjenta
        </Button>
      </Group>
    </Group>
  );
} 