/**
 * Patient Status Constants
 */
export const PATIENT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type PatientStatus =
  (typeof PATIENT_STATUS)[keyof typeof PATIENT_STATUS];

/**
 * Goal Status Constants
 */
export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const;

export type GoalStatus = (typeof GOAL_STATUS)[keyof typeof GOAL_STATUS];

/**
 * Appointment Status Constants
 */
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  RESCHEDULED: 'rescheduled',
} as const;

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

/**
 * Status Labels - Human-readable versions
 */
export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  [PATIENT_STATUS.ACTIVE]: 'Aktywny',
  [PATIENT_STATUS.ARCHIVED]: 'Zarchiwizowany',
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  [GOAL_STATUS.ACTIVE]: 'Aktywny',
  [GOAL_STATUS.COMPLETED]: 'Zakończony',
  [GOAL_STATUS.PAUSED]: 'Wstrzymany',
  [GOAL_STATUS.CANCELLED]: 'Anulowany',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Zaplanowana',
  [APPOINTMENT_STATUS.COMPLETED]: 'Zakończona',
  [APPOINTMENT_STATUS.CANCELLED]: 'Odwołana',
  [APPOINTMENT_STATUS.NO_SHOW]: 'Niestawienie się',
  [APPOINTMENT_STATUS.RESCHEDULED]: 'Przełożona',
};

/**
 * Document Type Constants
 */
export const DOCUMENT_TYPE = {
  MEDICAL_RECORD: 'medical_record',
  CONSENT_FORM: 'consent_form',
  REPORT: 'report',
  CORRESPONDENCE: 'correspondence',
  INSURANCE: 'insurance',
  OTHER: 'other',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];
