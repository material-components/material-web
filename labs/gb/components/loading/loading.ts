/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Number of vertices sampled for each normalized morph shape. */
export const SHAPE_VERTEX_COUNT = 72;

/** Duration per shape transition in milliseconds (matches Android MDC). */
export const DURATION_PER_SHAPE_MS = 650;

/** Constant linear rotation per shape in degrees. */
export const CONSTANT_ROTATION_PER_SHAPE_DEG = 50;

/** Extra spring-driven rotation per shape in degrees. */
export const EXTRA_ROTATION_PER_SHAPE_DEG = 90;

/** Spring stiffness constant (k = 200). */
export const SPRING_STIFFNESS = 200;

/** Spring damping ratio (zeta = 0.6). */
export const SPRING_DAMPING_RATIO = 0.6;

/** Loading class name constants. */
export const LOADING_CLASSES = {
  loading: 'loading',
  loadingClosed: 'loading-closed',
  loadingContained: 'loading-contained',
} as const;

/** State provided to `loadingClasses()`. */
export interface LoadingClassesState {
  /** Whether the indicator is in contained circular badge mode. */
  contained?: boolean;
  /** Whether the indicator is hidden/closed. */
  closed?: boolean;
}

/**
 * Returns loading classes to apply based on the given state.
 */
export function loadingClasses({
  contained = false,
  closed = false,
}: LoadingClassesState = {}): ClassInfo {
  return {
    [LOADING_CLASSES.loading]: true,
    [LOADING_CLASSES.loadingContained]: Boolean(contained),
    [LOADING_CLASSES.loadingClosed]: Boolean(closed),
  };
}

/**
 * A Lit directive that sets the CSS classes on a loading component.
 */
export const loading = createClassMapDirective({
  getClasses: loadingClasses,
});

/** A 2D point [x, y] in normalized space [-1, 1]. */
export type Point = readonly [number, number];

/**
 * Evaluates the normalized analytical step response of a damped harmonic
 * oscillator at time `tSec` (in seconds):
 *
 *   s(t) = 1 - e^(-zeta * omega0 * t) *
 *          [cos(omegaD * t) + (zeta * omega0 / omegaD) * sin(omegaD * t)]
 *
 * With mass m = 1, omega0 = sqrt(k), and omegaD = omega0 * sqrt(1 - zeta^2).
 */
export function evaluateDampedSpring(
  tSec: number,
  stiffness: number = SPRING_STIFFNESS,
  zeta: number = SPRING_DAMPING_RATIO,
): number {
  if (tSec <= 0) return 0;
  const omega0 = Math.sqrt(stiffness);
  const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
  const decay = Math.exp(-zeta * omega0 * tSec);
  const envelope =
    Math.cos(omegaD * tSec) +
    ((zeta * omega0) / omegaD) * Math.sin(omegaD * tSec);
  return 1 - decay * envelope;
}

