import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to manage document direction (RTL/LTR) based on current language
 */
export function useDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const dir = i18n.dir(i18n.language);
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
  }, [i18n, i18n.language]);

  return i18n.dir(i18n.language);
}
