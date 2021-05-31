import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';
type InputFieldProps = {
  name: string;
  type: 'text' | 'email' | 'password';
  label?: string;
  className?: string;
  registration: Partial<UseFormRegisterReturn>;
};

export const InputField = (props: InputFieldProps) => {
  const { name, type, label, className, registration } = props;
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          type={type}
          className={clsx(
            'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            className
          )}
          {...registration}
        />
      </div>
    </div>
  );
};
