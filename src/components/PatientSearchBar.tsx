import { TextInput, Group } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface PatientSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PatientSearchBar({
  searchQuery,
  onSearchChange,
}: PatientSearchBarProps) {
  return (
    <Group mb='md'>
      <TextInput
        placeholder='Szukaj pacjentów...'
        leftSection={<IconSearch size='1rem' />}
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        style={{ flex: 1 }}
      />
    </Group>
  );
}
