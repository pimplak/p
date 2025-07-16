import { Group, Text, UnstyledButton } from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconCalendar,
  type Icon,
} from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAppointmentStore } from '../../stores/useAppointmentStore';

interface NavigationItem {
  id: string;
  label: string;
  icon: Icon;
  href: string;
  badge?: number;
}

interface MobileNavigationProps {
  onItemClick?: (item: NavigationItem) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onItemClick,
}) => {
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { appointments } = useAppointmentStore();
  const { currentPalette } = useTheme();

  // Liczenie dzisiejszych wizyt które jeszcze się nie odbyły - reactive na appointments
  const todaysPendingAppointments = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    const now = new Date();

    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate >= startOfDay &&
        appointmentDate <= endOfDay &&
        appointmentDate > now &&
        appointment.status === 'scheduled'
      );
    }).length;
  }, [appointments]);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: IconDashboard,
      href: '/',
    },
    {
      id: 'patients',
      label: 'Pacjenci',
      icon: IconUsers,
      href: '/patients',
    },
    {
      id: 'calendar',
      label: 'Kalendarz',
      icon: IconCalendar,
      href: '/calendar',
      badge:
        todaysPendingAppointments > 0 ? todaysPendingAppointments : undefined,
    },
    // {
    //   id: 'notes',
    //   label: 'Notatki',
    //   icon: IconNotes,
    //   href: '/notes',
    // },
    // {
    //   id: 'analytics',
    //   label: 'Statystyki',
    //   icon: IconChartLine,
    //   href: '/analytics',
    // },
  ];

  const handleItemPress = (item: NavigationItem) => {
    setPressedItem(item.id);
    setTimeout(() => setPressedItem(null), 150);
    navigate(item.href);
    onItemClick?.(item);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: currentPalette.surface,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${currentPalette.primary}`,
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.05)',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
        willChange: 'backdrop-filter',
        minHeight: '80px', // Zapewnij minimalną wysokość
      }}
    >
      <Group justify='space-around' gap={0}>
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const isPressed = pressedItem === item.id;

          return (
            <UnstyledButton
              key={item.id}
              onClick={() => handleItemPress(item)}
              className='mobile-nav-item'
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '12px',
                minWidth: '60px',
                transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: `scale(${isPressed ? '0.95' : '1'})`,
                backgroundColor: isActive
                  ? `${currentPalette.primary}20`
                  : isPressed
                    ? `${currentPalette.accent}30`
                    : 'transparent',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  marginBottom: '4px',
                }}
              >
                <Icon
                  size={24}
                  stroke={1.5}
                  style={{
                    color: isActive
                      ? currentPalette.primary
                      : currentPalette.text,
                    transition: 'all 200ms ease-out',
                    transform: `translateY(${isActive ? '-1px' : '0'})`,
                    filter: isActive
                      ? `drop-shadow(0 2px 4px ${currentPalette.primary})`
                      : 'none',
                  }}
                />

                {/* Badge */}
                {item.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9px',
                      backgroundColor: currentPalette.accent,
                      color: currentPalette.surface,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 8px ${currentPalette.accent}30`,
                      animation: 'liquid-float 3s ease-in-out infinite',
                    }}
                  >
                    {item.badge}
                  </div>
                )}
              </div>

              <Text
                size='xs'
                fw={isActive ? 600 : 500}
                style={{
                  color: isActive
                    ? currentPalette.primary
                    : currentPalette.text,
                  transition: 'all 200ms ease-out',
                  fontSize: '0.75rem',
                  lineHeight: '1',
                  textAlign: 'center',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.label}
              </Text>
            </UnstyledButton>
          );
        })}
      </Group>

      {/* iOS-style home indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '134px',
          height: '5px',
          backgroundColor: currentPalette.text,
          opacity: 0.3,
          borderRadius: '2.5px',
        }}
      />
    </nav>
  );
};
