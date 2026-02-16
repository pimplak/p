# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**P** is a Progressive Web Application (PWA) for psychologists and mental health practitioners. It's a practice management solution built with React 19, TypeScript, and an offline-first architecture using IndexedDB.

**Key characteristics:**
- Fully client-side application with no backend (offline-first)
- PWA installable on any device (iOS, Android, desktop)
- Local-first data storage with Dexie.js (IndexedDB wrapper)
- Designed for solo and small-practice psychologists

## Development Commands

### Essential Commands
```bash
npm run dev           # Start Vite dev server with hot reload (default: localhost:5173)
npm run build         # TypeScript check + production build
npm run preview       # Preview production build locally
npm run lint          # Run ESLint checks
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without modifying files
```

### Development Tools
- **Vite Inspector**: Available at `localhost:5173/__inspect/` during development
- **Build Analysis**: Check `vite.config.ts` for manual chunk configuration

## Technology Stack

### Core
- **React 19** with **TypeScript 5.8**
- **Vite 6** for build tooling
- **React Router 7** with lazy-loaded routes
- **Mantine v8** UI component library

### State & Data
- **Zustand 5** for global state management
- **Immer 10** for immutable state updates
- **Dexie.js 4** for IndexedDB operations (currently at schema v4)
- **Zod** for validation schemas

### Forms & Validation
- **@mantine/form** for form handling
- **Zod** schemas via `mantine-form-zod-resolver`
- **@hookform/resolvers** for validation integration

### UI & Styling
- **@tabler/icons-react** (v3.34.0) - standard icon library
- **PostCSS** with `postcss-preset-mantine`
- **@emotion/react** for CSS-in-JS

### Date & Time
- **date-fns 4** (primary date utility)
- **dayjs 1.11** (secondary, for specific use cases)

### PWA
- **vite-plugin-pwa 0.20** for PWA configuration
- **workbox** for service worker management

### Additional Features
- **react-window** + **react-virtualized-auto-sizer** for virtual scrolling
- **react-error-boundary** for error handling
- **XLSX** for Excel export functionality
- **use-debounce** for input debouncing

## Architecture

### State Management Pattern

```
UI Components
    ↓
Zustand Stores (UI state + orchestration)
    ↓
PatientDataService (business logic)
    ↓
Dexie (IndexedDB operations)
```

**Key stores:**
- `usePatientStore` - Patient data, search, filtering
- `useAppointmentStore` - Appointments, scheduling
- `useSettingsStore` - User preferences, app configuration
- `useThemeStore` - Theme management
- `useHeaderStore` - Dynamic header content injection

**Important:** Stores handle UI state and orchestration. Database operations go through `PatientDataService` which provides validation with Zod schemas before persistence.

### Component Organization

```
src/
├── pages/              # Route targets (lazy-loaded)
├── components/         # Feature & UI components
│   ├── layout/         # AppLayout, MobileNavigation
│   ├── ui/             # Primitive reusable components
│   └── dashboard/      # Dashboard-specific widgets
├── stores/             # Zustand stores
├── services/           # Business logic (PatientDataService)
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── constants/          # Status enums, defaults
├── schemas/            # Zod validation schemas
├── utils/              # Utilities (db.ts, dates.ts, export.ts, sms.ts)
├── theme/              # Mantine theme configuration
└── assets/             # Static files
```

### Database Architecture (Dexie)

**Current Schema Version:** 4

**Tables:**
- `patients` - Patient records with status, tags, notes
- `appointments` - Appointments with status tracking, rescheduling, cancellation
- `notes` - Session notes (SOAP format support)
- `goals` - Treatment goals with progress tracking

**Key Features:**
- Automatic timestamps (createdAt, updatedAt) via Dexie hooks
- Migration system for schema evolution (4 versions deployed)
- ISO date strings for consistency
- Indexes on frequently queried fields

**Database Class:** `PDB` in `src/utils/db.ts`

### Routing

All routes use lazy loading via `React.lazy()`:
- `/` - Dashboard
- `/patients` - Patient list
- `/patients/:id` - Patient profile
- `/calendar` - Appointment calendar
- `/notes` - Notes management
- `/analytics` - Practice analytics
- `/settings` - Application settings

### Data Models

**Patient:** id, firstName, lastName, email, phone, birthDate, address, emergencyContact, emergencyPhone, notes, status (active/archived), tags, createdAt, updatedAt

**Appointment:** id, patientId, date, duration, status (scheduled/completed/cancelled/no_show/rescheduled), type, notes, price, paymentInfo, reminderSent, reminderSentAt, rescheduledFromId, rescheduledToId, cancelledAt, cancellationReason, createdAt, updatedAt

**Note (SOAP):** id, patientId, sessionId, type (soap/general/assessment), subjective, objective, assessment, plan, createdAt, updatedAt

**Goal:** id, patientId, description, status (active/completed/paused/cancelled), targetDate, progress (0-100), notes, createdAt, updatedAt

## Development Guidelines

### Component Structure
- Use functional components with TypeScript interfaces for props
- Leverage Mantine v8 components for UI consistency
- Keep components small and focused (Single Responsibility Principle)
- Use composition to avoid deeply nested component trees
- Split large components into smaller sub-components

### Hooks & Logic
- Use Mantine hooks (`@mantine/hooks`) whenever possible: `useDisclosure`, `useMediaQuery`, `useDebouncedValue`
- Extract complex logic into custom hooks in `src/hooks/`
- Follow the Rules of Hooks strictly
- Use proper dependency arrays in `useEffect` with cleanup
- Prefer `use-debounce` for input debouncing

### State Management
- Use Zustand for global application state
- Use useState for local, component-specific state
- Use Mantine Context API or React Context for theme-related state
- Use Immer for complex state updates to ensure immutability
- Keep state as close to its usage as possible to minimize re-renders

