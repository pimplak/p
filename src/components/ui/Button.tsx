import { Button as MantineButton, type ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<CustomButtonProps> = ({ 
  variant = 'primary',
  children,
  style,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          border: 'none',
          color: 'var(--color-button-text)',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: 'var(--color-primary-hover)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
          }
        };
      
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          border: '1px solid var(--color-input-border)',
          color: 'var(--color-text)',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary)',
            transform: 'translateY(-1px)',
          }
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-text)',
          }
        };
      
      default:
        return {};
    }
  };

  return (
    <MantineButton
      radius="md"
      size="md"
      style={{
        ...getVariantStyles(),
        minHeight: '44px', // Mobile-friendly touch target
        ...style
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
}; 