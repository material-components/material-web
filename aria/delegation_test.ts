/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render, TemplateResult} from 'lit';

import {Environment} from '../testing/environment.js';

import {completeDelegationMutations, delegatesAria} from './delegation.js';

describe('aria', () => {
  const env = new Environment();

  function setupTest(
      hostTemplate: TemplateResult, shadowRootTemplate: TemplateResult) {
    const root = env.render(hostTemplate);
    const host = root.firstElementChild;
    if (!host) {
      throw new Error('Host template must provide a child.');
    }

    const shadowRoot = host.attachShadow({mode: 'open'});
    render(shadowRootTemplate, shadowRoot);
    const child = shadowRoot.firstElementChild;
    if (!child) {
      throw new Error('Shadow root template must provide a child.');
    }

    return {root, host, child, shadowRoot};
  }

  describe('delegatesAria()', () => {
    it('should add role="presentation" to the host', () => {
      const {host, shadowRoot} = setupTest(
          html`<div aria-label="Descriptive label"></div>`,
          html`<button delegatedaria="aria-label"></button>`);

      delegatesAria(shadowRoot, 'aria-label');
      expect(host.getAttribute('role'))
          .withContext('host role')
          .toEqual('presentation');
    });

    it('should not change or remove host aria attributes', () => {
      const {host, shadowRoot} = setupTest(
          html`<div aria-label="Descriptive label"></div>`,
          html`<button delegatedaria="aria-label"></button>`);

      delegatesAria(shadowRoot, 'aria-label');
      expect(host.getAttribute('aria-label'))
          .withContext('host aria-label')
          .toEqual('Descriptive label');
    });

    it('should add delegatesAria property to shadowRoot', () => {
      const {shadowRoot} = setupTest(
          html`<div aria-label="Descriptive label"></div>`,
          html`<button delegatedaria="aria-label"></button>`);

      delegatesAria(shadowRoot, 'aria-label');
      expect(shadowRoot.delegatesAria)
          .withContext('shadowRoot.delegatesAria')
          .toEqual('aria-label');
    });

    it('should not allow changing shadowRoot delegatesAria', () => {
      const {shadowRoot} = setupTest(
          html`<div aria-label="Descriptive label"></div>`,
          html`<button delegatedaria="aria-label"></button>`);

      delegatesAria(shadowRoot, 'aria-label');
      shadowRoot.delegatesAria = 'should not be changed';
      expect(shadowRoot.delegatesAria)
          .withContext('shadowRoot.delegatesAria is unchanged')
          .toEqual('aria-label');
    });

    it('should error for invalid aria attributes', () => {
      const {shadowRoot} = setupTest(
          html`<div aria-label="Descriptive label"></div>`,
          html`<button delegatedaria="aria-label"></button>`);

      expect(() => {
        delegatesAria(shadowRoot, 'aria-not-a-real-attribute');
      }).toThrowError();
    });

    describe('aria value attributes', () => {
      it('should delegate aria attributes to delegatedaria target', () => {
        const {shadowRoot, child} = setupTest(
            html`<div aria-label="Descriptive label"></div>`,
            html`<button delegatedaria="aria-label"></button>`);

        delegatesAria(shadowRoot, 'aria-label');
        completeDelegationMutations();
        expect(child.getAttribute('aria-label'))
            .withContext('child aria-label')
            .toEqual('Descriptive label');
      });

      it('should delegate to multiple delegatedaria targets', () => {
        const {shadowRoot} = setupTest(
            html`<div aria-label="Descriptive label"></div>`,
            html`<button delegatedaria="aria-label"></button>
                 <input delegatedaria="aria-label">`);

        const button = shadowRoot.querySelector('button')!;
        const input = shadowRoot.querySelector('input')!;
        delegatesAria(shadowRoot, 'aria-label');
        completeDelegationMutations();
        expect(button.getAttribute('aria-label'))
            .withContext('first child aria-label')
            .toEqual('Descriptive label');
        expect(input.getAttribute('aria-label'))
            .withContext('second child aria-label')
            .toEqual('Descriptive label');
      });

      it('should update delegated aria attributes when host attribute changes',
         () => {
           const {host, shadowRoot, child} = setupTest(
               html`<div aria-label="First aria label"></div>`,
               html`<button delegatedaria="aria-label"></button>`);

           delegatesAria(shadowRoot, 'aria-label');
           host.setAttribute('aria-label', 'Second aria label');
           completeDelegationMutations();
           expect(child.getAttribute('aria-label'))
               .withContext('child aria-label')
               .toEqual('Second aria label');
         });

      it('should remove delegated aria attributes when host attribute is removed',
         () => {
           const {host, shadowRoot, child} = setupTest(
               html`<div aria-label="Descriptive label"></div>`,
               html`<button delegatedaria="aria-label"></button>`);

           delegatesAria(shadowRoot, 'aria-label');
           host.removeAttribute('aria-label');
           completeDelegationMutations();
           expect(child.hasAttribute('aria-label'))
               .withContext('child has aria-label')
               .toBeFalse();
         });

      it('should update child aria attributes when `delegatedaria` changes',
         () => {
           const {shadowRoot, child} = setupTest(
               html`<div aria-label="Descriptive label"></div>`,
               html`<button delegatedaria="aria-label"></button>`);

           delegatesAria(shadowRoot, 'aria-label');
           child.removeAttribute('delegatedaria');
           completeDelegationMutations();
           expect(child.hasAttribute('aria-label'))
               .withContext('child has aria-label')
               .toBeFalse();
         });
    });


    // Test for when aria IDREF properties (`ariaLabelledByElements`) ARE
    // supported
    describe('aria IDREF attributes', () => {
      const ARIA_CONTROLS_ELEMENTS = Symbol('ariaControlsElements');
      interface ElementWithAriaControlsElements extends Element {
        ariaControlsElements: Element[]|null;
        [ARIA_CONTROLS_ELEMENTS]?: Element[]|null;
      }

      const originalAriaControlsElements = Object.getOwnPropertyDescriptor(
          Element.prototype, 'ariaControlsElements');

      beforeAll(() => {
        if (!originalAriaControlsElements) {
          // IDREF reflective properties are not supported. Shim a basic
          // implementation for testing.
          Object.defineProperty(Element.prototype, 'ariaControlsElements', {
            enumerable: true,
            configurable: true,
            get(this: ElementWithAriaControlsElements) {
              if (this[ARIA_CONTROLS_ELEMENTS] !== undefined) {
                return this[ARIA_CONTROLS_ELEMENTS];
              }

              const ariaControls = this.getAttribute('aria-controls');
              if (ariaControls === null) {
                return null;
              }

              return ariaControls.split(' ')
                  .map(id => {
                    return (this.getRootNode() as ShadowRoot | Document)
                        .querySelector(`#${id}`);
                  })
                  .filter(element => element !== null);
            },
            set(this: ElementWithAriaControlsElements, value: Element[]|null) {
              if (value) {
                this.setAttribute('aria-controls', '');
              } else {
                this.removeAttribute('aria-controls');
              }

              this[ARIA_CONTROLS_ELEMENTS] = value;
            },
          });
        }
      });

      afterAll(() => {
        if (!originalAriaControlsElements) {
          // Remove once TS supports IDREF reflective ARIAMixin properties.
          // tslint:disable-next-line no-any
          delete (Element.prototype as any).ariaControlsElements;
        }
      });

      it('should delegate aria attributes to reflective properties', () => {
        const {root, shadowRoot, child} = setupTest(
            html`<div aria-controls="controlled"></div>
                 <div id="controlled"></div>`,
            html`<button delegatedaria="aria-controls"></button>`);

        delegatesAria(shadowRoot, 'aria-controls');
        completeDelegationMutations();
        const controlledElement = root.querySelector('#controlled')!;
        // Remove once TS supports IDREF reflective ARIAMixin properties.
        // tslint:disable-next-line no-any
        expect((child as any).ariaControlsElements)
            .withContext('child ariaControlsElements')
            .toEqual([controlledElement]);
      });

      it('should remove delegated aria attributes when host attribute is removed',
         () => {
           const {host, shadowRoot, child} = setupTest(
               html`<div aria-controls="controlled"></div>
                    <div id="controlled"></div>`,
               html`<button delegatedaria="aria-controls"></button>`);

           delegatesAria(shadowRoot, 'aria-controls');
           host.removeAttribute('aria-controls');
           completeDelegationMutations();
           // Remove once TS supports IDREF reflective ARIAMixin properties.
           // tslint:disable-next-line no-any
           expect((child as any).ariaControlsElements)
               .withContext(
                   'child ariaControlsElements after attribute removal')
               .toBeNull();
         });
    });

    // Test for when aria IDREF properties (`ariaLabelledByElements`) are NOT
    // supported
    describe('cloneable IDREF attributes', () => {
      const originalAriaControlsElements = Object.getOwnPropertyDescriptor(
          Element.prototype, 'ariaControlsElements');
      const originalAriaLabelledByElements = Object.getOwnPropertyDescriptor(
          Element.prototype, 'ariaLabelledByElements');

      beforeAll(() => {
        if (originalAriaLabelledByElements || originalAriaControlsElements) {
          // IDREF reflective properties are supported. Remove it from the
          // Element prototype to test when they are not supported.
          // Remove once TS supports IDREF reflective ARIAMixin properties.
          // tslint:disable-next-line no-any
          delete (Element.prototype as any).ariaControlsElements;
          // tslint:disable-next-line no-any
          delete (Element.prototype as any).ariaLabelledByElements;
        }
      });

      afterAll(() => {
        if (originalAriaControlsElements) {
          Object.defineProperty(
              Element.prototype, 'ariaControlsElements',
              originalAriaControlsElements);
        }

        if (originalAriaLabelledByElements) {
          Object.defineProperty(
              Element.prototype, 'ariaLabelledByElements',
              originalAriaLabelledByElements);
        }
      });

      it('should error if aria attribute is not cloneable', () => {
        const {shadowRoot} = setupTest(
            html`<div></div>`,
            html`<button delegatedaria="aria-controls"></button>`);

        expect(() => {
          delegatesAria(shadowRoot, 'aria-controls');
        }).toThrowError();
      });

      it('should clone IDREF elements into shadowRoot', () => {
        const {shadowRoot} = setupTest(
            html`<div aria-labelledby="label"></div>
                 <label id="label">Label</label>`,
            html`<button delegatedaria="aria-labelledby"></button>`);

        delegatesAria(shadowRoot, 'aria-labelledby');
        completeDelegationMutations();
        const clonedLabel = shadowRoot.querySelector('label');
        expect(clonedLabel).toBeInstanceOf(HTMLLabelElement);
      });

      it('should not display cloned IDREF elements', () => {
        const {shadowRoot} = setupTest(
            html`<div aria-labelledby="label"></div>
                 <label id="label">Label</label>`,
            html`<button delegatedaria="aria-labelledby"></button>`);

        delegatesAria(shadowRoot, 'aria-labelledby');
        completeDelegationMutations();
        const clonedLabel = shadowRoot.querySelector('label');
        expect(clonedLabel?.style.display)
            .withContext('label display')
            .toEqual('none');
      });

      it('should have unique IDs in the shadowRoot', () => {
        const {child, shadowRoot} = setupTest(
            html`<div aria-labelledby="label"></div>
                 <label id="label">Label</label>`,
            html`<button id="delegated-label" delegatedaria="aria-labelledby"></button>`);

        delegatesAria(shadowRoot, 'aria-labelledby');
        completeDelegationMutations();
        expect(child.id).withContext('child id').toEqual('delegated-label');
        const clonedLabel = shadowRoot.querySelector('label');
        expect(clonedLabel?.id)
            .withContext('cloned id')
            .toEqual('delegated-label-1');
      });

      it('should remove cloned IDREF elements when host attribute is removed',
         () => {
           const {host, shadowRoot} = setupTest(
               html`<div aria-labelledby="label"></div>
                    <label id="label">Label</label>`,
               html`<button delegatedaria="aria-labelledby"></button>`);

           delegatesAria(shadowRoot, 'aria-labelledby');
           expect(shadowRoot.querySelector('label'))
               .toBeInstanceOf(HTMLLabelElement);
           host.removeAttribute('aria-labelledby');
           completeDelegationMutations();
           expect(shadowRoot.querySelector('label')).toBeNull();
         });

      // TODO(b/276484803): support cloned IDREF element changes
      // it('should update cloned IDREF element when outside element changes',
      //    () => {
      //      const {root, host, shadowRoot} = setupTest(
      //          html`<div aria-labelledby="label"></div>
      //               <label id="label">Label</label>`,
      //          html`<button delegatedaria="aria-labelledby"></button>`);

      //      delegatesAria(host, 'aria-labelledby');
      //      const originalLabel = root.querySelector('label')!;
      //      originalLabel.textContent = 'Updated label';
      //      completeDelegationMutations();
      //      const clonedLabel = shadowRoot.querySelector('label');
      //      expect(clonedLabel?.textContent).toEqual('Updated label');
      //    });
    });
  });
});
