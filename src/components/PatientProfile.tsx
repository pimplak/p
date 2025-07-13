import {
  Container,
  Stack,
  Modal,
  LoadingOverlay,
  Alert,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { usePatientStore } from '../stores/usePatientStore';
import { getPatientDisplayName } from '../utils/dates';
import { PatientForm } from './PatientForm';
import { PatientProfileHeader } from './PatientProfileHeader';
import { PatientProfileTabs } from './PatientProfileTabs';
import { PatientQuickInfoCards } from './PatientQuickInfoCards';
import type { Patient } from '../types/Patient';

function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { utilityColors } = useTheme();
  const { getPatient, archivePatient, restorePatient, loading, error } =
    usePatientStore();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const loadPatient = useCallback(
    async (patientId: number) => {
      try {
        const patientData = await getPatient(patientId);
        if (patientData) {
          setPatient(patientData);
        } else {
          navigate('/patients', { replace: true });
          notifications.show({
            title: 'Błąd',
            message: 'Nie znaleziono pacjenta',
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Błąd podczas ładowania pacjenta:', error);
        notifications.show({
          title: 'Błąd',
          message: 'Nie udało się załadować danych pacjenta',
          color: 'red',
        });
      }
    },
    [getPatient, navigate]
  );

  useEffect(() => {
    if (id) {
      loadPatient(parseInt(id));
    }
  }, [id, loadPatient]);

  const handleArchive = async () => {
    if (!patient?.id) return;

    try {
      await archivePatient(patient.id);
      setArchiveModalOpen(false);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został zarchiwizowany',
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zarchiwizować pacjenta',
        color: 'red',
      });
    }
  };

  const handleRestore = async () => {
    if (!patient?.id) return;

    try {
      await restorePatient(patient.id);
      notifications.show({
        title: 'Sukces',
        message: 'Pacjent został przywrócony',
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się przywrócić pacjenta',
        color: 'red',
      });
    }
  };

  const handleEditSuccess = async () => {
    setEditModalOpen(false);
    if (patient?.id) {
      await loadPatient(patient.id);
    }
  };

  if (!patient) {
    return (
      <Container size='lg'>
        <LoadingOverlay visible={loading} />
        {error && (
          <Alert
            icon={<IconAlertCircle size='1rem' />}
            title='Błąd'
            color={utilityColors.error}
          >
            {error}
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container size='lg'>
      <Stack gap='md'>
        <PatientProfileHeader
          patient={patient}
          onEdit={() => setEditModalOpen(true)}
          onArchive={() => setArchiveModalOpen(true)}
          onRestore={handleRestore}
        />

        <PatientQuickInfoCards patient={patient} />

        <PatientProfileTabs patient={patient} />
      </Stack>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title='Edytuj dane pacjenta'
        size='lg'
      >
        <PatientForm
          patient={patient}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        opened={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
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
            <Button variant='light' onClick={() => setArchiveModalOpen(false)}>
              Anuluj
            </Button>
            <Button color={utilityColors.error} onClick={handleArchive}>
              Archiwizuj
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default PatientProfile;
