import { AppShell, NavLink, Group, Text, Stack, Burger, ScrollArea } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconNotes,
  IconChartLine,
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import { MobileNavigation } from './MobileNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { 
    label: 'Dashboard', 
    icon: IconDashboard, 
    href: '/'
  },
  { 
    label: 'Pacjenci', 
    icon: IconUsers, 
    href: '/patients' 
  },
  { 
    label: 'Kalendarz', 
    icon: IconCalendar, 
    href: '/calendar' 
  },
  { 
    label: 'Notatki', 
    icon: IconNotes, 
    href: '/notes' 
  },
  { 
    label: 'Statystyki', 
    icon: IconChartLine, 
    href: '/analytics' 
  },
];

const bottomItems = [
  { 
    label: 'Ustawienia', 
    icon: IconSettings, 
    href: '/settings' 
  },
  { 
    label: 'Wyloguj', 
    icon: IconLogout, 
    href: '/logout',
    color: 'red'
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  return (
    <>
      {/* Mobile Navigation - shown only on mobile */}
      {isMobile && <MobileNavigation />}
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 280, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
      style={{
        '--app-shell-navbar-width': '280px',
      }}
    >
      {/* Header */}
      <AppShell.Header
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-primary)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-text)',
        }}
      >
        <Group h="100%" justify="space-between" w="100%">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              style={{ color: 'var(--gray-600)' }}
            />
            <Text 
              size="lg" 
              fw={600}
              style={{ color: 'var(--color-text)' }}
              visibleFrom="sm"
            >
              PsychFlow
            </Text>
          </Group>
          
          <Group gap="md">
            <Text size="sm" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
              Dr Anna Terapeutka
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar */}
      <AppShell.Navbar
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-primary)',
          padding: '24px 16px',
          color: 'var(--color-text)',
        }}
      >
        <ScrollArea style={{ height: '100%' }}>
          <Stack gap="lg" h="100%">
            {/* Logo/Brand */}
            <Group gap="md" style={{ padding: '0 8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#6366F1',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text c="white" fw={700} size="sm">
                  P
                </Text>
              </div>
              <Text 
                size="lg" 
                fw={600}
                style={{ letterSpacing: '-0.01em', color: 'var(--color-text)' }}
              >
                PsychFlow
              </Text>
            </Group>

            {/* Main Navigation */}
            <Stack gap="xs" style={{ flex: 1 }}>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                                    <NavLink
                    key={item.href}
                    component={Link}
                    to={item.href}
                    label={item.label}
                    leftSection={<Icon size={20} stroke={1.5} />}
                    active={location.pathname === item.href}
                    onClick={() => {
                      if (isMobile) {
                        toggle();
                      }
                    }}
                    style={{
                      borderRadius: '8px',
                      fontWeight: 500,
                      fontSize: '14px',
                      padding: '12px 16px',
                      transition: 'all 200ms ease-out',
                    }}
                    styles={{
                      root: {
                        '&[data-active]': {
                          backgroundColor: '#6366F1',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#4F46E5',
                          }
                        },
                        '&:not([data-active]):hover': {
                          backgroundColor: 'var(--gray-50)',
                        }
                      }
                    }}
                  />
                );
              })}
            </Stack>

            {/* Bottom Navigation */}
            <Stack gap="xs" style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '16px' }}>
              {bottomItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    component={Link}
                    to={item.href}
                    label={item.label}
                    leftSection={<Icon size={20} stroke={1.5} />}
                    onClick={() => {
                      if (isMobile) {
                        toggle();
                      }
                    }}
                    style={{
                      borderRadius: '8px',
                      fontWeight: 500,
                      fontSize: '14px',
                      padding: '12px 16px',
                      transition: 'all 200ms ease-out',
                      color: item.color === 'red' ? 'var(--danger)' : 'var(--gray-600)',
                    }}
                    styles={{
                      root: {
                        '&:hover': {
                          backgroundColor: item.color === 'red' ? '#FEF2F2' : 'var(--gray-50)',
                        }
                      }
                    }}
                  />
                );
              })}
            </Stack>
          </Stack>
        </ScrollArea>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main
        style={{
          backgroundColor: 'var(--color-background)',
          minHeight: 'calc(100vh - 70px)',
          paddingBottom: isMobile ? '80px' : '0', // Space for mobile navigation
          color: 'var(--color-text)',
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
    </>
  );
}; 