### Forms & Validation
- Use `@mantine/form` for all form handling
- Use Zod schemas for validation via `mantine-form-zod-resolver`
- Implement controlled components through `form.getInputProps()`
- Show clear loading states and error messages using `@mantine/notifications`
- Ensure accessibility with semantic labels and ARIA attributes

### Performance
- Use `react-window` and `react-virtualized-auto-sizer` for long lists
- Implement `useMemo` and `useCallback` only when profiling shows bottlenecks
- Use `React.memo` for expensive leaf components with stable props
- Leverage Vite's dynamic imports (`React.lazy`) for route-based code splitting

### Error Handling
- Wrap key feature areas in `react-error-boundary` to prevent full-app crashes
- Handle async errors gracefully with user-friendly notifications via `@mantine/notifications`
- Use `date-fns` or `dayjs` for date manipulations

### Code Style
- Use PascalCase for component files (`MyComponent.tsx`)
- Use camelCase for hooks (`useMyHook.ts`)
- Group related components, hooks, and styles in feature-based directories
- Use TypeScript strictly; avoid `any`
- Prefer Tabler Icons (`@tabler/icons-react`)
- Document complex logic with concise comments

### Accessibility
- Use semantic HTML elements
- Implement proper heading hierarchy (h1, h2, h3, etc.)
- Use ARIA attributes appropriately
- Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- Implement proper focus management for keyboard navigation
- Use `aria-label` or `aria-labelledby` for icon buttons
- Provide alt text for images
- Ensure form inputs have associated labels using `htmlFor`/`id`
- Implement proper error messaging with `aria-live` regions
- Use `tabindex` appropriately (preferably only 0 or -1)
- Implement proper landmark roles for screen readers
- Use `prefers-reduced-motion` media query for motion sensitivity
- Implement proper modal dialog accessibility with focus trapping
- Test with screen readers (NVDA, JAWS, VoiceOver)

### Code Quality Standards
- **Verify information** before making changes
- **Make changes file by file** to allow for review
- **Don't invent changes** beyond what's explicitly requested
- **Preserve existing code** - don't remove unrelated functionality
- **Provide all edits in a single chunk** per file
- **Update documentation** when adding new features, fields, components (especially endpoints and database changes)
- **No apologies** in communication
- **No whitespace-only suggestions**
- **No unnecessary confirmations** for information already in context

## Key Features & Implementation Notes

### SMS Reminders
- **Phase 1 (Current):** Opens device SMS app with pre-filled message templates
- **Phase 2 (Planned):** Twilio backend integration for automated sending
- Template system with customizable messages
- Bulk reminder processing with individual customization
- Tracking: reminderSent, reminderSentAt fields on appointments

### Appointment Status Workflow
- Auto-status change to "completed" for past appointments
- Rescheduling links appointments via rescheduledFromId/rescheduledToId
- Cancellation tracking with reason and timestamp
- Appointment type manager with default types

### Data Export
- Excel export via XLSX library
- Filtered exports by date range, patient, or status
- Export modal component handles configuration

### PWA Features
- Install prompt component
- Service worker with auto-update
- Offline-capable with IndexedDB persistence
- Responsive design optimized for mobile and desktop
- Multi-device consistency (planned: cloud sync)

### Theme System
- Dynamic theme switching (light/dark modes)
- Custom Mantine theme objects
- CSS variables for runtime theming
- `useTheme` hook provides current palette

### Dynamic Header
- `useHeaderStore` allows pages to customize header content
- Three slots: left (burger/logo), center (title), right (info)
- Pages inject custom JSX as needed

### Gesture Support
- `useGestures` hook for mobile drawer interaction
- Swipe/drag detection with visual feedback
- Touch-optimized interactions

## Build Configuration

### Manual Chunks (Code Splitting)
Vite is configured to split vendor libraries into separate chunks:
- `react-vendor` - React, React DOM, React Router
- `mantine-vendor` - All Mantine packages
- `icons-vendor` - Tabler Icons
- `db-vendor` - Dexie
- `state-vendor` - Zustand, Immer
- `utils-vendor` - date-fns, dayjs, Zod

### PWA Manifest
- Name: "P"
- Categories: medical, productivity, business
- Display: standalone
- Orientation: portrait

## Common Patterns

### Optimistic Updates
```typescript
// In Zustand store
const updatePatient = async (id: string, data: Partial<Patient>) => {
  // Optimistic update
  set(state => ({ patients: state.patients.map(p => p.id === id ? {...p, ...data} : p) }));

  try {
    await patientDataService.updatePatient(id, data);
  } catch (error) {
    // Rollback on error
    await loadPatients(); // Refresh from DB
    showNotification({ message: 'Update failed', color: 'red' });
  }
};
```

### Form with Zod Validation
```typescript
import { useForm, zodResolver } from '@mantine/form';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

const form = useForm({
  validate: zodResolver(schema),
  initialValues: { firstName: '', email: '' },
});
```

### Dynamic Header Injection
```typescript
// In a page component
const headerStore = useHeaderStore();

useEffect(() => {
  headerStore.setHeader({
    center: <Text>Patient Profile</Text>,
    right: <Button>Edit</Button>,
  });

  return () => headerStore.clearHeader();
}, []);
```

## Important Notes

- **No backend currently** - fully client-side with IndexedDB
- **Cloud sync planned** but not yet implemented
- **HIPAA compliance considerations** built in but not certified
- **Local-first architecture** means data stays on device unless explicitly exported
- **SMS reminders** currently use device SMS app, not automated backend
- **Recent work** focuses on appointment management, cancellation, rescheduling, and status workflows
