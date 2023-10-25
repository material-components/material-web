/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Loads the current theme from the site */

import {PostDoc} from 'postdoc-lib';

// create a constructable stylesheet
const styleSheet = new CSSStyleSheet();
let hasAdopted = false;

/**
 * Applies a string theme to the page.
 *
 * @param theme The stringified theme to apply to the page
 */
function applyTheme(theme: string) {
  // Replaces the theme
  styleSheet.replace(theme);

  // If the style has not been adopted yet, then adopt it to the document.
  if (!hasAdopted) {
    hasAdopted = true;
    document.adoptedStyleSheets.push(styleSheet);
  }
}

/**
 * Apply the theme every time a postdoc pessage is received.
 */
const onMessage = (e: MessageEvent<string>) => {
  applyTheme(e.data);
};

/* Listen to the main document for theme update messages */
const postdoc = new PostDoc({
  // Where to listen for handshake messages
  messageReceiver: window,
  // Where to post messages requesting theme
  messageTarget: window.top!,
  onMessage,
});

await postdoc.handshake;

// Request the initial theme.
postdoc.postMessage('request-theme');
