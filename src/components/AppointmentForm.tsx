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
  Divider,
  SegmentedControl,
  Input,
  Box,
  ScrollArea,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { DEFAULT_APPOINTMENT_PRICE } from '../constants/business';
import { APPOINTMENT_STATUS } from '../constants/status';
import { type AppointmentFormData } from '../schemas';
import { useAppointmentStore } from '../stores/useAppointmentStore';
import { usePatientStore } from '../stores/usePatientStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import {
  AppointmentStatus,
  AppointmentType,
  PaymentMethod,
} from '../types/Appointment';
import { getPatientDisplayName, toDate } from '../utils/dates';
import type { Appointment } from '../types/Appointment';

interface AppointmentFormProps {
  appointment?: Appointment | null;
  initialDate?: Date | null;
  initialPatientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  patientId: string;
  date: Date | string;
  duration: number;
  status: string;
  type?: string;
  notes?: string;
  price?: number;
  paymentInfo?: {
    isPaid: boolean;
    paidAt?: Date | string;
    paymentMethod?: string;
    notes?: string;
  };
}

export function AppointmentForm({
  appointment,
  initialDate,
  initialPatientId,
  onSuccess,
  onCancel,
}: AppointmentFormProps) {
  const { addAppointment, updateAppointment, loading } = useAppointmentStore();
  const { patients } = usePatientStore();
  const { appointmentHours, defaultAppointmentDuration } = useSettingsStore();

  const form = useForm<FormValues>({
    initialValues: {
      patientId: appointment?.patientId?.toString() || initialPatientId || '',
      date: appointment?.date ? new Date(appointment.date) : initialDate || new Date(),
      duration: appointment?.duration || defaultAppointmentDuration,
      status: appointment?.status || APPOINTMENT_STATUS.SCHEDULED,
      type: appointment?.type || AppointmentType.THERAPY,
      notes: appointment?.notes || '',
      price: appointment?.price || DEFAULT_APPOINTMENT_PRICE,
      paymentInfo: {
        isPaid: appointment?.paymentInfo?.isPaid || false,
        paidAt: appointment?.paymentInfo?.paidAt
          ? new Date(appointment.paymentInfo.paidAt)
          : undefined,
        paymentMethod: appointment?.paymentInfo?.paymentMethod || PaymentMethod.CASH,
        notes: appointment?.paymentInfo?.notes || '',
      },
    },
    validate: {
      patientId: (value) => (!value ? 'Wybierz pacjenta' : null),
      duration: (value) =>
        !value || value < 15 ? 'Czas trwania musi być co najmniej 15 minut' : null,
      price: (value) =>
        value !== undefined && value < 0 ? 'Cena nie może być ujemna' : null,
      date: (value) => (!value ? 'Wybierz datę i godzinę' : null),
    },
  });

  const handleDateChange = (value: Date | string | null) => {
    if (!value) return;
    const dateValue = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(dateValue.getTime())) return;

    const currentFullDate = dayjs(form.values.date);
    const newDate = dayjs(dateValue)
      .hour(currentFullDate.hour())
      .minute(currentFullDate.minute())
      .second(0)
      .toDate();
    form.setFieldValue('date', newDate);
  };

  const handleTimeChange = (value: string) => {
    const [hoursStr, minutesStr] = value.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = dayjs(form.values.date)
        .hour(hours)
        .minute(minutes)
        .second(0)
        .toDate();
      form.setFieldValue('date', newDate);
    }
  };

  const handlePaymentDateChange = (value: Date | string | null) => {
    if (!value) {
      form.setFieldValue('paymentInfo.paidAt', undefined);
      return;
    }
    const dateValue = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(dateValue.getTime())) return;

    const currentPaidAt = form.values.paymentInfo?.paidAt
      ? dayjs(form.values.paymentInfo.paidAt)
      : dayjs();
    const newDate = dayjs(dateValue)
      .hour(currentPaidAt.hour())
      .minute(currentPaidAt.minute())
      .second(0)
      .toDate();
    form.setFieldValue('paymentInfo.paidAt', newDate);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      // Transform values to match AppointmentFormData schema
      const appointmentData: AppointmentFormData = {
        ...values,
        patientId: parseInt(values.patientId, 10),
        status: values.status as
          | 'scheduled'
          | 'completed'
          | 'cancelled'
          | 'no_show'
          | 'rescheduled',
        type: values.type as
          | 'initial'
          | 'follow_up'
          | 'therapy'
          | 'consultation'
          | 'assessment'
          | undefined,
        paymentInfo: values.paymentInfo
          ? {
              ...values.paymentInfo,
              paymentMethod: values.paymentInfo.paymentMethod as
                | 'cash'
                | 'card'
                | 'transfer'
                | 'other'
                | undefined,
            }
          : undefined,
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
    label: getPatientDisplayName(patient),
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
      <Stack gap="md">
        <Select
          label='Pacjent'
          placeholder='Wybierz pacjenta'
          required
          data={patientOptions}
          searchable
          {...form.getInputProps('patientId')}
        />

        <Group grow>
          <DatePickerInput
            label='Data'
            placeholder='Wybierz datę'
            required
            value={toDate(form.values.date)}
            onChange={handleDateChange}
            error={form.errors.date}
          />
          <Select
            label='Godzina'
            placeholder='Wybierz godzinę'
            required
            data={appointmentHours}
            value={dayjs(form.values.date).format('HH:mm')}
            onChange={(value) => value && handleTimeChange(value)}
          />
        </Group>

        <Group grow>
          <NumberInput
            label='Czas trwania (minuty)'
            placeholder='50'
            min={15}
            max={300}
            step={5}
            required
            {...form.getInputProps('duration')}
          />
        </Group>

        <Input.Wrapper label='Typ wizyty'>
          <ScrollArea scrollbars='x' type='never' mt='xs'>
            <Box style={{ display: 'flex', width: 'max-content', minWidth: '100%' }}>
              <SegmentedControl
                data={typeOptions}
                {...form.getInputProps('type')}
                fullWidth
              />
            </Box>
          </ScrollArea>
        </Input.Wrapper>

        <Input.Wrapper label='Status'>
          <ScrollArea scrollbars='x' type='never' mt='xs'>
            <Box style={{ display: 'flex', width: 'max-content', minWidth: '100%' }}>
              <SegmentedControl
                data={statusOptions}
                {...form.getInputProps('status')}
                fullWidth
              />
            </Box>
          </ScrollArea>
        </Input.Wrapper>

        <Textarea
          label='Notatki'
          placeholder='Dodatkowe informacje o wizycie...'
          minRows={3}
          {...form.getInputProps('notes')}
        />

        <Divider my='md' />

        <Card withBorder p='md'>
          <Text fw={600} mb='md'>
            Płatność
          </Text>

          <NumberInput
            label='Cena (zł)'
            placeholder={DEFAULT_APPOINTMENT_PRICE.toString()}
            min={0}
            step={10}
            required
            {...form.getInputProps('price')}
          />

          <Checkbox
            label='Opłacono'
            mt='md'
            {...form.getInputProps('paymentInfo.isPaid', {
              type: 'checkbox',
            })}
          />

          {form.values.paymentInfo?.isPaid && (
            <>
              <Stack gap='md' mt='md'>
                <DatePickerInput
                  label='Data płatności'
                  placeholder='Kiedy opłacono?'
                  value={toDate(form.values.paymentInfo?.paidAt)}
                  onChange={handlePaymentDateChange}
                />
                <Input.Wrapper label='Sposób płatności'>
                  <ScrollArea scrollbars='x' type='never' mt='xs'>
                    <Box style={{ display: 'flex', width: 'max-content', minWidth: '100%' }}>
                      <SegmentedControl
                        data={paymentMethodOptions}
                        {...form.getInputProps('paymentInfo.paymentMethod')}
                        fullWidth
                      />
                    </Box>
                  </ScrollArea>
                </Input.Wrapper>
              </Stack>

              <Textarea
                label='Notatki do płatności'
                placeholder='Dodatkowe informacje o płatności...'
                mt='md'
                {...form.getInputProps('paymentInfo.notes')}
              />
            </>
          )}
        </Card>

        <Group justify='flex-end' mt='md'>
          <Button variant='light' onClick={onCancel}>
            Anuluj
          </Button>
          <Button type='submit' loading={loading}>
            {appointment ? 'Aktualizuj' : 'Dodaj'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
