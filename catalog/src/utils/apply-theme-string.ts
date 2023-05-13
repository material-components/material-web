export function applyThemeString(
  doc: DocumentOrShadowRoot,
  themeString: string,
  ssName = 'material-theme'
) {
  let sheet = (globalThis as any)[ssName] as CSSStyleSheet | undefined;

  if (!sheet) {
    sheet = new CSSStyleSheet();
    (globalThis as any)[ssName] = sheet;
    doc.adoptedStyleSheets.push(sheet);
  }

  sheet.replaceSync(themeString);

  localStorage.setItem('theme-string', themeString);
}