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
          backgroundColor: '#6366F1',
          border: 'none',
          color: 'white',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: '#4F46E5',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
          }
        };
      
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          border: '1px solid var(--gray-200)',
          color: 'var(--gray-800)',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: 'var(--gray-50)',
            borderColor: 'var(--gray-300)',
            transform: 'translateY(-1px)',
          }
        };
      
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          color: 'var(--gray-600)',
          fontWeight: 500,
          transition: 'all 200ms ease-out',
          '&:hover': {
            backgroundColor: 'var(--gray-100)',
            color: 'var(--gray-800)',
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