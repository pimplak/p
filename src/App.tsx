import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { Global } from '@emotion/react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { useTheme } from './hooks/useTheme';
import { globalStyles } from './theme/globalStyles';

function App() {
  const { mantineTheme } = useTheme();

  return (
    <MantineProvider theme={mantineTheme}>
      <Global styles={globalStyles} />
      <ModalsProvider>
        <Notifications position="top-right" />
        <GlobalErrorBoundary>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </GlobalErrorBoundary>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
