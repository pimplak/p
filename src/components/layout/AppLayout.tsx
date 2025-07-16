import {
  AppShell,
  NavLink,
  Group,
  Text,
  Stack,
  Burger,
  ScrollArea,
  Box,
  Transition,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  IconNotes,
  IconChartLine,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useGestures } from '../../hooks/useGestures';
import { useTheme } from '../../hooks/useTheme';
import { DrawerOverlay } from '../ui/DrawerOverlay';
import { MobileNavigation } from './MobileNavigation';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    label: 'Dashboard',
    icon: IconDashboard,
    href: '/',
  },
  {
    label: 'Pacjenci',
    icon: IconUsers,
    href: '/patients',
  },
  {
    label: 'Kalendarz',
    icon: IconCalendar,
    href: '/calendar',
  },
  {
    label: 'Notatki',
    icon: IconNotes,
    href: '/notes',
  },
  {
    label: 'Statystyki',
    icon: IconChartLine,
    href: '/analytics',
  },
];

const bottomItems = [
  {
    label: 'Ustawienia',
    icon: IconSettings,
    href: '/settings',
  },
  {
    label: 'Wyloguj',
    icon: IconLogout,
    href: '/logout',
    color: 'red',
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const [drawerProgress, setDrawerProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();
  const { currentPalette, isDark, mantineTheme } = useTheme();

  // Dodaj gesty tylko na mobile
  useGestures({
    enableDrawer: isMobile,
    isDrawerOpen: opened,
    onDrawerOpen: () => {
      if (isMobile) {
        toggle();
      }
    },
    onDrawerClose: () => {
      if (isMobile && opened) {
        toggle();
      }
    },
    onDrawerProgress: setDrawerProgress,
  });

  return (
    <>
      {/* Overlay to close menu when clicking outside */}
      {opened && isMobile &&
        createPortal(
          <Transition
            mounted={opened}
            transition='fade'
            duration={200}
            timingFunction='ease'
          >
            {styles => (
              <Box
                style={{
                  ...styles,
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: 9997, // Below navbar but above other content
                  pointerEvents: 'auto',
                }}
                onClick={close}
              />
            )}
          </Transition>,
          document.body
        )}

      {/* Drawer Overlay for gesture feedback */}
      {isMobile && (
        <DrawerOverlay 
          isVisible={drawerProgress > 0} 
          progress={drawerProgress} 
        />
      )}
      
      {/* Mobile Navigation - shown only on mobile */}
      {isMobile && <MobileNavigation />}
      <AppShell
        header={{ height: 70 }}
        navbar={{
          width: 280,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding='md'
        style={{
          '--app-shell-navbar-width': '280px',
        }}
      >
        {/* Header */}
        <AppShell.Header
          style={{
            backgroundColor: currentPalette.surface,
            borderBottom: `1px solid ${currentPalette.primary}`,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            color: currentPalette.text,
          }}
        >
          <Group h='100%' justify='space-between' w='100%'>
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom='sm'
                size='sm'
                color={currentPalette.text}
              />
              <Text
                size='xl'
                fw={700}
                style={{ color: currentPalette.text }}
                visibleFrom='sm'
              >
                P
              </Text>
            </Group>

            <Group gap='md'>
              <Text size='sm' style={{ color: `${currentPalette.text}B3` }}>
                Dr Anna Terapeutka
              </Text>
            </Group>
          </Group>
        </AppShell.Header>

        {/* Sidebar */}
        <AppShell.Navbar
          style={{
            backgroundColor: currentPalette.surface,
            borderRight: `1px solid ${currentPalette.primary}`,
            padding: '24px 16px',
            color: currentPalette.text,
            zIndex: 9998, // Above overlay
          }}
        >
          <ScrollArea style={{ height: '100%' }}>
            <Stack gap='lg' h='100%'>
              {/* Logo/Brand */}
              <Group gap='md' style={{ padding: '0 8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: currentPalette.primary,
                    borderRadius: mantineTheme.radius?.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 2px 8px ${currentPalette.primary}30`,
                    transition: 'all 200ms ease-out',
                  }}
                >
                  <Text
                    fw={700}
                    size='sm'
                    style={{
                      color: isDark
                        ? currentPalette.background
                        : currentPalette.surface,
                    }}
                  >
                    P
                  </Text>
                </div>
                <Text
                  size='lg'
                  fw={600}
                  style={{
                    letterSpacing: '-0.01em',
                    color: currentPalette.text,
                  }}
                >
                  P
                </Text>
              </Group>

              {/* Main Navigation */}
              <Stack gap='xs' style={{ flex: 1 }}>
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <NavLink
                      key={item.href}
                      component={Link}
                      to={item.href}
                      label={item.label}
                      leftSection={<Icon size={20} stroke={1.5} />}
                      active={isActive}
                      onClick={() => {
                        if (isMobile) {
                          toggle();
                        }
                      }}
                      style={{
                        borderRadius: mantineTheme.radius?.md,
                        fontWeight: 500,
                        fontSize: mantineTheme.fontSizes?.sm,
                        padding: '12px 16px',
                        transition: 'all 200ms ease-out',
                        backgroundColor: isActive
                          ? currentPalette.primary
                          : 'transparent',
                        color: isActive
                          ? isDark
                            ? currentPalette.background
                            : currentPalette.surface
                          : currentPalette.text,
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            backgroundColor: isActive
                              ? currentPalette.accent
                              : `${currentPalette.accent}30`,
                          },
                        },
                      }}
                    />
                  );
                })}
              </Stack>

              {/* Bottom Navigation */}
              <Stack
                gap='xs'
                style={{
                  borderTop: `1px solid ${currentPalette.primary}40`,
                  paddingTop: '16px',
                }}
              >
                {bottomItems.map(item => {
                  const Icon = item.icon;
                  const isRed = item.color === 'red';

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
                        borderRadius: mantineTheme.radius?.md,
                        fontWeight: 500,
                        fontSize: mantineTheme.fontSizes?.sm,
                        padding: '12px 16px',
                        transition: 'all 200ms ease-out',
                        color: isRed ? '#ef4444' : currentPalette.text,
                      }}
                      styles={{
                        root: {
                          '&:hover': {
                            backgroundColor: isRed
                              ? '#ef444420'
                              : `${currentPalette.accent}30`,
                          },
                        },
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
            backgroundColor: currentPalette.background,
            minHeight: 'calc(100vh - 70px)',
            paddingBottom: isMobile ? '100px' : '0', // Space for mobile navigation
            color: currentPalette.text,
          }}
        >
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  );
};