/** 1. Cookie 12: 12-lobed rounded star from Figma (535:6580). */
const SHAPE_COOKIE_12: Point[] = [
  [0.016, -0.95],
  [0.097, -0.924],
  [0.163, -0.871],
  [0.242, -0.838],
  [0.326, -0.842],
  [0.411, -0.846],
  [0.489, -0.814],
  [0.546, -0.752],
  [0.577, -0.672],
  [0.628, -0.605],
  [0.703, -0.566],
  [0.779, -0.528],
  [0.831, -0.461],
  [0.849, -0.378],
  [0.836, -0.294],
  [0.847, -0.21],
  [0.892, -0.138],
  [0.938, -0.068],
  [0.95, 0.016],
  [0.924, 0.097],
  [0.871, 0.163],
  [0.838, 0.242],
  [0.842, 0.326],
  [0.846, 0.411],
  [0.814, 0.489],
  [0.752, 0.546],
  [0.672, 0.577],
  [0.605, 0.628],
  [0.566, 0.703],
  [0.528, 0.779],
  [0.461, 0.831],
  [0.378, 0.849],
  [0.294, 0.836],
  [0.21, 0.847],
  [0.138, 0.892],
  [0.068, 0.938],
  [-0.016, 0.95],
  [-0.097, 0.924],
  [-0.163, 0.871],
  [-0.242, 0.838],
  [-0.326, 0.842],
  [-0.411, 0.846],
  [-0.489, 0.814],
  [-0.546, 0.752],
  [-0.577, 0.672],
  [-0.628, 0.605],
  [-0.703, 0.566],
  [-0.779, 0.528],
  [-0.831, 0.461],
  [-0.849, 0.378],
  [-0.836, 0.294],
  [-0.847, 0.21],
  [-0.892, 0.138],
  [-0.938, 0.068],
  [-0.95, -0.016],
  [-0.924, -0.097],
  [-0.871, -0.163],
  [-0.838, -0.242],
  [-0.842, -0.326],
  [-0.846, -0.411],
  [-0.814, -0.489],
  [-0.752, -0.546],
  [-0.672, -0.577],
  [-0.605, -0.628],
  [-0.566, -0.703],
  [-0.528, -0.779],
  [-0.461, -0.831],
  [-0.378, -0.849],
  [-0.294, -0.836],
  [-0.21, -0.847],
  [-0.138, -0.892],
  [-0.068, -0.938],
];

/** 2. Cookie 9: 9-lobed scalloped shape from Figma (535:6578). */
const SHAPE_COOKIE_9: Point[] = [
  [0.025, -0.914],
  [0.105, -0.896],
  [0.176, -0.858],
  [0.242, -0.809],
  [0.317, -0.777],
  [0.397, -0.767],
  [0.478, -0.758],
  [0.554, -0.729],
  [0.619, -0.68],
  [0.669, -0.615],
  [0.699, -0.54],
  [0.718, -0.461],
  [0.755, -0.388],
  [0.81, -0.328],
  [0.867, -0.27],
  [0.906, -0.198],
  [0.924, -0.119],
  [0.921, -0.038],
  [0.895, 0.04],
  [0.859, 0.113],
  [0.84, 0.192],
  [0.844, 0.273],
  [0.85, 0.354],
  [0.833, 0.434],
  [0.796, 0.506],
  [0.741, 0.566],
  [0.672, 0.609],
  [0.597, 0.641],
  [0.532, 0.69],
  [0.482, 0.755],
  [0.434, 0.821],
  [0.371, 0.871],
  [0.296, 0.903],
  [0.215, 0.913],
  [0.134, 0.902],
  [0.056, 0.878],
  [-0.025, 0.874],
  [-0.105, 0.892],
  [-0.184, 0.911],
  [-0.265, 0.909],
  [-0.343, 0.886],
  [-0.411, 0.842],
  [-0.466, 0.782],
  [-0.511, 0.714],
  [-0.57, 0.658],
  [-0.643, 0.621],
  [-0.716, 0.585],
  [-0.777, 0.531],
  [-0.821, 0.463],
  [-0.846, 0.385],
  [-0.849, 0.304],
  [-0.839, 0.223],
  [-0.849, 0.142],
  [-0.88, 0.067],
  [-0.913, -0.007],
  [-0.925, -0.088],
  [-0.916, -0.168],
  [-0.884, -0.243],
  [-0.834, -0.307],
  [-0.774, -0.363],
  [-0.73, -0.432],
  [-0.706, -0.509],
  [-0.683, -0.587],
  [-0.64, -0.657],
  [-0.581, -0.712],
  [-0.508, -0.749],
  [-0.429, -0.766],
  [-0.347, -0.771],
  [-0.27, -0.795],
  [-0.201, -0.838],
  [-0.133, -0.884],
  [-0.056, -0.909],
];

