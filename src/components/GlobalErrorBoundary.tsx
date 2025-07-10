import { Button, Container, Stack, Text, Alert, Group } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void; 
}) {
  return (
    <Container size="sm" mt="xl">
      <Stack gap="lg" align="center">
        <Alert 
          icon={<IconAlertTriangle size="2rem" />} 
          title="Coś poszło nie tak" 
          color="red"
          variant="light"
        >
          <Stack gap="md">
            <Text>
              Wystąpił nieoczekiwany błąd w aplikacji. Spróbuj odświeżyć stronę 
              lub skontaktuj się z pomocą techniczną.
            </Text>
            
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
                Szczegóły błędu (dla programistów)
              </summary>
              <Text 
                size="sm" 
                c="dimmed" 
                mt="xs" 
                style={{ 
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  padding: '0.5rem',
                  background: 'var(--color-surface)',
                  borderRadius: '4px'
                }}
              >
                {error.message}
              </Text>
            </details>
          </Stack>
        </Alert>

        <Group>
          <Button
            leftSection={<IconRefresh size="1rem" />}
            onClick={resetErrorBoundary}
            color="blue"
          >
            Spróbuj ponownie
          </Button>
          
          <Button
            variant="light"
            onClick={() => window.location.reload()}
          >
            Odśwież stronę
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console for development
        console.error('🔥 Global Error Boundary caught an error:', error);
        console.error('Error info:', errorInfo);
        
        // Here you could send error to monitoring service (Sentry, etc.)
        // Example:
        // captureException(error, { extra: errorInfo });
      }}
      onReset={() => {
        // Clear any error state, reload data, etc.
        console.log('🔄 Error boundary reset');
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 