/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Support CSS import attributes for GitHub builds:
// `import styles from './styles.css' with {type: 'css'};`
declare module '*.css' {
  const styles: CSSStyleSheet;
  export default styles;
}
