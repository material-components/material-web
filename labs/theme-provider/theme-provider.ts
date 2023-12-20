import { customElement } from "lit/decorators.js";
import { MaterialThemeProvider } from "./internal/theme-provider";

declare global {
    interface HTMLElementTagNameMap {
      'md-theme-provider': MDMaterialThemeProvider;
    }
  }

/**
 * <md-theme-provider> generates a set of style sheets to the component.
 * 
 * @example
 * <md-theme-provider source-color="#ECAA2E" dark>
 *     // ...
 * </md-theme-provider>
 */
@customElement('md-theme-provider')
export class MDMaterialThemeProvider extends MaterialThemeProvider {

}