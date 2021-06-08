import clsx from 'clsx';
import React from 'react';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-gray-50:text-blue-600',
  inverse: 'bg-white text-blue-600 hover:bg-blue-600:text-white',
  danger: 'bg-red-400 text-white hover:bg-red-50:text-red-600',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2 px-6 text-md',
  lg: 'py-3 px-8 text-lg',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export const Button = ({
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        ' border border-gray-300 rounded-md shadow-sm font-medium focus:outline-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};
