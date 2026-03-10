import type { AppointmentWithPatient } from '../../types/Appointment';
import type { ColorPalette } from '../../types/theme';

export type CalendarView = 'day' | 'week' | 'month';

export interface CalendarViewProps {
  date: Date;
  appointments: AppointmentWithPatient[];
  onEditAppointment: (appointment: AppointmentWithPatient) => void;
  onDeleteAppointment: (id: number) => void;
  onRescheduleAppointment: (appointment: AppointmentWithPatient) => void;
  onJumpToAppointment: (id: number) => void;
  onAddAppointment: (date?: Date) => void;
  onDateSelect: (date: Date) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  currentPalette: ColorPalette;
  utilityColors: { error: string; success: string; warning: string };
  isDark: boolean;
}
