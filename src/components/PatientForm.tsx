import {
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  TagsInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { PATIENT_STATUS, PATIENT_STATUS_LABELS } from '../constants/status';
import { PatientFormSchema, type PatientFormData } from '../schemas';
import { usePatientStore } from '../stores/usePatientStore';
import { calculateAge } from '../utils/dates';
import type { Patient } from '../types/Patient';

interface PatientFormProps {
  patient?: Patient | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PatientForm({
  patient,
  onSuccess,
  onCancel,
}: PatientFormProps) {
  const { addPatient, updatePatient, loading } = usePatientStore();

  const form = useForm<PatientFormData>({
    initialValues: {
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      nazwa: patient?.nazwa || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      birthDate: patient?.birthDate
        ? typeof patient.birthDate === 'string'
          ? new Date(patient.birthDate)
          : patient.birthDate
        : undefined,
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      emergencyPhone: patient?.emergencyPhone || '',
      status: patient?.status || PATIENT_STATUS.ACTIVE,
      tags: patient?.tags || [],
    },
    validate: zodResolver(PatientFormSchema),
  });

  const handleSubmit = async (values: PatientFormData) => {
    try {
      if (patient?.id) {
        await updatePatient(patient.id, values);
        notifications.show({
          title: 'Sukces',
          message: 'Dane pacjenta zostały zaktualizowane',
          color: 'green',
        });
      } else {
        await addPatient(values);
        notifications.show({
          title: 'Sukces',
          message: 'Pacjent został dodany',
          color: 'green',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Błąd podczas zapisywania pacjenta:', error);
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zapisać danych pacjenta',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label='Imię'
            placeholder='Wprowadź imię'
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label='Nazwisko'
            placeholder='Wprowadź nazwisko'
            required
            {...form.getInputProps('lastName')}
          />
        </Group>

        <TextInput
          label='Nazwa wyświetlana (opcjonalnie)'
          placeholder='Jeśli nie podano, będzie używane imię i nazwisko'
          {...form.getInputProps('nazwa')}
        />

        <Group grow>
          <TextInput
            label='Email'
            placeholder='email@example.com'
            type='email'
            {...form.getInputProps('email')}
          />
          <TextInput
            label='Telefon'
            placeholder='+48 123 456 789'
            {...form.getInputProps('phone')}
          />
        </Group>

        <Group grow>
          <DateInput
            label='Data urodzenia'
            placeholder='Wybierz datę'
            {...form.getInputProps('birthDate')}
          />
          <TextInput
            label='Wiek'
            value={
              form.values.birthDate
                ? (() => {
                    const age = calculateAge(form.values.birthDate);
                    return age !== null ? `${age} lat` : '';
                  })()
                : ''
            }
            placeholder='—'
            readOnly
          />
        </Group>

        <TextInput
          label='Adres'
          placeholder='Ulica, miasto, kod pocztowy'
          {...form.getInputProps('address')}
        />

        <Group grow>
          <TextInput
            label='Kontakt awaryjny'
            placeholder='Imię i nazwisko'
            {...form.getInputProps('emergencyContact')}
          />
          <TextInput
            label='Telefon awaryjny'
            placeholder='+48 123 456 789'
            {...form.getInputProps('emergencyPhone')}
          />
        </Group>

        <Group grow>
          <Select
            label='Status'
            placeholder='Wybierz status'
            data={[
              {
                value: PATIENT_STATUS.ACTIVE,
                label: PATIENT_STATUS_LABELS[PATIENT_STATUS.ACTIVE],
              },
              {
                value: PATIENT_STATUS.ARCHIVED,
                label: PATIENT_STATUS_LABELS[PATIENT_STATUS.ARCHIVED],
              },
            ]}
            {...form.getInputProps('status')}
          />
          <TagsInput
            label='Tagi'
            placeholder='Dodaj tagi (np. terapia par, CBT)'
            {...form.getInputProps('tags')}
          />
        </Group>

        <Group justify='flex-end' mt='md'>
          <Button variant='light' onClick={onCancel}>
            Anuluj
          </Button>
          <Button type='submit' loading={loading}>
            {patient ? 'Aktualizuj' : 'Dodaj'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
