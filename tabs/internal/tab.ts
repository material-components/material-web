/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAssignedElements, queryAssignedNodes, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {polyfillElementInternalsAria, setupHostAria} from '../../internal/aria/aria.js';
import {EASING} from '../../internal/motion/animation.js';

interface Tabs extends HTMLElement {
  selected?: number;
  selectedItem?: Tab;
  previousSelectedItem?: Tab;
}

/**
 * Symbol for tabs to use to animate their indicators based off another tab's
 * indicator.
 */
const INDICATOR = Symbol('indicator');

/**
 * Tab component.
 */
export class Tab extends LitElement {
  static {
    setupHostAria(Tab);
  }

  /**
   * Whether or not the tab is `selected`.
   **/
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * In SSR, set this to true when an icon is present.
   */
  @property({type: Boolean, attribute: 'has-icon'}) hasIcon = false;

  /**
   * In SSR, set this to true when there is no label and only an icon.
   */
  @property({type: Boolean, attribute: 'icon-only'}) iconOnly = false;

  @query('.indicator') readonly[INDICATOR]!: HTMLElement|null;
  @state() protected fullWidthIndicator = false;
  @queryAssignedNodes({flatten: true})
  private readonly assignedDefaultNodes!: Node[];
  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];
  private readonly internals = polyfillElementInternalsAria(
      this, (this as HTMLElement /* needed for closure */).attachInternals());

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = 'tab';
      this.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  protected override render() {
    const indicator = html`<div class="indicator"></div>`;
    return html`
      <div class="button" role="presentation">
        <md-focus-ring part="focus-ring" inward
            .control=${this}></md-focus-ring>
        <md-elevation></md-elevation>
        <md-ripple .control=${this}></md-ripple>
        <div class="content ${classMap(this.getContentClasses())}"
            role="presentation">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
          <slot @slotchange=${this.handleSlotChange}></slot>
          ${this.fullWidthIndicator ? nothing : indicator}
        </div>
        ${this.fullWidthIndicator ? indicator : nothing}
      </div>`;
  }

  protected getContentClasses() {
    return {
      'has-icon': this.hasIcon,
      'has-label': !this.iconOnly,
    };
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has('selected')) {
      this.internals.ariaSelected = String(this.selected);
      this.animateSelected();
    }
  }

  private async handleKeydown(event: KeyboardEvent) {
    // Allow event to bubble.
    await 0;
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      // Prevent default behavior such as scrolling when pressing spacebar.
      event.preventDefault();
      this.click();
    }
  }

  private animateSelected() {
    if (!this[INDICATOR]) {
      return;
    }

    this[INDICATOR].getAnimations().forEach(a => {
      a.cancel();
    });
    const frames = this.getKeyframes();
    if (frames !== null) {
      this[INDICATOR].animate(
          frames, {duration: 250, easing: EASING.EMPHASIZED});
    }
  }

  private getKeyframes() {
    const reduceMotion = shouldReduceMotion();
    if (!this.selected) {
      return reduceMotion ? [{'opacity': 1}, {'transform': 'none'}] : null;
    }

    // TODO(b/298105040): avoid hardcoding selector
    const tabs = this.closest<Tabs>('md-tabs');
    const from: Keyframe = {};
    const fromRect =
        (tabs?.previousSelectedItem?.[INDICATOR]?.getBoundingClientRect() ??
         ({} as DOMRect));
    const fromPos = fromRect.left;
    const fromExtent = fromRect.width;
    const toRect = this[INDICATOR]!.getBoundingClientRect();
    const toPos = toRect.left;
    const toExtent = toRect.width;
    const scale = fromExtent / toExtent;
    if (!reduceMotion && fromPos !== undefined && toPos !== undefined &&
        !isNaN(scale)) {
      from['transform'] = `translateX(${
          (fromPos - toPos).toFixed(4)}px) scaleX(${scale.toFixed(4)})`;
    } else {
      from['opacity'] = 0;
    }
    // note, including `transform: none` avoids quirky Safari behavior
    // that can hide the animation.
    return [from, {'transform': 'none'}];
  }

  private handleSlotChange() {
    this.iconOnly = false;
    // Check if there's any label text or elements. If not, then there is only
    // an icon.
    for (const node of this.assignedDefaultNodes) {
      const hasTextContent = node.nodeType === Node.TEXT_NODE &&
          !!(node as Text).wholeText.match(/\S/);
      if (node.nodeType === Node.ELEMENT_NODE || hasTextContent) {
        return;
      }
    }

    this.iconOnly = true;
  }

  private handleIconSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
