/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FieldState {
  disabled: boolean;
  error: boolean;
  focused: boolean;
  label?: string;
  labelText: string;
  populated: boolean;
  required: boolean;
  visibleLabelType: LabelType;
  readonly floatingLabelRect: Promise<DOMRect>;
  readonly restingLabelRect: Promise<DOMRect>;
}

export interface FilledFieldState extends FieldState {
  strokeTransformOrigin: string;
  readonly rootRect: Promise<DOMRect>;
}

export interface OutlinedFieldState extends FieldState {}

export enum LabelType {
  FLOATING = 'floating',
  RESTING = 'resting',
}

export interface FieldAdapter {
  state: FieldState;
  animateLabel(...args: Parameters<Animatable['animate']>): Promise<Animation>;
}

export interface FilledFieldAdapter extends FieldAdapter {
  state: FilledFieldState;
}

export interface OutlinedFieldAdapter extends FieldAdapter {
  state: OutlinedFieldState;
}
