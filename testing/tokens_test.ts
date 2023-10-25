/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {css} from 'lit';

import {getUndefinedTokens, getUnusedTokens} from './tokens.js';

describe('testing', () => {
  describe('tokens', () => {
    describe('getUnusedTokens()', () => {
      it('should return empty when all tokens are used', () => {
        const styles = css`
          :host {
            --_color: var(--md-comp-foo-color);
          }

          .foo {
            color: var(--_color);
          }
        `;

        const unusedTokens = getUnusedTokens([styles]);
        expect(unusedTokens).withContext('unused tokens').toHaveSize(0);
      });

      it('should return tokens that are defined, but not used', () => {
        const styles = css`
          :host {
            --_color: var(--md-comp-foo-color);
            --_unused: var(--md-comp-foo-unused);
          }

          .foo {
            color: var(--_color);
          }
        `;

        const unusedTokens = getUnusedTokens([styles]);
        expect(unusedTokens)
          .withContext('unused tokens')
          .toEqual(['--_unused']);
      });
    });

    describe('getUndefinedTokens()', () => {
      it('should return empty when all tokens are defined', () => {
        const styles = css`
          :host {
            --_color: var(--md-comp-foo-color);
          }

          .foo {
            color: var(--_color);
          }
        `;

        const undefinedTokens = getUndefinedTokens([styles]);
        expect(undefinedTokens).withContext('undefined tokens').toHaveSize(0);
      });

      it('should return tokens that are used and not defined', () => {
        const styles = css`
          :host {
            --_color: var(--md-comp-foo-color);
          }

          .foo {
            color: var(--_color);
            border-radius: var(--_undefined);
          }
        `;

        const undefinedTokens = getUndefinedTokens([styles]);
        expect(undefinedTokens)
          .withContext('undefined tokens')
          .toEqual(['--_undefined']);
      });
    });
  });
});
