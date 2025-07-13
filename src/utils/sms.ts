import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import type { Appointment } from '../types/Appointment';
import type { Patient } from '../types/Patient';

// SMS Message Templates
export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  description: string;
  variables: string[];
}

export const DEFAULT_SMS_TEMPLATES: SMSTemplate[] = [
  {
    id: 'appointment_reminder',
    name: 'Przypomnienie o wizycie',
    content:
      'Dzień dobry {patientName}! Przypominam o wizycie jutro ({date}) o godzinie {time}. Pozdrawiam, {practitionerName}',
    description: 'Standardowe przypomnienie o wizycie na następny dzień',
    variables: ['patientName', 'date', 'time', 'practitionerName'],
  },
  {
    id: 'appointment_reminder_today',
    name: 'Przypomnienie - dzisiaj',
    content:
      'Dzień dobry {patientName}! Przypominam o dzisiejszej wizycie o godzinie {time}. Pozdrawiam, {practitionerName}',
    description: 'Przypomnienie o wizycie w dniu dzisiejszym',
    variables: ['patientName', 'time', 'practitionerName'],
  },
  {
    id: 'appointment_confirmation',
    name: 'Potwierdzenie wizyty',
    content:
      'Dzień dobry {patientName}! Potwierdzam wizytę w dniu {date} o godzinie {time}. Pozdrawiam, {practitionerName}',
    description: 'Potwierdzenie umówionej wizyty',
    variables: ['patientName', 'date', 'time', 'practitionerName'],
  },
  {
    id: 'appointment_reschedule',
    name: 'Przeniesienie wizyty',
    content:
      'Dzień dobry {patientName}! Muszę przełożyć naszą wizytę z dnia {oldDate}. Proszę o kontakt w celu umówienia nowego terminu. Pozdrawiam, {practitionerName}',
    description: 'Informacja o konieczności przeniesienia wizyty',
    variables: ['patientName', 'oldDate', 'practitionerName'],
  },
  {
    id: 'appointment_cancellation',
    name: 'Odwołanie wizyty',
    content:
      'Dzień dobry {patientName}! Niestety muszę odwołać wizytę z dnia {date} o godzinie {time}. Proszę o kontakt w celu umówienia nowego terminu. Pozdrawiam, {practitionerName}',
    description: 'Informacja o odwołaniu wizyty',
    variables: ['patientName', 'date', 'time', 'practitionerName'],
  },
  {
    id: 'first_appointment',
    name: 'Pierwsza wizyta',
    content:
      'Dzień dobry {patientName}! Przypominam o naszej pierwszej wizycie jutro ({date}) o godzinie {time}. Proszę przybyć 10 minut wcześniej. Pozdrawiam, {practitionerName}',
    description: 'Specjalne przypomnienie dla pierwszej wizyty',
    variables: ['patientName', 'date', 'time', 'practitionerName'],
  },
  {
    id: 'follow_up_reminder',
    name: 'Przypomnienie o kontynuacji',
    content:
      'Dzień dobry {patientName}! Minęło już trochę czasu od ostatniej wizyty. Gdyby chciał/a Pan/Pani umówić się na kolejną sesję, proszę o kontakt. Pozdrawiam, {practitionerName}',
    description: 'Przypomnienie o kontynuacji terapii po dłuższej przerwie',
    variables: ['patientName', 'practitionerName'],
  },
];

// SMS Variables that can be used in templates
export interface SMSVariables {
  patientName: string;
  patientFirstName: string;
  date: string;
  time: string;
  oldDate?: string;
  practitionerName: string;
  practitionerTitle: string;
  appointmentType?: string;
  duration?: string;
}

// SMS Reminder Status
export type SMSReminderStatus =
  | 'not_sent'
  | 'sent'
  | 'delivery_confirmed'
  | 'delivery_failed'
  | 'patient_responded'
  | 'patient_confirmed'
  | 'patient_cancelled';

export interface SMSReminderLog {
  id: string;
  appointmentId: number;
  patientId: number;
  templateId: string;
  message: string;
  status: SMSReminderStatus;
  sentAt: Date;
  deliveredAt?: Date;
  respondedAt?: Date;
  responseMessage?: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generate SMS variables from patient and appointment data
 */
export function generateSMSVariables(
  patient: Patient,
  appointment: Appointment,
  practitionerName: string = 'Gabinet',
  practitionerTitle: string = 'mgr'
): SMSVariables {
  const appointmentDate = new Date(appointment.date);

  return {
    patientName: `${patient.firstName} ${patient.lastName}`,
    patientFirstName: patient.firstName,
    date: format(appointmentDate, 'dd.MM.yyyy (EEEE)', { locale: pl }),
    time: format(appointmentDate, 'HH:mm'),
    practitionerName,
    practitionerTitle,
    appointmentType: appointment.type || 'sesja',
    duration: `${appointment.duration} min`,
  };
}

/**
 * Replace template variables with actual values
 */
export function replaceTemplateVariables(
  template: string,
  variables: SMSVariables
): string {
  let message = template;

  // Replace all variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      message = message.replace(regex, value.toString());
    }
  });

  return message;
}

