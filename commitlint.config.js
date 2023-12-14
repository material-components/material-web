/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // Use "/" for multiple scopes: `fix(button/checkbox): subject"`
        // Omit scope for broad "all" changes.
        'button',
        'catalog',
        'checkbox',
        'chips',
        'color',
        'dialog',
        'divider',
        'elevation',
        'fab',
        'field',
        'focus',
        'icon',
        'iconbutton',
        'labs',
        'list',
        'menu',
        'progress',
        'radio',
        'ripple',
        'select',
        'slider',
        'switch',
        'tabs',
        'textfield',
        'tokens',
        'typography',
      ],
    ],
  },
};
