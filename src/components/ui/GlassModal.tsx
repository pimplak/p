import { Modal, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface GlassModalProps extends Omit<ModalProps, 'overlayProps'> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'dark';
}

export const GlassModal: React.FC<GlassModalProps> = ({
  children,
  variant = 'default',
  style,
  styles,
  ...props
}) => {
  const getModalStyles = () => {
    const baseStyles = {
      borderRadius: '12px',
      border: 'none',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    };

    switch (variant) {
      case 'strong':
        return {
          ...baseStyles,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        };

      case 'dark':
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: '1px solid var(--glass-border-dark-theme)',
          color: 'var(--color-text)',
        };

      default:
        return {
          ...baseStyles,
          background: 'var(--color-surface)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--glass-border-dark-theme)',
          color: 'var(--color-text)',
        };
    }
  };

  return (
    <Modal
      centered
      radius="lg"
      overlayProps={{
        style: {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }
      }}
      transitionProps={{
        transition: 'fade',
        duration: 300,
        timingFunction: 'ease-out'
      }}
      style={style}
      styles={{
        content: {
          ...getModalStyles(),
          padding: 0,
        },
        header: {
          background: 'transparent',
          borderBottom: `1px solid var(--glass-border-dark-theme)`,
          padding: '24px 24px 16px',
          borderRadius: '12px 12px 0 0',
          color: 'var(--color-text)',
        },
        body: {
          padding: '16px 24px 24px',
          background: 'transparent',
        },
        close: {
          color: 'var(--color-text)',
          '&:hover': {
            backgroundColor: 'var(--glass-bg-dark-theme)',
          }
        },
        title: {
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          letterSpacing: '-0.01em',
        },
        ...styles,
      }}
      {...props}
    >
      {children}
    </Modal>
  );
}; 