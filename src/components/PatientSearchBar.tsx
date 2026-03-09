import { TextInput, Group, Text , ActionIcon } from '@mantine/core';
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

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
        <ActionIcon
          variant='subtle'
          size='lg'
          style={{
            color: `${currentPalette.text}50`,
            border: `1px solid ${currentPalette.text}12`,
            borderRadius: 10,
          }}
        >
          <IconAdjustmentsHorizontal size={18} />
        </ActionIcon>
      </Group>
      {totalCount !== undefined && (
        <Group justify='space-between' mb='sm'>
          <Text size='xs' fw={700} style={{ color: `${currentPalette.text}50`, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t('patients.allPatients')}
          </Text>
          <Text size='xs' style={{ color: `${currentPalette.text}40` }}>
            {t('patients.total')} {totalCount}
          </Text>
        </Group>
      )}
    </div>
  );
}
