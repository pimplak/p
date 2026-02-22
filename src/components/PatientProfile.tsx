import {
  Container,
  Stack,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { usePatientStore } from '../stores/usePatientStore';
import { PatientForm } from './PatientForm';
import { PatientProfileHeader } from './PatientProfileHeader';
import { PatientProfileTabs } from './PatientProfileTabs';
import { PatientQuickInfoCards } from './PatientQuickInfoCards';
import { ArchiveConfirmationModal } from './ui/ArchiveConfirmationModal';
import { BottomSheet } from './ui/BottomSheet';
import type { Patient } from '../types/Patient';

function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            title: t('common.error'),
            message: t('patients.notifications.patientNotFound'),
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Błąd podczas ładowania pacjenta:', error);
        notifications.show({
          title: t('common.error'),
          message: t('patients.notifications.errorLoadingPatient'),
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
        title: t('common.success'),
        message: t('patients.notifications.patientArchived'),
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('patients.notifications.errorArchiving'),
        color: 'red',
      });
    }
  };

  const handleRestore = async () => {
    if (!patient?.id) return;

    try {
      await restorePatient(patient.id);
      notifications.show({
        title: t('common.success'),
        message: t('patients.notifications.patientRestored'),
        color: 'green',
      });
      // Odśwież dane pacjenta
      await loadPatient(patient.id);
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('patients.notifications.errorRestoring'),
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
            title={t('common.error')}
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

      {/* Edit Bottom Sheet */}
      <BottomSheet
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={t('patients.notifications.editPatientData')}
      >
        <PatientForm
          patient={patient}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditModalOpen(false)}
        />
      </BottomSheet>

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmationModal
        opened={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        patient={patient}
        onConfirm={handleArchive}
        utilityColors={utilityColors}
      />
    </Container>
  );
}

export default PatientProfile;
