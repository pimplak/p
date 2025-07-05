import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { useTheme } from './hooks/useTheme';

// Ferro's Dynamic Theme Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mantineTheme } = useTheme();
  
  return (
    <MantineProvider theme={mantineTheme}>
      {children}
    </MantineProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ModalsProvider>
        <Notifications position="top-right" />
        <GlobalErrorBoundary>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </GlobalErrorBoundary>
      </ModalsProvider>
    </ThemeProvider>
  );
}

export default App;
