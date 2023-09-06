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

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {dispatchActivationClick, isActivationClick} from '../../internal/controller/events.js';
import {EASING} from '../../internal/motion/animation.js';

interface Tabs extends HTMLElement {
  selected?: number;
  selectedItem?: Tab;
  previousSelectedItem?: Tab;
}

/**
 * Tab component.
 */
export class Tab extends LitElement {
  static {
    requestUpdateOnAriaChange(Tab);
  }

  /** @nocollapse */
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * @private indicates that the element is a tab for `<md-tabs>`
   * @nocollapse
   */
  static readonly isTab = true;

  /**
   * Whether or not the tab is `selected`.
   **/
  @property({type: Boolean, reflect: true}) accessor selected = false;

  /**
   * Whether or not the tab is `focusable`.
   */
  @property({type: Boolean}) accessor focusable = false;

  /**
   * In SSR, set this to true when an icon is present.
   */
  @property({type: Boolean, attribute: 'has-icon'}) accessor hasIcon = false;

  /**
   * In SSR, set this to true when there is no label and only an icon.
   */
  @property({type: Boolean, attribute: 'icon-only'}) accessor iconOnly = false;

  @query('.button')
  private accessor button!: HTMLElement|null;

  // note, this is public so it can participate in selection animation.
  /** @private */
  @query('.indicator')
  accessor indicator!: HTMLElement;
  @state() protected accessor fullWidthIndicator = false;
  @queryAssignedNodes({flatten: true})
  private accessor assignedDefaultNodes!: Node[];
  @queryAssignedElements({slot: 'icon', flatten: true})
  private accessor assignedIcons!: HTMLElement[];

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', this.handleActivationClick);
    }
  }

  override focus() {
    this.button?.focus();
  }

  override blur() {
    this.button?.blur();
  }

  protected override render() {
    const indicator = html`<div class="indicator"></div>`;
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        class="button"
        role="tab"
        .tabIndex=${this.focusable ? 0 : -1}
        aria-selected=${this.selected ? 'true' : 'false'}
        aria-label=${ariaLabel || nothing}
      >
        <md-focus-ring part="focus-ring" inward></md-focus-ring>
        <md-elevation></md-elevation>
        <md-ripple></md-ripple>
        <div class="content ${classMap(this.getContentClasses())}">
          <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
          <slot @slotchange=${this.handleSlotChange}></slot>
          ${this.fullWidthIndicator ? nothing : indicator}
        </div>
        ${this.fullWidthIndicator ? indicator : nothing}
      </button>`;
  }

  protected getContentClasses() {
    return {
      'has-icon': this.hasIcon,
      'has-label': !this.iconOnly,
    };
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has('selected')) {
      this.animateSelected();
    }
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick((event)) || !this.button) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.button);
  };

  private animateSelected() {
    this.indicator.getAnimations().forEach(a => {
      a.cancel();
    });
    const frames = this.getKeyframes();
    if (frames !== null) {
      this.indicator.animate(
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
        (tabs?.previousSelectedItem?.indicator.getBoundingClientRect() ??
         ({} as DOMRect));
    const fromPos = fromRect.left;
    const fromExtent = fromRect.width;
    const toRect = this.indicator.getBoundingClientRect();
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