/**
 * Generate SMS message from template
 */
export function generateSMSMessage(
  templateId: string,
  patient: Patient,
  appointment: Appointment,
  practitionerName?: string,
  customTemplates?: SMSTemplate[]
): string {
  const templates = customTemplates || DEFAULT_SMS_TEMPLATES;
  const template = templates.find(t => t.id === templateId);

  if (!template) {
    throw new Error(`SMS template with ID "${templateId}" not found`);
  }

  const variables = generateSMSVariables(
    patient,
    appointment,
    practitionerName
  );
  return replaceTemplateVariables(template.content, variables);
}

/**
 * Generate SMS URI for manual sending
 */
export function generateSMSURI(phoneNumber: string, message: string): string {
  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');

  // Ensure phone number starts with + for international format
  const formattedPhone = cleanPhone.startsWith('+')
    ? cleanPhone
    : `+48${cleanPhone}`;

  // Encode message for URI
  const encodedMessage = encodeURIComponent(message);

  return `sms:${formattedPhone}?body=${encodedMessage}`;
}

/**
 * Open SMS app with pre-filled message
 */
export function openSMSApp(phoneNumber: string, message: string): void {
  const smsURI = generateSMSURI(phoneNumber, message);

  // Try to open SMS app
  try {
    window.open(smsURI, '_self');
  } catch (error) {
    console.error('Failed to open SMS app:', error);
    // Fallback: copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        alert(
          `Nie udało się otworzyć aplikacji SMS. Wiadomość została skopiowana do schowka:\n\n${message}`
        );
      });
    } else {
      alert(`Nie udało się otworzyć aplikacji SMS. Wiadomość:\n\n${message}`);
    }
  }
}

/**
 * Send SMS reminder for appointment
 */
export function sendSMSReminder(
  patient: Patient,
  appointment: Appointment,
  templateId: string = 'appointment_reminder',
  practitionerName?: string,
  customTemplates?: SMSTemplate[]
): void {
  if (!patient.phone) {
    throw new Error('Patient does not have a phone number');
  }

  const message = generateSMSMessage(
    templateId,
    patient,
    appointment,
    practitionerName,
    customTemplates
  );

  openSMSApp(patient.phone, message);
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Basic Polish phone number validation
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Check if it's a valid Polish mobile number
  const polishMobileRegex = /^(\+48)?[4-9]\d{8}$/;
  const internationalRegex = /^\+\d{10,15}$/;

  return (
    polishMobileRegex.test(cleanPhone) || internationalRegex.test(cleanPhone)
  );
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // Format Polish mobile number
  if (cleanPhone.match(/^(\+48)?[4-9]\d{8}$/)) {
    const digits = cleanPhone.replace(/^\+48/, '');
    return `+48 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  // Return as-is for international numbers
  return phone;
}

/**
 * Get SMS template by ID
 */
export function getSMSTemplate(
  templateId: string,
  customTemplates?: SMSTemplate[]
): SMSTemplate | undefined {
  const templates = customTemplates || DEFAULT_SMS_TEMPLATES;
  return templates.find(t => t.id === templateId);
}

/**
 * Get appropriate template based on appointment timing
 */
export function getRecommendedTemplate(appointment: Appointment): string {
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  // If appointment is today (within 24 hours)
  if (hoursDiff <= 24 && hoursDiff > 0) {
    return 'appointment_reminder_today';
  }

  // If it's a first appointment
  if (appointment.type === 'initial') {
    return 'first_appointment';
  }

  // Default reminder
  return 'appointment_reminder';
}

/**
 * Check if appointment needs reminder
 */
export function needsReminder(appointment: Appointment): boolean {
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  // Send reminder 24-48 hours before appointment
  return hoursDiff > 0 && hoursDiff <= 48 && !appointment.reminderSent;
}

/**
 * Get reminder timing description
 */
export function getReminderTiming(appointment: Appointment): string {
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  const timeDiff = appointmentDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff <= 0) {
    return 'Wizyta już minęła';
  } else if (hoursDiff <= 2) {
    return 'Za mniej niż 2 godziny';
  } else if (hoursDiff <= 24) {
    return 'Dzisiaj';
  } else if (hoursDiff <= 48) {
    return 'Jutro';
  } else {
    const days = Math.ceil(hoursDiff / 24);
    return `Za ${days} dni`;
  }
}