/** 3. Pentagon: 5-sided rounded polygon from Figma (535:6564). */
const SHAPE_PENTAGON: Point[] = [
  [0.019, -0.844],
  [0.093, -0.832],
  [0.163, -0.803],
  [0.225, -0.761],
  [0.286, -0.716],
  [0.348, -0.672],
  [0.409, -0.628],
  [0.47, -0.583],
  [0.531, -0.539],
  [0.592, -0.494],
  [0.653, -0.45],
  [0.714, -0.406],
  [0.773, -0.359],
  [0.821, -0.301],
  [0.855, -0.234],
  [0.873, -0.16],
  [0.874, -0.085],
  [0.858, -0.012],
  [0.835, 0.06],
  [0.812, 0.132],
  [0.788, 0.204],
  [0.765, 0.276],
  [0.742, 0.348],
  [0.718, 0.419],
  [0.695, 0.491],
  [0.672, 0.563],
  [0.648, 0.635],
  [0.614, 0.702],
  [0.565, 0.759],
  [0.505, 0.805],
  [0.436, 0.835],
  [0.362, 0.85],
  [0.287, 0.851],
  [0.211, 0.851],
  [0.136, 0.851],
  [0.06, 0.851],
  [-0.015, 0.851],
  [-0.091, 0.851],
  [-0.166, 0.851],
  [-0.242, 0.851],
  [-0.317, 0.851],
  [-0.392, 0.845],
  [-0.464, 0.823],
  [-0.53, 0.786],
  [-0.585, 0.735],
  [-0.627, 0.672],
  [-0.655, 0.602],
  [-0.679, 0.53],
  [-0.702, 0.459],
  [-0.725, 0.387],
  [-0.749, 0.315],
  [-0.772, 0.243],
  [-0.795, 0.171],
  [-0.819, 0.1],
  [-0.842, 0.028],
  [-0.864, -0.044],
  [-0.872, -0.119],
  [-0.863, -0.194],
  [-0.838, -0.265],
  [-0.798, -0.329],
  [-0.744, -0.381],
  [-0.683, -0.426],
  [-0.622, -0.47],
  [-0.561, -0.515],
  [-0.5, -0.559],
  [-0.438, -0.603],
  [-0.377, -0.648],
  [-0.316, -0.692],
  [-0.255, -0.736],
  [-0.194, -0.781],
  [-0.129, -0.818],
  [-0.056, -0.839],
];

/** 4. Pill: stadium / capsule shape from Figma (535:6556). */
const SHAPE_PILL: Point[] = [
  [-0.016, -0.885],
  [0.061, -0.895],
  [0.138, -0.898],
  [0.215, -0.893],
  [0.291, -0.88],
  [0.366, -0.86],
  [0.438, -0.833],
  [0.507, -0.798],
  [0.572, -0.756],
  [0.633, -0.708],
  [0.688, -0.655],
  [0.738, -0.596],
  [0.782, -0.533],
  [0.82, -0.465],
  [0.85, -0.394],
  [0.873, -0.32],
  [0.889, -0.245],
  [0.897, -0.168],
  [0.897, -0.091],
  [0.89, -0.014],
  [0.875, 0.062],
  [0.852, 0.136],
  [0.823, 0.207],
  [0.786, 0.275],
  [0.742, 0.339],
  [0.693, 0.398],
  [0.639, 0.453],
  [0.584, 0.508],
  [0.529, 0.563],
  [0.475, 0.617],
  [0.42, 0.672],
  [0.363, 0.724],
  [0.3, 0.77],
  [0.234, 0.809],
  [0.164, 0.842],
  [0.091, 0.867],
  [0.016, 0.885],
  [-0.061, 0.895],
  [-0.138, 0.898],
  [-0.215, 0.893],
  [-0.291, 0.88],
  [-0.366, 0.86],
  [-0.438, 0.833],
  [-0.507, 0.798],
  [-0.572, 0.756],
  [-0.633, 0.708],
  [-0.688, 0.655],
  [-0.738, 0.596],
  [-0.782, 0.533],
  [-0.82, 0.465],
  [-0.85, 0.394],
  [-0.873, 0.32],
  [-0.889, 0.245],
  [-0.897, 0.168],
  [-0.897, 0.091],
  [-0.89, 0.014],
  [-0.875, -0.062],
  [-0.852, -0.136],
  [-0.823, -0.207],
  [-0.786, -0.275],
  [-0.742, -0.339],
  [-0.693, -0.398],
  [-0.639, -0.453],
  [-0.584, -0.508],
  [-0.529, -0.563],
  [-0.475, -0.617],
  [-0.42, -0.672],
  [-0.363, -0.724],
  [-0.3, -0.77],
  [-0.234, -0.809],
  [-0.164, -0.842],
  [-0.091, -0.867],
];

