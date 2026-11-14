import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const base = 'font-medium rounded-btn px-4 py-2 min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deepBlue';
  const styles = variant === 'primary' ? 'bg-deepBlue text-white hover:bg-deepBlue/90' : 'bg-transparent border border-deepBlue text-deepBlue hover:bg-mist';
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
};
