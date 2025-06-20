import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import therapeuticTheme from './theme';

function App() {
  return (
    <MantineProvider theme={therapeuticTheme}>
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
