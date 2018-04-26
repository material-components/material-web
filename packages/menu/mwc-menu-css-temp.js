/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

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
import {html} from '@polymer/lit-element/lit-element.js';

export const style = html`<style>.mdc-menu{box-shadow:0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);background-color:#fff;background-color:var(--mdc-theme-background, #fff);display:none;position:absolute;box-sizing:border-box;min-width:170px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);margin:0;padding:0;transform:scale(1);transform-origin:top left;border-radius:2px;opacity:0;white-space:nowrap;overflow-x:hidden;overflow-y:auto;will-change:transform, opacity;z-index:4}.mdc-menu:focus{outline:none}.mdc-menu--animating-open{display:inline-block;transform:scale(0.8);transition:opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1);opacity:0;overflow-y:hidden}.mdc-menu--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu--animating-closed{display:inline-block;transition:opacity .075s linear;opacity:0;overflow-y:hidden}.mdc-menu__items{box-sizing:border-box;transform:scale(1);overflow-x:hidden;overflow-y:auto;will-change:transform}.mdc-menu__items>.mdc-list-item{cursor:pointer}.mdc-menu--animating .mdc-menu__items{overflow-y:hidden}.mdc-menu--animating-open>.mdc-menu__items{transform:scale(1.25)}.mdc-menu--open>.mdc-menu__items{transform:scale(1)}[dir="rtl"] .mdc-menu{transform-origin:top right}.mdc-menu .mdc-list-group,.mdc-menu .mdc-list{padding:8px 0}.mdc-menu .mdc-list-item{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1rem;line-height:1.75rem;font-weight:400;letter-spacing:.04em;text-decoration:inherit;text-transform:inherit;position:relative;outline:none;color:inherit;text-decoration:none;user-select:none}.mdc-menu .mdc-list-item__graphic{color:rgba(0,0,0,0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0,0,0,0.54))}.mdc-menu .mdc-list-item[aria-disabled="true"]{color:rgba(0,0,0,0.38);color:var(--mdc-theme-text-disabled-on-background, rgba(0,0,0,0.38));cursor:default;pointer-events:none}.mdc-menu .mdc-list-item[aria-disabled="true"]:focus::before{opacity:0}.mdc-menu-anchor{position:relative;overflow:visible}.mdc-menu__items ::slotted(*){cursor:pointer;font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1rem;line-height:1.75rem;font-weight:400;letter-spacing:.04em;text-decoration:inherit;text-transform:inherit;position:relative;outline:none;color:inherit;text-decoration:none;user-select:none}.mdc-menu ::slotted([aria-disabled="true"]){color:rgba(0,0,0,0.38);color:var(--mdc-theme-text-disabled-on-background, rgba(0,0,0,0.38));cursor:default;pointer-events:none}.mdc-menu ::slotted([aria-disabled="true"]):focus::before{opacity:0}.mdc-menu ::slotted([graphic]){color:rgba(0,0,0,0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0,0,0,0.54))}
</style>`;