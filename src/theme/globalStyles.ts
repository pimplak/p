// FERRO'S GLOBAL STYLES - Mantine emotion-compatible styles object
import type { CSSObject } from '@emotion/react';

export const globalStyles: CSSObject = {
  /* Base styles using CSS variables */
  body: {
    backgroundColor: 'var(--color-background) !important',
    color: 'var(--color-text) !important',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important',
    margin: 0,
    padding: 0,
  },

  /* FERRO'S AGGRESSIVE TEXT COLOR OVERRIDES */
  /* All text elements use theme text color */
  '.mantine-Text-root, .mantine-Title-root, .mantine-List-root, .mantine-Code-root, .mantine-Badge-root, .mantine-Alert-root, p, h1, h2, h3, h4, h5, h6, span, div, li, td, th': {
    color: 'var(--color-text) !important',
  },

  /* Input text colors */
  '.mantine-TextInput-input, .mantine-Select-input, .mantine-NumberInput-input, .mantine-Textarea-input, .mantine-PasswordInput-input': {
    color: 'var(--color-text) !important',
    backgroundColor: 'var(--color-surface) !important',
  },

  /* Date and Special Input components */
  '.mantine-DateInput-input, .mantine-DateTimePicker-input, .mantine-DatePicker-input, .mantine-TagsInput-input': {
    color: 'var(--color-text) !important',
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  /* TagsInput pills */
  '.mantine-TagsInput-pill': {
    backgroundColor: 'var(--color-primary) !important',
    color: 'var(--color-surface) !important',
  },

  /* Input labels */
  '.mantine-TextInput-label, .mantine-Select-label, .mantine-NumberInput-label, .mantine-Textarea-label, .mantine-DateInput-label, .mantine-DateTimePicker-label, .mantine-TagsInput-label': {
    color: 'var(--color-text) !important',
  },

  /* Input wrappers and borders */
  '.mantine-TextInput-wrapper, .mantine-Select-wrapper, .mantine-NumberInput-wrapper, .mantine-Textarea-wrapper, .mantine-DateInput-wrapper, .mantine-DateTimePicker-wrapper, .mantine-TagsInput-wrapper': {
    borderColor: 'var(--color-primary) !important',
  },

  /* Input placeholders */
  '.mantine-TextInput-input::placeholder, .mantine-Select-input::placeholder, .mantine-NumberInput-input::placeholder, .mantine-Textarea-input::placeholder, .mantine-DateInput-input::placeholder, .mantine-DateTimePicker-input::placeholder, .mantine-TagsInput-input::placeholder': {
    color: 'color-mix(in srgb, var(--color-text) 50%, transparent) !important',
  },

  /* Dropdown backgrounds */
  '.mantine-Select-dropdown, .mantine-Combobox-dropdown, .mantine-DatePicker-dropdown': {
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  /* Theme-aware component overrides */
  '.mantine-AppShell-main': {
    backgroundColor: 'var(--color-background) !important',
  },

  '.mantine-AppShell-header': {
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  '.mantine-AppShell-navbar': {
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  '.mantine-NavLink-root': {
    color: 'var(--color-text) !important',
  },

  '.mantine-NavLink-root[data-active]': {
    backgroundColor: 'var(--color-primary) !important',
    color: 'var(--color-surface) !important',
  },

  '.mantine-NavLink-root:hover': {
    backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent) !important',
  },

  '.mantine-Card-root': {
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  '.mantine-Button-root': {
    backgroundColor: 'var(--color-primary) !important',
    color: 'var(--color-surface) !important',
  },

  '.mantine-Button-root:hover': {
    backgroundColor: 'var(--color-accent) !important',
  },

  /* Special overrides for dimmed text */
  '.mantine-Text-root[data-c="dimmed"], [data-c="dimmed"]': {
    color: 'color-mix(in srgb, var(--color-text) 60%, transparent) !important',
  },

  /* Table text colors */
  '.mantine-Table-root, .mantine-Table-th, .mantine-Table-td': {
    color: 'var(--color-text) !important',
  },

  /* Menu and dropdown text colors */
  '.mantine-Menu-item, .mantine-Select-item, .mantine-Combobox-option': {
    color: 'var(--color-text) !important',
  },

  /* Modal and overlay text */
  '.mantine-Modal-content, .mantine-Modal-header, .mantine-Modal-body': {
    backgroundColor: 'var(--color-surface) !important',
    color: 'var(--color-text) !important',
  },

  '.mantine-Modal-inner': {
    left: '50% !important',
    transform: 'translateX(-50%) !important',
  },

  /* MOBILE OPTIMIZATIONS - Ferro's responsive system */
  '@media (max-width: 768px)': {
    '.mantine-AppShell-main': {
      padding: '1rem !important',
      maxWidth: '100vw !important',
      margin: '0 auto !important',
    },

    '.mantine-Title-root[data-order="1"]': {
      fontSize: '1.5rem !important',
      textAlign: 'center',
      marginBottom: '1rem !important',
    },

    '.mantine-Title-root[data-order="3"]': {
      fontSize: '1.2rem !important',
    },

    '.mantine-Stack-root': {
      gap: '1rem !important',
    },

    '.mantine-Grid-root': {
      margin: '0 !important',
    },

    '.mantine-Grid-col': {
      padding: '0.5rem !important',
    },

    '.mantine-Card-root': {
      padding: '1rem !important',
      marginBottom: '0.75rem !important',
    },

    '.mantine-Group-root': {
      gap: '0.75rem !important',
    },

    '.mantine-Button-root': {
      height: '2.5rem !important',
      padding: '0 1rem !important',
      fontSize: '0.9rem !important',
      minWidth: '120px !important',
    },

    '.mantine-Table-root': {
      fontSize: '0.8rem !important',
    },

    '.mantine-Table-td, .mantine-Table-th': {
      padding: '0.75rem 0.5rem !important',
    },

    '.mantine-ActionIcon-root': {
      width: '2rem !important',
      height: '2rem !important',
    },

    '.mantine-Badge-root': {
      height: '1.5rem !important',
      padding: '0 0.5rem !important',
      fontSize: '0.75rem !important',
    },

    '.mantine-AppShell-header .mantine-Group-root': {
      padding: '0 1rem !important',
    },

    '.mantine-AppShell-navbar': {
      padding: '1rem !important',
    },

    '.mantine-NavLink-root': {
      padding: '0.75rem 1rem !important',
      marginBottom: '0.5rem !important',
      borderRadius: '0.5rem !important',
    },

    '.mantine-TextInput-root, .mantine-Select-root, .mantine-NumberInput-root, .mantine-DateInput-root, .mantine-DateTimePicker-root, .mantine-TagsInput-root, .mantine-Textarea-root': {
      marginBottom: '1rem !important',
    },

    '.mantine-TextInput-input, .mantine-Select-input, .mantine-NumberInput-input, .mantine-DateInput-input, .mantine-DateTimePicker-input, .mantine-TagsInput-input, .mantine-Textarea-input': {
      height: '2.5rem !important',
      fontSize: '0.9rem !important',
      padding: '0 0.75rem !important',
    },

    '.mantine-Alert-root': {
      padding: '1rem !important',
      margin: '0.75rem 0 !important',
    },

    '.mantine-Modal-content': {
      margin: '1rem !important',
    },

    '.mantine-Tabs-root': {
      margin: '0 -1rem !important',
    },

    '.mantine-Tabs-tab': {
      padding: '0.75rem !important',
      fontSize: '0.9rem !important',
    },

    '.mantine-NumberInput-controls': {
      display: 'none !important',
    },

    '.mantine-DateTimePicker-timeInput': {
      height: '2.5rem !important',
      fontSize: '0.9rem !important',
    },

    '.patient-table-responsive': {
      '& .mantine-Table-table': {
        minWidth: '600px !important',
      },
    },

    '.fab-container': {
      position: 'fixed',
      bottom: '2rem',
      right: '1rem',
      zIndex: 1000,
    },

    '.fab-button': {
      width: '3.5rem !important',
      height: '3.5rem !important',
      borderRadius: '50% !important',
      fontSize: '1.5rem !important',
    },

    '.search-section': {
      marginBottom: '1rem',
      position: 'sticky',
      top: '0',
      backgroundColor: 'var(--color-background)',
      zIndex: 10,
      padding: '1rem 0',
    },

    '.patient-cards-mobile .mantine-Card-root': {
      marginBottom: '1rem !important',
      padding: '1rem !important',
      border: '1px solid var(--color-primary) !important',
      borderRadius: '0.5rem !important',
    },

    '.patient-card-header': {
      display: 'flex !important',
      justifyContent: 'space-between !important',
      alignItems: 'center !important',
      marginBottom: '0.75rem !important',
    },

    '.patient-card-stats': {
      display: 'grid !important',
      gridTemplateColumns: '1fr 1fr !important',
      gap: '0.5rem !important',
      marginTop: '0.75rem !important',
    },
  },

  /* Checkbox and form controls */
  '.mantine-Checkbox-root, .mantine-Switch-root': {
    color: 'var(--color-text) !important',
  },

  '.mantine-Checkbox-input:checked': {
    backgroundColor: 'var(--color-primary) !important',
    borderColor: 'var(--color-primary) !important',
  },

  '.mantine-Switch-track[data-checked]': {
    backgroundColor: 'var(--color-primary) !important',
  },

  /* Focus states for all inputs */
  '.mantine-TextInput-input:focus, .mantine-Select-input:focus, .mantine-NumberInput-input:focus, .mantine-Textarea-input:focus, .mantine-DateInput-input:focus, .mantine-DateTimePicker-input:focus, .mantine-TagsInput-input:focus': {
    borderColor: 'var(--color-accent) !important',
  },

  /* Input icons and buttons */
  '.mantine-DateInput-calendarIcon, .mantine-DateTimePicker-calendarIcon, .mantine-Select-rightSection': {
    color: 'var(--color-text) !important',
  },

  '.mantine-TagsInput-pill button': {
    color: 'var(--color-surface) !important',
  },

  '.mantine-NumberInput-controls button': {
    color: 'var(--color-text) !important',
    backgroundColor: 'var(--color-surface) !important',
    borderColor: 'var(--color-primary) !important',
  },

  '.mantine-NumberInput-controls button:hover': {
    backgroundColor: 'var(--color-primary) !important',
    color: 'var(--color-surface) !important',
  },
}; 