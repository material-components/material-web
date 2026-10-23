/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-loading.js';

import {html, render} from 'lit';
import {
  computeLoadingState,
  evaluateDampedSpring,
  INDETERMINATE_SHAPES,
  interpolateShapes,
  LOADING_CLASSES,
  loadingClasses,
  pointsToSvgPath,
  SHAPE_VERTEX_COUNT,
} from './loading.js';
import {LoadingElement} from './loading-element.js';

describe('md-gb-loading', () => {
  describe('loadingClasses()', () => {
    it('returns default uncontained classes', () => {
      const classes = loadingClasses();
      expect(classes[LOADING_CLASSES.loading]).toBeTrue();
      expect(classes[LOADING_CLASSES.loadingContained]).toBeFalse();
      expect(classes[LOADING_CLASSES.loadingClosed]).toBeFalse();
    });

    it('returns contained classes when contained is true', () => {
      const classes = loadingClasses({contained: true});
      expect(classes[LOADING_CLASSES.loadingContained]).toBeTrue();
    });

    it('returns closed classes when closed is true', () => {
      const classes = loadingClasses({closed: true});
      expect(classes[LOADING_CLASSES.loadingClosed]).toBeTrue();
    });
  });

  describe('shape math & spring physics', () => {
    it('defines exactly 7 shapes with 72 vertices each', () => {
      expect(INDETERMINATE_SHAPES.length).toBe(7);
      for (const shape of INDETERMINATE_SHAPES) {
        expect(shape.length).toBe(SHAPE_VERTEX_COUNT);
        for (const [x, y] of shape) {
          expect(x).toBeGreaterThanOrEqual(-1.01);
          expect(x).toBeLessThanOrEqual(1.01);
          expect(y).toBeGreaterThanOrEqual(-1.01);
          expect(y).toBeLessThanOrEqual(1.01);
        }
      }
    });

    it('evaluates damped spring step response', () => {
      expect(evaluateDampedSpring(0)).toBe(0);
      const mid = evaluateDampedSpring(0.3);
      expect(mid).toBeGreaterThan(0);
      const settled = evaluateDampedSpring(2.0);
      expect(Math.abs(settled - 1.0)).toBeLessThan(0.05);
    });

    it('interpolates between shapes smoothly', () => {
      const at0 = interpolateShapes(0, 1, 0);
      const at1 = interpolateShapes(0, 1, 1);
      expect(at0[0][0]).toBeCloseTo(INDETERMINATE_SHAPES[0][0][0], 4);
      expect(at1[0][0]).toBeCloseTo(INDETERMINATE_SHAPES[1][0][0], 4);
    });

    it('converts points to closed SVG path string', () => {
      const pts = INDETERMINATE_SHAPES[0].slice();
      const pathD = pointsToSvgPath(pts);
      expect(pathD.startsWith('M ')).toBeTrue();
      expect(pathD.endsWith('Z')).toBeTrue();
      expect(pathD).toContain('C ');
    });

    it('computes loading state at elapsed times', () => {
      const state0 = computeLoadingState(0);
      expect(state0.pathD.length).toBeGreaterThan(0);
      expect(state0.rotationDeg).toBeGreaterThanOrEqual(0);

      const state1 = computeLoadingState(650);
      expect(state1.pathD.length).toBeGreaterThan(0);
      expect(state1.rotationDeg).toBeGreaterThanOrEqual(0);
    });
  });

  describe('<md-gb-loading> element', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      container.remove();
    });

    it('renders custom element with progressbar role and loading part', async () => {
      render(
        html` <md-gb-loading aria-label="Loading test"></md-gb-loading> `,
        container,
      );
      const el = container.querySelector('md-gb-loading') as LoadingElement;
      expect(el).not.toBeNull();
      expect(el).toBeInstanceOf(LoadingElement);

      await el.updateComplete;
      const partEl = el.renderRoot.querySelector('[part="loading"]');
      expect(partEl).not.toBeNull();
      expect(partEl?.getAttribute('role')).toBe('progressbar');
      expect(partEl?.getAttribute('aria-label')).toBe('Loading test');
    });

    it('applies contained styling class when contained is set', async () => {
      render(html` <md-gb-loading contained></md-gb-loading> `, container);
      const el = container.querySelector('md-gb-loading') as LoadingElement;
      await el.updateComplete;

      const partEl = el.renderRoot.querySelector('[part="loading"]');
      expect(partEl?.classList.contains('loading-contained')).toBeTrue();
    });

    it('applies closed styling class when closed is set', async () => {
      render(html` <md-gb-loading closed></md-gb-loading> `, container);
      const el = container.querySelector('md-gb-loading') as LoadingElement;
      await el.updateComplete;

      const partEl = el.renderRoot.querySelector('[part="loading"]');
      expect(partEl?.classList.contains('loading-closed')).toBeTrue();
    });
  });
});
