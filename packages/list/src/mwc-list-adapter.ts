/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

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
import {IndexDiff, MWCListIndex} from './mwc-list-foundation.js';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCListAdapter {
  getListItemCount(): number;

  getFocusedElementIndex(): number;


  setAttributeForElementIndex:
      (index: number, attribute: string, value: string) => void;
  getAttributeForElementIndex:
      (index: number, attribute: string) => string | null;
  getSelectedStateForElementIndex: (index: number) => boolean;
  setDisabledStateForElementIndex: (index: number, value: boolean) => void;
  getDisabledStateForElementIndex: (index: number) => boolean;
  setSelectedStateForElementIndex: (index: number, value: boolean) => void;
  setActivatedStateForElementIndex: (index: number, value: boolean) => void;

  /**
   * Focuses list item at the index specified.
   */
  focusItemAtIndex(index: number): void;

  /**
   * Sets the tabindex to the value specified for all button/a element children
   * of the list item at the index specified.
   */
  setTabIndexForElementIndex(index: number, tabIndexValue: number): void;

  /**
   * @return true if root element is focused.
   */
  isRootFocused(): boolean;

  /**
   * Notifies user action on list item.
   */
  notifyAction(index: MWCListIndex): void;

  notifySelected(index: MWCListIndex, diff?: IndexDiff): void;

  /**
   * @return true when the current focused element is inside list root.
   */
  isFocusInsideList(): boolean;
}
