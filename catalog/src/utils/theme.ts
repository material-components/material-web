import { themeFromSourceColor, applyTheme } from './material-color-helpers.js';

type ColorMode = 'light' | 'dark' | 'auto';

function applyThemeFromColor(color: string, isDark: boolean) {
  const theme = themeFromSourceColor(color, isDark);
  applyTheme(document, theme);
  window.dispatchEvent(new Event('theme-changed'));
  return theme;
}

function isModeDark(mode: ColorMode) {
  let isDark = mode === 'dark';

  if (mode === 'auto') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('last-auto-color-mode', isDark ? 'dark' : 'light');
  }

  return isDark;
}

function changeColor(color: string) {
  const lastColorMode = localStorage.getItem('color-mode') as ColorMode;

  const isDark = isModeDark(lastColorMode);
  const theme = applyThemeFromColor(color, isDark);

  localStorage.setItem('seed-color', color);
  return theme;
}

function changeColorMode(mode: ColorMode) {
  const color = localStorage.getItem('seed-color') as string;
  const isDark = isModeDark(mode);
  const theme = applyThemeFromColor(color, isDark);

  localStorage.setItem('color-mode', mode);
  return theme;
}

function changeColorAndMode(color: string, mode: ColorMode) {
  const isDark = isModeDark(mode);
  const theme = applyThemeFromColor(color, isDark);

  localStorage.setItem('seed-color', color);
  localStorage.setItem('color-mode', mode);
  return theme;
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('change-color', (event) => {
    const color = event.color;
    const theme = changeColor(color);
    event.theme = theme;
  });

  document.body.addEventListener('change-mode', (event) => {
    const mode = event.mode;
    const theme = changeColorMode(mode);
    event.theme = theme;
  });

  document.body.addEventListener('change-color-and-mode', (event) => {
    const color = event.color;
    const mode = event.mode;
    const theme = changeColorAndMode(color, mode);
    event.theme = theme;
  });
});

if (!localStorage.getItem('theme-string')) {
  changeColorAndMode('#81ea6c', 'auto');
}

// listen for automatic color change
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (event) => {
    const lastSeedColor = localStorage.getItem('seed-color') as string;
    changeColor(lastSeedColor);
  });

const actualColorMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const lastAutoColorMode = localStorage.getItem('last-auto-color-mode') as 'light' | 'dark';
const isAuto = localStorage.getItem('color-mode') === 'auto';

if (isAuto && actualColorMode !== lastAutoColorMode) {
  changeColorMode('auto');
}
