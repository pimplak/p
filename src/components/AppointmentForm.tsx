import { useForm } from '@mantine/form';
import { 
  Button, 
  Group, 
  Stack, 
  Select,
  NumberInput,
  Textarea,
  Checkbox,
  Text,
  Card,
  Divider
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { notifications } from '@mantine/notifications';
import { AppointmentStatus, AppointmentType, PaymentMethod } from '../types/Appointment';
import type { Appointment } from '../types/Appointment';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AppointmentForm({ appointment, onSuccess, onCancel }: AppointmentFormProps) {
  const { addAppointment, updateAppointment, loading } = useAppointmentStore();
  const { patients } = usePatientStore();

  const form = useForm({
    initialValues: {
      patientId: appointment?.patientId?.toString() || '',
      date: appointment?.date ? new Date(appointment.date) : new Date(),
      duration: appointment?.duration || 50,
      status: appointment?.status || AppointmentStatus.SCHEDULED,
      type: appointment?.type || AppointmentType.THERAPY,
      notes: appointment?.notes || '',
      price: appointment?.price || 150,
      isPaid: appointment?.paymentInfo?.isPaid || false,
      paidAt: appointment?.paymentInfo?.paidAt ? new Date(appointment.paymentInfo.paidAt) : null,
      paymentMethod: appointment?.paymentInfo?.paymentMethod || '',
      paymentNotes: appointment?.paymentInfo?.notes || '',
    },
    validate: {
      patientId: (value) => !value ? 'Wybierz pacjenta' : null,
      date: (value) => !value ? 'Wybierz datę i godzinę' : null,
      duration: (value) => !value || value < 15 ? 'Czas trwania musi być co najmniej 15 minut' : null,
      price: (value) => value < 0 ? 'Cena nie może być ujemna' : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const appointmentData = {
        patientId: parseInt(values.patientId),
        date: values.date,
        duration: values.duration,
        status: values.status,
        type: values.type,
        notes: values.notes,
        price: values.price,
        paymentInfo: {
          isPaid: values.isPaid,
          paidAt: values.isPaid && values.paidAt ? values.paidAt : undefined,
          paymentMethod: values.paymentMethod ? values.paymentMethod as PaymentMethod : undefined,
          notes: values.paymentNotes || undefined,
        },
      };

      if (appointment?.id) {
        await updateAppointment(appointment.id, appointmentData);
        notifications.show({
          title: 'Sukces',
          message: 'Wizyta została zaktualizowana',
          color: 'green',
        });
      } else {
        await addAppointment(appointmentData);
        notifications.show({
          title: 'Sukces',
          message: 'Wizyta została dodana',
          color: 'green',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Błąd podczas zapisywania wizyty:', error);
      notifications.show({
        title: 'Błąd',
        message: 'Nie udało się zapisać wizyty',
        color: 'red',
      });
    }
  };

  const patientOptions = patients.map(patient => ({
    value: patient.id?.toString() || '',
    label: `${patient.firstName} ${patient.lastName}`,
  }));

  const statusOptions = [
    { value: AppointmentStatus.SCHEDULED, label: 'Zaplanowana' },
    { value: AppointmentStatus.COMPLETED, label: 'Zakończona' },
    { value: AppointmentStatus.CANCELLED, label: 'Anulowana' },
    { value: AppointmentStatus.NO_SHOW, label: 'Nieobecność' },
    { value: AppointmentStatus.RESCHEDULED, label: 'Przełożona' },
  ];

  const typeOptions = [
    { value: AppointmentType.INITIAL, label: 'Wizyta wstępna' },
    { value: AppointmentType.FOLLOW_UP, label: 'Wizyta kontrolna' },
    { value: AppointmentType.THERAPY, label: 'Terapia' },
    { value: AppointmentType.CONSULTATION, label: 'Konsultacja' },
    { value: AppointmentType.ASSESSMENT, label: 'Ocena' },
  ];

  const paymentMethodOptions = [
    { value: PaymentMethod.CASH, label: 'Gotówka' },
    { value: PaymentMethod.CARD, label: 'Karta' },
    { value: PaymentMethod.TRANSFER, label: 'Przelew' },
    { value: PaymentMethod.OTHER, label: 'Inne' },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          label="Pacjent"
          placeholder="Wybierz pacjenta"
          required
          data={patientOptions}
          searchable
          {...form.getInputProps('patientId')}
        />

        <DateTimePicker
          label="Data i godzina"
          placeholder="Wybierz datę i godzinę"
          required
          {...form.getInputProps('date')}
        />

        <Group grow>
          <NumberInput
            label="Czas trwania (minuty)"
            placeholder="50"
            min={15}
            max={300}
            step={5}
            required
            {...form.getInputProps('duration')}
          />
          <Select
            label="Typ wizyty"
            placeholder="Wybierz typ"
            data={typeOptions}
            {...form.getInputProps('type')}
          />
        </Group>

        <Select
          label="Status"
          placeholder="Wybierz status"
          data={statusOptions}
          {...form.getInputProps('status')}
        />

        <Textarea
          label="Notatki"
          placeholder="Dodatkowe informacje o wizycie..."
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Divider my="md" />

        <Card withBorder p="md">
          <Text fw={600} mb="md">Płatność</Text>
          
          <Group grow>
            <NumberInput
              label="Cena (zł)"
              placeholder="150"
              min={0}
              step={10}
              required
              {...form.getInputProps('price')}
            />
            <Checkbox
              label="Opłacono"
              {...form.getInputProps('isPaid', { type: 'checkbox' })}
            />
          </Group>

          {form.values.isPaid && (
            <>
              <Group grow mt="md">
                <DateTimePicker
                  label="Data płatności"
                  placeholder="Kiedy opłacono?"
                  {...form.getInputProps('paidAt')}
                />
                <Select
                  label="Sposób płatności"
                  placeholder="Wybierz sposób"
                  data={paymentMethodOptions}
                  {...form.getInputProps('paymentMethod')}
                />
              </Group>

              <Textarea
                label="Notatki do płatności"
                placeholder="Dodatkowe informacje o płatności..."
                mt="md"
                {...form.getInputProps('paymentNotes')}
              />
            </>
          )}
        </Card>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Anuluj
          </Button>
          <Button type="submit" loading={loading}>
            {appointment ? 'Aktualizuj' : 'Dodaj'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 