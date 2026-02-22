import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { useTheme } from './hooks/useTheme';
import './i18n/config';
import { useAuthStore } from './stores/useAuthStore';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mantineTheme } = useTheme();

  return (
    <MantineProvider
      theme={mantineTheme}
      defaultColorScheme='auto'
      withCssVariables
      withGlobalClasses
      withStaticClasses
    >
      {children}
    </MantineProvider>
  );
}

function AuthInitializer() {
  const { initialize } = useAuthStore();
  useEffect(() => initialize(), [initialize]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ModalsProvider>
        <Notifications position='top-right' />
        <GlobalErrorBoundary>
          <BrowserRouter>
            <AuthInitializer />
            <AppRouter />
          </BrowserRouter>
        </GlobalErrorBoundary>
        <PWAInstallPrompt />
      </ModalsProvider>
    </ThemeProvider>
  );
}

export default App;
