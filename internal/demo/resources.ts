/** @license Googler-authored internal-only code. */

import {TrustedResourceUrl, trustedResourceUrl} from 'safevalues';
import {safeLinkEl} from 'safevalues/dom.js';

/** URL component to load Roboto font. */
export const ROBOTO_FONT_URL =
    trustedResourceUrl`https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap`;
/** URL component to load Google Sans font. */
export const GOOGLE_SANS_FONT_URL =
    trustedResourceUrl`https://fonts.googleapis.com/css2?family=Google+Sans:opsz,wght@17..18,400;17..18,500;17..18,700&display=swap`;
/** URL component to load Material Icons font. */
export const MATERIAL_ICONS_URL =
    trustedResourceUrl`https://fonts.googleapis.com/icon?family=Material+Icons`;
/** URL component to load Material Symbols icon font. */
export const MATERIAL_SYMBOLS_URL =
    trustedResourceUrl`https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined`;

/**
 * Adds a `<link>` tag child into the given parent node (defaults to the
 * document head).
 *
 * @param url Fonts API URL component that needs be inserted into the dom.
 * @param parent The element to insert the `<link>` into, defaults to
 *     `document.head`. Set this to a ShadowRoot to load a CSS url only for
 *     a specific element.
 * @return A Promise that resolves when the CSS url is loaded.
 */
export function loadCssUrl(
    url: TrustedResourceUrl, parent: Element = document.head) {
  return new Promise<void>((resolve, reject) => {
    for (const otherLink of parent.querySelectorAll('link')) {
      if (otherLink.href === url.toString()) {
        // Font is already loaded
        resolve();
        return;
      }
    }

    const link = document.createElement('link');
    safeLinkEl.setHrefAndRel(link, url, 'stylesheet');
    link.onload = () => {
      resolve();
    };

    link.onerror = () => {
      reject(new Error(`Failed to load CSS stylesheet: ${url}`));
    };

    parent.appendChild(link);
  });
}
