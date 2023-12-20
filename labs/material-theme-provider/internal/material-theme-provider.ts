import { html, LitElement } from "lit";
import {
    argbFromHex,
    Hct,
    hexFromArgb,
    MaterialDynamicColors,
    SchemeContent,
    Theme,
} from '@material/material-color-utilities';
import { property } from "lit/decorators";

/**
 * A Mapping of color token name to MCU HCT color function generator.
 */
const materialColors = {
    background: MaterialDynamicColors.background,
    'on-background': MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    'surface-dim': MaterialDynamicColors.surfaceDim,
    'surface-bright': MaterialDynamicColors.surfaceBright,
    'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
    'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
    'surface-container': MaterialDynamicColors.surfaceContainer,
    'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
    'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
    'on-surface': MaterialDynamicColors.onSurface,
    'surface-variant': MaterialDynamicColors.surfaceVariant,
    'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
    'inverse-surface': MaterialDynamicColors.inverseSurface,
    'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    'outline-variant': MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    'surface-tint': MaterialDynamicColors.surfaceTint,
    primary: MaterialDynamicColors.primary,
    'on-primary': MaterialDynamicColors.onPrimary,
    'primary-container': MaterialDynamicColors.primaryContainer,
    'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
    'inverse-primary': MaterialDynamicColors.inversePrimary,
    secondary: MaterialDynamicColors.secondary,
    'on-secondary': MaterialDynamicColors.onSecondary,
    'secondary-container': MaterialDynamicColors.secondaryContainer,
    'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    'on-tertiary': MaterialDynamicColors.onTertiary,
    'tertiary-container': MaterialDynamicColors.tertiaryContainer,
    'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    'on-error': MaterialDynamicColors.onError,
    'error-container': MaterialDynamicColors.errorContainer,
    'on-error-container': MaterialDynamicColors.onErrorContainer,
};

export class MDMaterialThemeProvider extends LitElement {

    @property({ attribute: 'source-color', type: String }) public sourceColor = '#E8DEF8';

    @property({ attribute: 'dark', type: Boolean }) public isDark = false;

    private createStyleText(theme: Theme): string {
        let styleString = '';
        for (const [k, v] of Object.entries(theme)) {
            styleString += `--md-sys-color-${k}: ${v};`;
        }
        return styleString;
    }
    private createThemeFromSourceColor(color: string, isDark: boolean): Theme {
        const scheme = new SchemeContent(Hct.fromInt(argbFromHex(color)), isDark, 0);
        const theme: Record<string, any> = {};
      
        for (const [key, value] of Object.entries(materialColors)) {
          theme[key] = hexFromArgb(value.getArgb(scheme));
        }
        return theme as Theme;
      }

    /**
     * Generate material tokens
     */
    public applyTheme(): void {
        // Generate Styles
        const theme = this.createThemeFromSourceColor(this.sourceColor, this.isDark);

        // Generate StyleText
        const styleText = this.createStyleText(theme);

        // Set styles to DOM's style
        this.setAttribute('style', styleText);
    }

    override connectedCallback(): void {
        super.connectedCallback();
        this.applyTheme();
    }

    protected override render() {
        return html`
            <div>
                <slot></slot>
            </div>
        `
    }
}