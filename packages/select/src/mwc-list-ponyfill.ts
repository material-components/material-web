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
import MDCListFoundation from '@material/list/foundation';

import * as mwcListItem from './mwc-list-item-ponyfill';

export const assignedElements = (list: Element): Element[] => {
  const slot = list.querySelector('slot');

  if (slot) {
    return slot.assignedNodes({flatten: true})
               .filter((node) => (node.nodeType === Node.ELEMENT_NODE)) as
        Element[];
  }

  return [];
};

export const selected = (list: Element) => {
  const children = assignedElements(list);
  for (const child of children) {
    const selected = child.classList.contains('mdc-list-item--selected') ?
        child :
        child.querySelector('.mdc-list-item--selected');
    if (selected) {
      return selected;
    }
  }

  return null;
};

export const select = (list: Element, itemToSelect: Element) => {
  const previouslySelected = selected(list);

  if (previouslySelected) {
    previouslySelected.classList.remove('mdc-list-item--selected');
    previouslySelected.removeAttribute('aria-selected');
  }

  itemToSelect.classList.add('mdc-list-item--selected');
  itemToSelect.removeAttribute('aria-selected');
};

export const items = (list: Element): Element[] => {
  const nodes = assignedElements(list);
  const listItems =
      nodes
          .map<Element|Element[]>((element) => {
            if (element.classList.contains('mdc-list-item')) {
              return element;
            }

            return Array.from(element.querySelectorAll('.mdc-list-item'));
          })
          .reduce<Element[]>((listItems, listItemResult) => {
            return listItems.concat(listItemResult);
          }, []);

  return listItems;
};

export const mdcRoot = (list: Element) => {
  return list as HTMLElement;
};

export const getItemAtIndex =
    (list: Element, index: number): Element|undefined => {
      const elements = items(list);

      return elements[index] as Element | undefined;
    };

export const getSlottedActiveElement = (list: Element): Element|null => {
  const first = getItemAtIndex(list, 0);
  if (!first) {
    return null;
  }

  const root = first.getRootNode() as unknown as DocumentOrShadowRoot;
  return root ? root.activeElement : null;
};

export const doContentsHaveFocus = (list: Element): boolean => {
  const activeElement = getSlottedActiveElement(list);
  if (!activeElement) {
    return false;
  }

  const elements = assignedElements(list);

  return elements.reduce((isContained: boolean, listItem) => {
    return isContained || listItem === activeElement ||
        listItem.contains(activeElement);
  }, false);
};

export const wrapFocus =
    (foundation: MDCListFoundation, wrapFocus: boolean) => {
      foundation.setWrapFocus(wrapFocus);
    };

export const getIndexOfElement = (list: Element, element: Element) => {
  const elements = items(list);

  return elements.indexOf(element);
};

export const getIndexOfTarget = (list: Element, evt: Event) => {
  const elements = items(list);
  const path = evt.composedPath();

  for (const pathItem of path) {
    const index = elements.indexOf(pathItem as Element);
    if (index !== -1) {
      return index;
    }
  }

  return -1;
};

export const layout = (list: Element, foundation: MDCListFoundation) => {
  const elements = items(list);

  for (const element of elements) {
    mwcListItem.init(element);
  }

  foundation.setUseActivatedClass(true);
  foundation.layout();
};
