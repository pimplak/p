import { Card, Alert, Skeleton, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconUser, IconPlus, IconDownload } from '@tabler/icons-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { ExportModal } from '../components/ExportModal';
import {
  FloatingActionButton,
  type FABAction,
} from '../components/FloatingActionButton';
import { PatientForm } from '../components/PatientForm';
import { PatientsCardList } from '../components/PatientsCardList';
import { PatientSearchBar } from '../components/PatientSearchBar';
import { PatientsPageHeader } from '../components/PatientsPageHeader';
import { PatientTable } from '../components/PatientTable';
import { ArchiveConfirmationModal } from '../components/ui/ArchiveConfirmationModal';
import { BottomSheet } from '../components/ui/BottomSheet';
import { useExport } from '../hooks/useExport';
import { useTheme } from '../hooks/useTheme';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import type { Patient } from '../types/Patient';

function PatientsPage() {
  const navigate = useNavigate();
  const { utilityColors } = useTheme();
  const {
    patients,
    fetchPatients,
    archivePatient,
    restorePatient,
    showArchived,
    toggleShowArchived,
    loading,
    error,
  } = usePatientStore();

  const { appointments, fetchAppointments } = useAppointmentStore();

  const [opened, { open, close }] = useDisclosure(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [archiveModalOpened, setArchiveModalOpened] = useState(false);
  const [patientToArchive, setPatientToArchive] = useState<Patient | null>(null);
  const { exportOpened, handleExport, handleExportData, closeExport } = useExport(
    patients,
    appointments
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search query - 300ms throttling
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const filteredPatients = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return patients;

    const query = debouncedSearchQuery.toLowerCase();
    return patients.filter(
      patient =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email?.toLowerCase().includes(query) ||
        patient.phone?.includes(query) ||
        patient.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [patients, debouncedSearchQuery]);

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, [fetchPatients, fetchAppointments]);

  const handleAddPatient = useCallback(() => {
    setEditingPatient(undefined);
    open();
  }, [open]);

  const handleEditPatient = useCallback(
    (patient: Patient) => {
      setEditingPatient(patient);
      open();
    },
    [open]
  );

  const handleViewPatient = useCallback(
    (patient: Patient) => {
      navigate(`/patients/${patient.id}`);
    },
    [navigate]
  );

  const handleArchivePatient = useCallback(
    (id: number) => {
      const patient = patients.find(p => p.id === id);
      if (patient) {
        setPatientToArchive(patient);
        setArchiveModalOpened(true);
      }
    },
    [patients]
  );

  const handleConfirmArchive = useCallback(
    async () => {
      if (!patientToArchive?.id) return;

      try {
        await archivePatient(patientToArchive.id);
        notifications.show({
          title: 'Sukces',
          message: 'Pacjent został zarchiwizowany',
          color: 'green',
        });
        setArchiveModalOpened(false);
        setPatientToArchive(null);
      } catch {
        notifications.show({
          title: 'Błąd',
          message: 'Nie udało się zarchiwizować pacjenta',
          color: 'red',
        });
      }
    },
    [archivePatient, patientToArchive]
  );

  const handleRestorePatient = useCallback(
    async (id: number) => {
      try {
        await restorePatient(id);
        notifications.show({
          title: 'Sukces',
          message: 'Pacjent został przywrócony',
          color: 'green',
        });
      } catch {
        notifications.show({
          title: 'Błąd',
          message: 'Nie udało się przywrócić pacjenta',
          color: 'red',
        });
      }
    },
    [restorePatient]
  );

  const handleFormSuccess = () => {
    close();
    setEditingPatient(undefined);
  };



  // FAB Actions dla mobile
  const fabActions: FABAction[] = [
    {
      id: 'add-patient',
      icon: <IconPlus size='1.2rem' />,
      label: 'Dodaj pacjenta',
      color: 'yellowGreen',
      onClick: handleAddPatient,
    },
    {
      id: 'export',
      icon: <IconDownload size='1.2rem' />,
      label: 'Eksport',
      color: 'blue',
      onClick: handleExport,
    },
  ];

  if (loading) {
    return (
      <Container fluid>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} height={120} />
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert color={utilityColors.error} title='Błąd'>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PatientsPageHeader
        showArchived={showArchived}
        onToggleArchived={toggleShowArchived}
        onExport={handleExport}
        onAddPatient={handleAddPatient}
      />

      <Card>
        <PatientSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredPatients.length === 0 ? (
          <Alert icon={<IconUser size='1rem' />} title='Brak pacjentów'>
            {debouncedSearchQuery
              ? 'Nie znaleziono pacjentów pasujących do wyszukiwania.'
              : showArchived
                ? 'Nie masz żadnych zarchiwizowanych pacjentów.'
                : 'Nie masz jeszcze żadnych aktywnych pacjentów. Dodaj pierwszego!'}
          </Alert>
        ) : (
          <>
            <PatientsCardList
              patients={filteredPatients}
              onEdit={handleEditPatient}
              onView={handleViewPatient}
              onArchive={handleArchivePatient}
              onRestore={handleRestorePatient}
            />

            <PatientTable
              patients={filteredPatients}
              onEdit={handleEditPatient}
              onView={handleViewPatient}
              onArchive={handleArchivePatient}
              onRestore={handleRestorePatient}
            />
          </>
        )}
      </Card>

      {/* Patient Form Bottom Sheet */}
      <BottomSheet
        opened={opened}
        onClose={close}
        title={editingPatient ? 'Edytuj pacjenta' : 'Dodaj pacjenta'}
      >
        <PatientForm
          patient={editingPatient}
          onSuccess={handleFormSuccess}
          onCancel={close}
        />
      </BottomSheet>

      {/* Export Modal */}
      <ExportModal
        opened={exportOpened}
        onClose={closeExport}
        filteredPatients={filteredPatients}
        onExport={handleExportData}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmationModal
        opened={archiveModalOpened}
        onClose={() => {
          setArchiveModalOpened(false);
          setPatientToArchive(null);
        }}
        patient={patientToArchive}
        onConfirm={handleConfirmArchive}
        utilityColors={utilityColors}
      />

      {/* Floating Action Button for mobile */}
      <FloatingActionButton actions={fabActions} />
    </Container>
  );
}

export default PatientsPage;
