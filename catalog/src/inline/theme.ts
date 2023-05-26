import { applyThemeString } from '../utils/apply-theme-string.js';

const lastThemeString =
  (localStorage.getItem('material-theme') as string | null);

if (lastThemeString) {
  applyThemeString(document, lastThemeString);
}
