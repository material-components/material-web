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
interface HasChecked extends Element {
  checked: boolean;
}

export const text = (listItem: Element) => {
  const textContent = listItem.textContent;

  return textContent ? textContent.trim() : '';
};

export const value = (listItem: Element) => {
  return listItem.getAttribute('data-value') || '';
}

export const controlTabIndex = (listItem: Element, tabIndex: string) => {
  const tabbables = listItem.querySelectorAll('button:not(:disabled),a,.radio:not([disabled]),.checkbox:not([disabled]),.tabbable:not([disabled])');
  tabbables.forEach(element => element.setAttribute('tabindex', tabIndex));
}

const getCheckbox = (listItem: Element) => {
  return listItem.querySelector('input[type="checkbox"]:not(:disabled),.checkbox:not([disabled])') as Element | HasChecked | null;
}

const getRadio = (listItem: Element) => {
  return listItem.querySelector('input[type="radio"]:not(:disabled),.radio:not([disabled])') as Element | HasChecked | null;
}

export const hasCheckbox = (listItem: Element) => {
  return !!getCheckbox(listItem);
}

export const hasRadio = (listItem: Element) => {
  return !!getRadio(listItem);
}

export const isChecked = (listItem: Element) => {
  const checkbox = getCheckbox(listItem);
  return checkbox && 'checked' in checkbox ? checkbox.checked : false;
}

export const setChecked = (listItem:Element, isChecked: boolean) => {
  const checkbox = getCheckbox(listItem);
  const radio = getRadio(listItem);

  if (checkbox && 'checked' in checkbox) {
    checkbox.checked = isChecked;
  }

  if (radio && 'checked' in radio) {
    radio.checked = isChecked;
  }
}

export const hasClass = (listItem: Element, className: string) => listItem.classList.contains(className);