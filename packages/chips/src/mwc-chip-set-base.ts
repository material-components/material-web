/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {BaseElement, observer} from '@material/mwc-base/form-element.js';
import {addHasRemoveClass, isRTL} from '@material/mwc-base/utils.js';
import {MDCChipInteractionEvent, MDCChipSelectionEvent, MDCChipRemovalEvent, MDCChipNavigationEvent} from '@material/chips/chip/types';
import {MDCChipSetAdapter} from '@material/chips/chip-set/adapter.js';
import {MDCChipSetFoundation} from '@material/chips/chip-set/foundation.js';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {ChipBase, ChipType} from './mwc-chip-base.js';

let chipIdCounter = 0;

export class ChipSetBase extends BaseElement {
  @query('.mdc-chip-set') protected mdcRoot!: HTMLElement;
  protected mdcFoundation!: MDCChipSetFoundation;
  protected readonly mdcFoundationClass = MDCChipSetFoundation;

  @property()
  @observer(function(this: ChipSetBase, value: ChipType) {
    for (let chip of this.chipsArray) {
      chip.type = value;
    }
  })
  type?: ChipType;

  get chips(): ReadonlyArray<ChipBase> {
    return this.chipsArray.slice();
  }

  private chipsArray: ChipBase[] = [];
  private chipsObserver = new MutationObserver(() => this.syncChips());

  protected createAdapter(): MDCChipSetAdapter {
    return {
      hasClass: addHasRemoveClass(this.mdcRoot).hasClass,
      removeChipAtIndex: index => {
        const chip = this.chipsArray[index];
        if (chip) {
          if (chip.parentNode) {
            chip.parentNode.removeChild(chip);
          }

          this.chipsArray.splice(index, 1);
        }
      },
      selectChipAtIndex: (index, isSelected, shouldNotifyClients) => {
        const chip = this.chipsArray[index];
        if (chip) {
          chip.setSelectedFromChipSet(isSelected, shouldNotifyClients);
        }
      },
      getIndexOfChipById: chipId => {
        for (let i = 0; i < this.chipsArray.length; i++) {
          if (this.chipsArray[i].id === chipId) {
            return i;
          }
        }

        return -1;
      },
      focusChipPrimaryActionAtIndex: index => {
        const chip = this.chipsArray[index];
        if (chip) {
          chip.focusPrimaryAction();
        }
      },
      focusChipTrailingActionAtIndex: index => {
        const chip = this.chipsArray[index];
        if (chip) {
          this.chipsArray[index].focusTrailingAction();
        }
      },
      removeFocusFromChipAtIndex: index => {
        const chip = this.chipsArray[index];
        if (chip) {
          this.chipsArray[index].removeFocus();
        }
      },
      isRTL: () => isRTL(this.mdcRoot),
      getChipListCount: () => this.chipsArray.length
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.chipsObserver.observe(this, {
      childList: true,
      subtree: true
    });

    this.syncChips();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.chipsObserver.disconnect();
  }

  render() {
    const classes = {
      'mdc-ship-set--input': this.type === 'input',
      'mdc-chip-set--choice': this.type === 'choice',
      'mdc-chip-set--filter': this.type === 'filter'
    };

    return html`
      <div class="mdc-chip-set ${classMap(classes)}"
        @MDCChip:interaction=${this.handleChipInteraction}
        @MDCChip:navigation=${this.handleChipNavigation}
        @MDCChip:removal=${this.handleChipRemoval}
        @MDCChip:selection=${this.handleChipSelection}
      >
        <slot></slot>
      </div>`;
  }

  protected syncChips() {
    const chips = this.queryChips();
    for (let chip of chips) {
      chip.type = this.type;
      chip.id = chip.id || this.nextChipId();
      if (chip.selected) {
        this.mdcFoundation.select(chip.id);
      }
    }

    this.chipsArray = chips;
  }

  protected nextChipId() {
    return `mwc-chip-${++chipIdCounter}`;
  }

  protected queryChips() {
    const chips: ChipBase[] = [];
    const collectChips = (root: Element) => {
      for (let child of Array.from(root.children)) {
        if (child instanceof ChipBase) {
          chips.push(child);
        } else {
          collectChips(child);
        }
      }
    };

    collectChips(this);
    return chips;
  }

  private handleChipInteraction(e: MDCChipInteractionEvent) {
    this.mdcFoundation.handleChipInteraction(e.detail.chipId);
  }

  private handleChipSelection(e: MDCChipSelectionEvent) {
    const {chipId, selected, shouldIgnore} = e.detail;
    this.mdcFoundation.handleChipSelection(chipId, selected, shouldIgnore);
  }

  private handleChipRemoval(e: MDCChipRemovalEvent) {
    this.mdcFoundation.handleChipRemoval(e.detail.chipId);
  }

  private handleChipNavigation(e: MDCChipNavigationEvent) {
    const {chipId, key, source} = e.detail;
    this.mdcFoundation.handleChipNavigation(chipId, key, source);
  }
}