/** 5. Sunny: 8-pointed star from Figma (535:6570). */
const SHAPE_SUNNY: Point[] = [
  [-0.002, -0.95],
  [0.078, -0.928],
  [0.143, -0.874],
  [0.206, -0.819],
  [0.27, -0.764],
  [0.346, -0.731],
  [0.429, -0.725],
  [0.513, -0.72],
  [0.597, -0.712],
  [0.67, -0.673],
  [0.711, -0.601],
  [0.719, -0.517],
  [0.725, -0.434],
  [0.731, -0.35],
  [0.762, -0.273],
  [0.817, -0.209],
  [0.872, -0.146],
  [0.925, -0.081],
  [0.95, -0.002],
  [0.928, 0.078],
  [0.874, 0.143],
  [0.819, 0.206],
  [0.764, 0.27],
  [0.731, 0.346],
  [0.725, 0.429],
  [0.72, 0.513],
  [0.712, 0.597],
  [0.673, 0.67],
  [0.601, 0.711],
  [0.517, 0.719],
  [0.434, 0.725],
  [0.35, 0.731],
  [0.273, 0.762],
  [0.209, 0.817],
  [0.146, 0.872],
  [0.081, 0.925],
  [0.002, 0.95],
  [-0.078, 0.928],
  [-0.143, 0.874],
  [-0.206, 0.819],
  [-0.27, 0.764],
  [-0.346, 0.731],
  [-0.429, 0.725],
  [-0.513, 0.72],
  [-0.597, 0.712],
  [-0.67, 0.673],
  [-0.711, 0.601],
  [-0.719, 0.517],
  [-0.725, 0.434],
  [-0.731, 0.35],
  [-0.762, 0.273],
  [-0.817, 0.209],
  [-0.872, 0.146],
  [-0.925, 0.081],
  [-0.95, 0.002],
  [-0.928, -0.078],
  [-0.874, -0.143],
  [-0.819, -0.206],
  [-0.764, -0.27],
  [-0.731, -0.346],
  [-0.725, -0.429],
  [-0.72, -0.513],
  [-0.712, -0.597],
  [-0.673, -0.67],
  [-0.601, -0.711],
  [-0.517, -0.719],
  [-0.434, -0.725],
  [-0.35, -0.731],
  [-0.273, -0.762],
  [-0.209, -0.817],
  [-0.146, -0.872],
  [-0.081, -0.925],
];

/** 6. Cookie 4: 4-lobed cookie / clover from Figma (535:6572). */
const SHAPE_COOKIE_4: Point[] = [
  [-0.011, -0.7],
  [0.069, -0.706],
  [0.146, -0.727],
  [0.219, -0.758],
  [0.295, -0.783],
  [0.374, -0.793],
  [0.454, -0.787],
  [0.531, -0.765],
  [0.602, -0.729],
  [0.664, -0.679],
  [0.717, -0.619],
  [0.757, -0.55],
  [0.782, -0.475],
  [0.793, -0.396],
  [0.787, -0.316],
  [0.766, -0.239],
  [0.735, -0.166],
  [0.71, -0.09],
  [0.7, -0.011],
  [0.706, 0.069],
  [0.727, 0.146],
  [0.758, 0.219],
  [0.783, 0.295],
  [0.793, 0.374],
  [0.787, 0.454],
  [0.765, 0.531],
  [0.729, 0.602],
  [0.679, 0.664],
  [0.619, 0.717],
  [0.55, 0.757],
  [0.475, 0.782],
  [0.396, 0.793],
  [0.316, 0.787],
  [0.239, 0.766],
  [0.166, 0.735],
  [0.09, 0.71],
  [0.011, 0.7],
  [-0.069, 0.706],
  [-0.146, 0.727],
  [-0.219, 0.758],
  [-0.295, 0.783],
  [-0.374, 0.793],
  [-0.454, 0.787],
  [-0.531, 0.765],
  [-0.602, 0.729],
  [-0.664, 0.679],
  [-0.717, 0.619],
  [-0.757, 0.55],
  [-0.782, 0.475],
  [-0.793, 0.396],
  [-0.787, 0.316],
  [-0.766, 0.239],
  [-0.735, 0.166],
  [-0.71, 0.09],
  [-0.7, 0.011],
  [-0.706, -0.069],
  [-0.727, -0.146],
  [-0.758, -0.219],
  [-0.783, -0.295],
  [-0.793, -0.374],
  [-0.787, -0.454],
  [-0.765, -0.531],
  [-0.729, -0.602],
  [-0.679, -0.664],
  [-0.619, -0.717],
  [-0.55, -0.757],
  [-0.475, -0.782],
  [-0.396, -0.793],
  [-0.316, -0.787],
  [-0.239, -0.766],
  [-0.166, -0.735],
  [-0.09, -0.71],
];

