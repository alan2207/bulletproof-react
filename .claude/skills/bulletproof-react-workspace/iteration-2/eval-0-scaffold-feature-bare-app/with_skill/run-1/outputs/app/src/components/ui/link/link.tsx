import { Link as RouterLink, LinkProps } from 'react-router';

/**
 * Wraps the router's Link so app code depends on our interface, not the
 * library's — swapping routers touches this file only.
 */
export const Link = ({ className = '', children, ...props }: LinkProps) => (
  <RouterLink className={className} {...props}>
    {children}
  </RouterLink>
);
