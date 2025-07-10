import { Modal, type ModalProps } from '@mantine/core';
import { useTheme } from '../../hooks/useTheme';

interface GlassModalProps extends ModalProps {
  variant?: 'default' | 'strong' | 'dark';
}

export const GlassModal: React.FC<GlassModalProps> = ({
  children,
  variant = 'default',
  style,
  styles,
  ...props
}) => {
  const { currentPalette } = useTheme();

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
          backgroundColor: currentPalette.surface,
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          border: `1px solid ${currentPalette.primary}40`,
          color: currentPalette.text,
        };

      default:
        return {
          ...baseStyles,
          backgroundColor: currentPalette.surface,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${currentPalette.primary}40`,
          color: currentPalette.text,
        };
    }
  };

  const overlayStyles = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  };

  return (
    <Modal
      style={style}
      styles={{
        content: getModalStyles(),
        overlay: overlayStyles,
        ...styles,
      }}
      overlayProps={{
        opacity: 0.6,
        ...props.overlayProps,
      }}
      {...props}
    >
      {children}
    </Modal>
  );
}; 