/** 7. Oval: ellipse rotated at 45 degrees from Figma (535:6554). */
const SHAPE_OVAL: Point[] = [
  [0.023, -0.737],
  [0.088, -0.76],
  [0.154, -0.778],
  [0.222, -0.791],
  [0.291, -0.798],
  [0.36, -0.799],
  [0.428, -0.792],
  [0.495, -0.776],
  [0.56, -0.751],
  [0.619, -0.716],
  [0.672, -0.672],
  [0.716, -0.619],
  [0.751, -0.56],
  [0.776, -0.495],
  [0.792, -0.428],
  [0.799, -0.36],
  [0.798, -0.291],
  [0.791, -0.222],
  [0.778, -0.154],
  [0.76, -0.088],
  [0.737, -0.023],
  [0.711, 0.041],
  [0.68, 0.103],
  [0.646, 0.163],
  [0.609, 0.221],
  [0.569, 0.277],
  [0.526, 0.331],
  [0.481, 0.383],
  [0.433, 0.433],
  [0.383, 0.481],
  [0.331, 0.526],
  [0.277, 0.569],
  [0.221, 0.609],
  [0.163, 0.646],
  [0.103, 0.68],
  [0.041, 0.711],
  [-0.023, 0.737],
  [-0.088, 0.76],
  [-0.154, 0.778],
  [-0.222, 0.791],
  [-0.291, 0.798],
  [-0.36, 0.799],
  [-0.428, 0.792],
  [-0.495, 0.776],
  [-0.56, 0.751],
  [-0.619, 0.716],
  [-0.672, 0.672],
  [-0.716, 0.619],
  [-0.751, 0.56],
  [-0.776, 0.495],
  [-0.792, 0.428],
  [-0.799, 0.36],
  [-0.798, 0.291],
  [-0.791, 0.222],
  [-0.778, 0.154],
  [-0.76, 0.088],
  [-0.737, 0.023],
  [-0.711, -0.041],
  [-0.68, -0.103],
  [-0.646, -0.163],
  [-0.609, -0.221],
  [-0.569, -0.277],
  [-0.526, -0.331],
  [-0.481, -0.383],
  [-0.433, -0.433],
  [-0.383, -0.481],
  [-0.331, -0.526],
  [-0.277, -0.569],
  [-0.221, -0.609],
  [-0.163, -0.646],
  [-0.103, -0.68],
  [-0.041, -0.711],
];

/**
 * Collection of the 7 normalized geometric shapes used in indeterminate loading.
 */
export const INDETERMINATE_SHAPES: ReadonlyArray<Point[]> = [
  SHAPE_COOKIE_12,
  SHAPE_COOKIE_9,
  SHAPE_PENTAGON,
  SHAPE_PILL,
  SHAPE_SUNNY,
  SHAPE_COOKIE_4,
  SHAPE_OVAL,
] as const;

