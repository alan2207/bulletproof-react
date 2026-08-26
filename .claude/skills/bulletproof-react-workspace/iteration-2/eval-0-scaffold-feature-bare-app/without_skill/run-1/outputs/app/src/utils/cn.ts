type ClassValue = string | false | null | undefined;

/** Join conditional class names: cn(styles.button, isActive && styles.active) */
export const cn = (...values: ClassValue[]) => values.filter(Boolean).join(' ');
