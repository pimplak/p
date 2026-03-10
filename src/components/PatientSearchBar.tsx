import { TextInput, Group, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch, IconArchive, IconArchiveOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { usePatientStore } from '../stores/usePatientStore';

interface PatientSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount?: number;
}

export function PatientSearchBar({
  searchQuery,
  onSearchChange,
  totalCount,
}: PatientSearchBarProps) {
  const { t } = useTranslation();
  const { currentPalette } = useTheme();
  const { showArchived, toggleShowArchived } = usePatientStore();

  return (
    <div>
      <Group gap='sm' mb='md'>
        <TextInput
          id='patient-search-input'
          placeholder={t('patients.searchPlaceholder')}
          leftSection={<IconSearch size={16} style={{ color: `${currentPalette.text}40` }} />}
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{ flex: 1 }}
          styles={{
            input: {
              backgroundColor: `${currentPalette.text}06`,
              border: `1px solid ${currentPalette.text}12`,
              borderRadius: 10,
              fontSize: 14,
            },
          }}
        />
        <Tooltip label={showArchived ? t('patients.hideArchived') : t('patients.showArchived')}>
          <ActionIcon
            variant={showArchived ? 'filled' : 'subtle'}
            size='lg'
            onClick={toggleShowArchived}
            style={{
              color: showArchived ? currentPalette.surface : `${currentPalette.text}50`,
              backgroundColor: showArchived ? currentPalette.primary : 'transparent',
              border: showArchived ? 'none' : `1px solid ${currentPalette.text}12`,
              borderRadius: 10,
            }}
          >
            {showArchived ? <IconArchiveOff size={18} /> : <IconArchive size={18} />}
          </ActionIcon>
        </Tooltip>
      </Group>
      {totalCount !== undefined && (
        <Group justify='space-between' mb='sm'>
          <Text size='xs' fw={700} style={{ color: `${currentPalette.text}50`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {showArchived ? t('patients.showArchived') : t('patients.allPatients')}
          </Text>
          <Text size='xs' style={{ color: `${currentPalette.text}40` }}>
            {t('patients.total')} {totalCount}
          </Text>
        </Group>
      )}
    </div>
  );
}
