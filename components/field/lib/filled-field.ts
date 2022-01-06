/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {queryAsync, state} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';
import {styleMap} from 'lit/directives/style-map';

import {Field} from './field';
import {FilledFieldFoundation} from './foundation';
import {FilledFieldState, LabelType} from './state';

/** @soyCompatible */
export class FilledField extends Field implements FilledFieldState {
  @state() strokeTransformOrigin = '';
  get rootRect() {
    return this.rootEl.then(el => el.getBoundingClientRect());
  }
  @queryAsync('.mdc-field') protected readonly rootEl!: Promise<HTMLElement>;

  protected foundation = new FilledFieldFoundation(
      {state: this, animateLabel: this.animateLabel.bind(this)});

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'mdc-field--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderContainer(): TemplateResult {
    return html`
      <span class="mdc-field__container" @click=${this.handleClick}>
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected override renderContainerContents(): TemplateResult {
    /** @styleMap */
    const strokeStyle = {transformOrigin: this.strokeTransformOrigin};
    return html`
      ${super.renderContainerContents()}
      <span class="mdc-field__active-indicator"
        style="${styleMap(strokeStyle)}"></span>
    `;
  }

  /** @soyTemplate */
  protected override renderMiddleContents(): TemplateResult {
    return html`
      ${this.renderLabel(LabelType.FLOATING)}
      ${this.renderLabel(LabelType.RESTING)}
      ${super.renderMiddleContents()}
    `;
  }

  private handleClick(e: MouseEvent|TouchEvent) {
    this.foundation.handleClick(e);
  }
}
