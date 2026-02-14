import type { AppointmentTypeConfig } from '../types/Appointment';

export const APPOINTMENT_TYPES_TEMPLATE = {
  INITIAL_VISIT: 'initial_visit',
  ONLINE_SESSION: 'online_session',
  IN_PERSON_SESSION: 'in_person_session',
  EMDR: 'emdr',
  CRISIS_INTERVENTION: 'crisis_intervention',
  // Legacy or additional types used in sample data/timeline
  INITIAL: 'initial_visit',
  FOLLOW_UP: 'follow_up',
  THERAPY: 'therapy',
  CONSULTATION: 'consultation',
  ASSESSMENT: 'assessment',
} as const;

export const DEFAULT_APPOINTMENT_TYPES: AppointmentTypeConfig[] = [
  { id: APPOINTMENT_TYPES_TEMPLATE.ONLINE_SESSION, label: 'Sesja online', isDefault: true },
  { id: APPOINTMENT_TYPES_TEMPLATE.IN_PERSON_SESSION, label: 'Sesja stacjonarna', isDefault: true },
  { id: APPOINTMENT_TYPES_TEMPLATE.EMDR, label: 'EMDR', isDefault: true },
  { id: APPOINTMENT_TYPES_TEMPLATE.CRISIS_INTERVENTION, label: 'Interwencja kryzysowa', isDefault: true },
  { id: APPOINTMENT_TYPES_TEMPLATE.INITIAL_VISIT, label: 'Sesja wstępna', isDefault: true },
];
