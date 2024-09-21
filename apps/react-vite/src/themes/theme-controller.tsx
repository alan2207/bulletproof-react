import { useEffect } from 'react';

export const ThemeController = () => {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('prefers-color-scheme: dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return false;
};
