import NextLink, { LinkProps as NextLinkProps } from 'next/link';

import { cn } from '@/utils/cn';

export type LinkProps = {
  className?: string;
  children: React.ReactNode;
  target?: string;
} & NextLinkProps;

export const Link = ({ className, children, href, ...props }: LinkProps) => {
  return (
    <NextLink
      href={href}
      className={cn('text-slate-600 hover:text-slate-900', className)}
      {...props}
    >
      {children}
    </NextLink>
  );
};
