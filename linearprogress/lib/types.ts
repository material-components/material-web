/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Opt-in resize observer types

export interface MDCResizeObserverEntry {
  contentRect: DOMRectReadOnly;
}

export interface MDCResizeObserver {
  new(callback: MDCResizeObserverCallback): MDCResizeObserver;
  disconnect(): void;
  observe(target: Element): void;
}

export interface WithMDCResizeObserver {
  ResizeObserver: MDCResizeObserver;
}

export type MDCResizeObserverCallback =
    (entries: MDCResizeObserverEntry[], observer: MDCResizeObserver) => void;
