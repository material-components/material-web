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

export const style = html`<style>.mdc-switch{display:inline-block;position:relative}.mdc-switch__native-control{position:absolute;top:-14px;left:-14px;width:48px;height:48px;display:inline-block;margin-top:-3px;transition:transform 90ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;cursor:pointer;z-index:2}.mdc-switch__native-control:checked{transform:translateX(14px)}.mdc-switch__native-control:enabled:not(:checked) ~ .mdc-switch__background::before{background-color:#000}.mdc-switch__native-control:enabled:not(:checked) ~ .mdc-switch__background .mdc-switch__knob{background-color:#fafafa}.mdc-switch__native-control:enabled:not(:checked) ~ .mdc-switch__background .mdc-switch__knob::before{background-color:#9e9e9e}.mdc-switch__native-control:enabled:checked ~ .mdc-switch__background::before{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-switch__native-control:enabled:checked ~ .mdc-switch__background .mdc-switch__knob{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-switch__native-control:enabled:checked ~ .mdc-switch__background .mdc-switch__knob::before{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-switch__background{display:block;position:relative;width:34px;height:14px;border-radius:50%;outline:none;user-select:none}.mdc-switch__background::before{display:block;position:absolute;top:0;right:0;bottom:0;left:0;transition:opacity 90ms cubic-bezier(0.4, 0, 0.2, 1),background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);border-radius:7px;opacity:.38;content:""}.mdc-switch__knob{box-shadow:0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12);display:block;position:absolute;top:-3px;left:0;width:20px;height:20px;transform:translateX(0);transition:transform 90ms cubic-bezier(0.4, 0, 0.2, 1),background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);border-radius:50%;z-index:1}.mdc-switch__knob::before{position:absolute;top:-14px;left:-14px;width:48px;height:48px;transform:scale(0);transition:transform 90ms cubic-bezier(0.4, 0, 0.2, 1),background-color 90ms cubic-bezier(0.4, 0, 0.2, 1);border-radius:50%;opacity:.2;content:""}.mdc-switch__native-control:focus ~ .mdc-switch__background .mdc-switch__knob::before{transform:scale(1)}.mdc-switch__native-control:checked ~ .mdc-switch__background::before{opacity:.5}.mdc-switch__native-control:checked ~ .mdc-switch__background .mdc-switch__knob{transform:translateX(14px)}.mdc-switch__native-control:checked ~ .mdc-switch__background .mdc-switch__knob::before{opacity:.15}.mdc-switch__native-control:disabled{cursor:initial}.mdc-switch__native-control:disabled ~ .mdc-switch__background::before{background-color:#000;opacity:.12}.mdc-switch__native-control:disabled ~ .mdc-switch__background .mdc-switch__knob{background-color:#bdbdbd}
</style>`;
