import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Modal,
  LoadingOverlay,
  Alert,
  Text,
  Group,
  Button
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientForm } from './PatientForm';
import { PatientProfileHeader } from './PatientProfileHeader';
import { PatientQuickInfoCards } from './PatientQuickInfoCards';
import { PatientProfileTabs } from './PatientProfileTabs';
import { notifications } from '@mantine/notifications';
import type { Patient } from '../types/Patient';

export function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPatient, archivePatient, restorePatient, loading, error } = usePatientStore();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadPatient(parseInt(id));
    }
  }, [id]);

  const loadPatient = async (patientId: number) => {
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
  };

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
      <Container size="lg">
        <LoadingOverlay visible={loading} />
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Błąd" color="red">
            {error}
          </Alert>
        )}
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="md">
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
        title="Edytuj dane pacjenta"
        size="lg"
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
        title="Potwierdź archiwizację"
        size="sm"
      >
        <Stack gap="md">
          <Text>
            Czy na pewno chcesz zarchiwizować pacjenta{' '}
            <strong>{patient.firstName} {patient.lastName}</strong>?
          </Text>
          <Text size="sm" c="dimmed">
            Pacjent zostanie ukryty z głównej listy, ale wszystkie dane
            będą zachowane i można będzie go przywrócić w każdej chwili.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setArchiveModalOpen(false)}>
              Anuluj
            </Button>
            <Button color="red" onClick={handleArchive}>
              Archiwizuj
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 