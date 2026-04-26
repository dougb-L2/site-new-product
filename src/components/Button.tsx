"use client";

import Link from 'next/link';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 inline-flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-learn2-orange text-white hover:bg-orange-sky',
    secondary: 'bg-learn2-gray text-white hover:bg-learn2-dark',
    outline: 'border-2 border-learn2-orange text-learn2-orange hover:bg-learn2-light',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClassName}>
      {children}
    </button>
  );
}