/**
 * Linearly interpolates between two shapes using Catmull-Rom cubic splines.
 */
export function interpolateShapes(
  fromIdx: number,
  toIdx: number,
  fraction: number,
): Point[] {
  const len = INDETERMINATE_SHAPES.length;
  const safeFrom = ((Math.floor(fromIdx) % len) + len) % len;
  const safeTo = ((Math.floor(toIdx) % len) + len) % len;
  const shapeA = INDETERMINATE_SHAPES[safeFrom];
  const shapeB = INDETERMINATE_SHAPES[safeTo];
  if (!shapeA || !shapeB) return [];
  const t = Math.max(0, Math.min(1, fraction));
  const points: Point[] = [];
  for (let i = 0; i < SHAPE_VERTEX_COUNT; i++) {
    const ax = shapeA[i][0];
    const ay = shapeA[i][1];
    const bx = shapeB[i][0];
    const by = shapeB[i][1];
    points.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
  }
  return points;
}

/**
 * Converts sampled polygon points into a smooth SVG path `d` string using
 * closed Catmull-Rom cubic Bézier curve segments.
 */
export function pointsToSvgPath(pts: Point[]): string {
  const n = pts.length;
  if (n === 0) return '';
  const d: string[] = [`M ${pts[0][0].toFixed(3)} ${pts[0][1].toFixed(3)}`];
  for (let i = 0; i < n; i++) {
    const pPrev = pts[(i - 1 + n) % n];
    const p0 = pts[i];
    const p1 = pts[(i + 1) % n];
    const pNext = pts[(i + 2) % n];
    const cp1x = p0[0] + (p1[0] - pPrev[0]) / 6;
    const cp1y = p0[1] + (p1[1] - pPrev[1]) / 6;
    const cp2x = p1[0] - (pNext[0] - p0[0]) / 6;
    const cp2y = p1[1] - (pNext[1] - p0[1]) / 6;
    d.push(
      `C ${cp1x.toFixed(3)} ${cp1y.toFixed(3)} ${cp2x.toFixed(3)} ${cp2y.toFixed(
        3,
      )} ${p1[0].toFixed(3)} ${p1[1].toFixed(3)}`,
    );
  }
  d.push('Z');
  return d.join(' ');
}

/** Pre-computed static SVG path strings for each of the 7 shapes. */
export const SHAPE_SVG_PATHS: readonly string[] =
  INDETERMINATE_SHAPES.map(pointsToSvgPath);

/**
 * Computes current SVG path string and rotation angle based on elapsed time.
 */
export function computeLoadingState(elapsedMs: number): {
  pathD: string;
  rotationDeg: number;
} {
  const safeElapsedMs = Math.max(0, elapsedMs);
  const totalShapes = INDETERMINATE_SHAPES.length;
  const currentStep = Math.floor(safeElapsedMs / DURATION_PER_SHAPE_MS);
  const stepTime = (safeElapsedMs % DURATION_PER_SHAPE_MS) / 1000;
  const timeFactor =
    (safeElapsedMs % DURATION_PER_SHAPE_MS) / DURATION_PER_SHAPE_MS;
  const springFactor = Math.min(1, evaluateDampedSpring(stepTime));

  const fromIdx = ((currentStep % totalShapes) + totalShapes) % totalShapes;
  const toIdx = (((currentStep + 1) % totalShapes) + totalShapes) % totalShapes;

  const currentPoints = interpolateShapes(fromIdx, toIdx, springFactor);
  const pathD = pointsToSvgPath(currentPoints);

  const baseRotation =
    (CONSTANT_ROTATION_PER_SHAPE_DEG + EXTRA_ROTATION_PER_SHAPE_DEG) *
    currentStep;
  const constRotation = CONSTANT_ROTATION_PER_SHAPE_DEG * timeFactor;
  const springRotation = EXTRA_ROTATION_PER_SHAPE_DEG * springFactor;
  const rotationDeg = (baseRotation + constRotation + springRotation) % 360;

  return {pathD, rotationDeg};
}
