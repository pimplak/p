import {
  Modal,
  Stack,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { getPatientDisplayName } from '../../utils/dates';
import type { Patient } from '../../types/Patient';

interface ArchiveConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  patient: Patient | null;
  onConfirm: () => void;
  utilityColors: {
    error: string;
  };
}

export function ArchiveConfirmationModal({
  opened,
  onClose,
  patient,
  onConfirm,
  utilityColors,
}: ArchiveConfirmationModalProps) {
  if (!patient) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Potwierdź archiwizację'
      size='sm'
    >
      <Stack gap='md'>
        <Text>
          Czy na pewno chcesz zarchiwizować pacjenta{' '}
          <strong>{getPatientDisplayName(patient)}</strong>?
        </Text>
        <Text size='sm' c='dimmed'>
          Pacjent zostanie ukryty z głównej listy, ale wszystkie dane będą
          zachowane i można będzie go przywrócić w każdej chwili.
        </Text>
        <Group justify='flex-end'>
          <Button variant='light' onClick={onClose}>
            Anuluj
          </Button>
          <Button color={utilityColors.error} onClick={onConfirm}>
            Archiwizuj
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 