import { useForm } from '@mantine/form';
import { 
  TextInput, 
  Button, 
  Group, 
  Stack, 
  Textarea 
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { usePatientStore } from '../stores/usePatientStore';
import { notifications } from '@mantine/notifications';
import { PatientFormSchema, type PatientFormData } from '../schemas';
import type { Patient } from '../types/Patient';
import { ZodError } from 'zod';

interface PatientFormProps {
  patient?: Patient | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PatientForm({ patient, onSuccess, onCancel }: PatientFormProps) {
  const { addPatient, updatePatient, loading } = usePatientStore();

  const form = useForm<PatientFormData>({
    initialValues: {
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      birthDate: patient?.birthDate ? (typeof patient.birthDate === 'string' ? new Date(patient.birthDate) : patient.birthDate) : undefined,
      address: patient?.address || '',
      emergencyContact: patient?.emergencyContact || '',
      emergencyPhone: patient?.emergencyPhone || '',
      notes: patient?.notes || '',
    },
    validate: (values) => {
      try {
        PatientFormSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof ZodError) {
          const errors: Record<string, string> = {};
          
          error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (field && !errors[field as string]) {
              errors[field as string] = issue.message;
            }
          });
          
          return errors;
        }
        return {};
      }
    },
  });

  const handleSubmit = async (values: PatientFormData) => {
    try {
      // Validate with Zod before submitting
      const validatedData = PatientFormSchema.parse(values);
      
      if (patient?.id) {
        await updatePatient(patient.id, validatedData);
        notifications.show({
          title: 'Sukces',
          message: 'Dane pacjenta zostały zaktualizowane',
          color: 'green',
        });
      } else {
        await addPatient(validatedData);
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
      <Stack>
        <Group grow>
          <TextInput
            label="Imię"
            placeholder="Wprowadź imię"
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Nazwisko"
            placeholder="Wprowadź nazwisko"
            required
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            type="email"
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Telefon"
            placeholder="+48 123 456 789"
            {...form.getInputProps('phone')}
          />
        </Group>

        <DateInput
          label="Data urodzenia"
          placeholder="Wybierz datę"
          {...form.getInputProps('birthDate')}
        />

        <TextInput
          label="Adres"
          placeholder="Ulica, miasto, kod pocztowy"
          {...form.getInputProps('address')}
        />

        <Group grow>
          <TextInput
            label="Kontakt awaryjny"
            placeholder="Imię i nazwisko"
            {...form.getInputProps('emergencyContact')}
          />
          <TextInput
            label="Telefon awaryjny"
            placeholder="+48 123 456 789"
            {...form.getInputProps('emergencyPhone')}
          />
        </Group>

        <Textarea
          label="Notatki"
          placeholder="Dodatkowe informacje o pacjencie..."
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" loading={loading}>
            {patient ? 'Aktualizuj' : 'Dodaj'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 