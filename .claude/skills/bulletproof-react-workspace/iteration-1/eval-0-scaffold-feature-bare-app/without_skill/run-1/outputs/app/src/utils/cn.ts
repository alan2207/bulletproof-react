type ClassValue = string | number | null | undefined | false;

/** Join conditional class names, dropping falsy values. */
export const cn = (...classes: ClassValue[]) =>
  classes.filter(Boolean).join(' ');
