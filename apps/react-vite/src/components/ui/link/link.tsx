import { Link as RouterLink, LinkProps } from 'react-router-dom';

import { cn } from '@/utils/cn';

export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn(
        'text-slate-600 hover:text-slate-900 dark:text-white dark:hover:text-slate-300',
        className,
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};
