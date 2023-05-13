import { applyThemeString } from '../utils/apply-theme-string.js';

const lastThemeString =
  (localStorage.getItem('theme-string') as string | null);

if (lastThemeString) {
  applyThemeString(document, lastThemeString);
}
