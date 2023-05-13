// declarative shadow dom  polyfill

import {hydrateShadowRoots} from '@webcomponents/template-shadowroot/template-shadowroot.js';

if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
  hydrateShadowRoots(document.body);
}
document.body.removeAttribute('dsd-pending');