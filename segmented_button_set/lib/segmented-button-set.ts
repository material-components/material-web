/**
 * @requirecss {segmented_button_set.lib.shared_styles}
 *
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ariaProperty} from '@material/web/decorators/aria-property';
import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {SegmentedButton} from '../../segmented_button/lib/segmented-button';

/**
 * SegmentedButtonSet is the parent component for two or more
 * `SegmentedButton` components. **Only** `SegmentedButton` components may be
 * used as children.
 * @soyCompatible
 */
export class SegmentedButtonSet extends LitElement {
  @property({type: Boolean}) multiselect = false;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @queryAssignedElements({flatten: true}) buttons!: SegmentedButton[];

  private handleSegmentedButtonInteraction(e: CustomEvent) {
    // TODO(b/229912696): Support interactions.
    const index = this.buttons.indexOf(e.target as SegmentedButton);
    this.toggleSelection(index);
  }

  private toggleSelection(index: number) {
    if (this.indexOutOfBounds(index)) return;
    if (this.multiselect) {
      this.buttons[index].selected = !this.buttons[index].selected;
      return;
    }
    // Single-select segmented buttons are not unselectable.
    this.buttons[index].selected = true;
    // Deselect all other buttons for single-select.
    for (let i = 0; i < this.buttons.length; i++) {
      if (i === index) continue;
      this.buttons[i].selected = false;
    }
  }

  private indexOutOfBounds(index: number): boolean {
    return index < 0 || index >= this.buttons.length;
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
    <span
      role="group"
      @segmented-button-interaction="${this.handleSegmentedButtonInteraction}"
      aria-label="${ifDefined(this.ariaLabel)}"
      class="md3-segmented-button-set ${classMap(this.getRenderClasses())}">
      <slot></slot>
    </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
        // TODO(b/213634341): Write styles.
    };
  }
}
