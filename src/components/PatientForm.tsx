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
import { useTranslation } from 'react-i18next';
import { PATIENT_STATUS } from '../constants/status';
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
  const { t } = useTranslation();
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
          title: t('common.success'),
          message: t('patients.notifications.patientUpdated'),
          color: 'green',
        });
      } else {
        await addPatient(values);
        notifications.show({
          title: t('common.success'),
          message: t('patients.notifications.patientAdded'),
          color: 'green',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Błąd podczas zapisywania pacjenta:', error);
      notifications.show({
        title: t('common.error'),
        message: t('patients.notifications.errorSaving'),
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Group grow>
          <TextInput
            label={t('patientForm.firstName')}
            placeholder={t('patientForm.firstNamePlaceholder')}
            required
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label={t('patientForm.lastName')}
            placeholder={t('patientForm.lastNamePlaceholder')}
            required
            {...form.getInputProps('lastName')}
          />
        </Group>

        <TextInput
          label={t('patientForm.displayName')}
          placeholder={t('patientForm.displayNamePlaceholder')}
          {...form.getInputProps('nazwa')}
        />

        <Group grow>
          <TextInput
            label={t('patientForm.email')}
            placeholder={t('patientForm.emailPlaceholder')}
            type='email'
            {...form.getInputProps('email')}
          />
          <TextInput
            label={t('patientForm.phone')}
            placeholder={t('patientForm.phonePlaceholder')}
            {...form.getInputProps('phone')}
          />
        </Group>

        <Group grow>
          <DateInput
            label={t('patientForm.birthDate')}
            placeholder={t('patientForm.selectDate')}
            {...form.getInputProps('birthDate')}
          />
          <TextInput
            label={t('patientForm.age')}
            value={
              form.values.birthDate
                ? (() => {
                    const age = calculateAge(form.values.birthDate);
                    return age !== null ? `${age} ${t('patientForm.ageYears')}` : '';
                  })()
                : ''
            }
            placeholder='—'
            readOnly
          />
        </Group>

        <TextInput
          label={t('patientForm.address')}
          placeholder={t('patientForm.addressPlaceholder')}
          {...form.getInputProps('address')}
        />

        <Group grow>
          <TextInput
            label={t('patientForm.emergencyContact')}
            placeholder={t('patientForm.emergencyContactPlaceholder')}
            {...form.getInputProps('emergencyContact')}
          />
          <TextInput
            label={t('patientForm.emergencyPhone')}
            placeholder={t('patientForm.phonePlaceholder')}
            {...form.getInputProps('emergencyPhone')}
          />
        </Group>

        <Group grow>
          <Select
            label={t('patientForm.status')}
            placeholder={t('patientForm.statusPlaceholder')}
            data={[
              {
                value: PATIENT_STATUS.ACTIVE,
                label: t('status.patient.active'),
              },
              {
                value: PATIENT_STATUS.ARCHIVED,
                label: t('status.patient.archived'),
              },
            ]}
            {...form.getInputProps('status')}
          />
          <TagsInput
            label={t('patientForm.tags')}
            placeholder={t('patientForm.tagsPlaceholder')}
            {...form.getInputProps('tags')}
          />
        </Group>

        <Group justify='flex-end' mt='md'>
          <Button variant='light' onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button type='submit' loading={loading}>
            {patient ? t('common.update') : t('common.add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
