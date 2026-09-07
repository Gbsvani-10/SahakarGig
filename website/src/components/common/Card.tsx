import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'flat' | 'bordered' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white rounded-xl border border-gray-200/80 shadow-xs',
    flat: 'bg-gray-50 rounded-xl border border-gray-200/60',
    bordered: 'bg-white rounded-xl border-2 border-emerald-600/30 shadow-xs',
    highlight: 'bg-emerald-50/50 rounded-xl border border-emerald-200 shadow-xs'
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};
