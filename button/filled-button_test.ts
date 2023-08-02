// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdFilledButton} from './filled-button.js';
import {ButtonHarness} from './harness.js';

describe('<md-filled-button>', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdFilledButton.styles);
  });

  describe('form associated', () => {
    async function setupTest() {
      const root =
          env.render(html`<form><md-filled-button></md-filled-button></form>`);
      const element = root.querySelector('md-filled-button');
      if (!element) {
        throw new Error(`Could not query rendered <md-filled-button>`);
      }
      const form = root.querySelector('form');
      if (!form) throw new Error(`Could not query form`);

      await env.waitForStability();

      return {harness: new ButtonHarness(element), form};
    }

    it('button is submit type by default', async () => {
      const {harness} = await setupTest();
      expect(harness.element.type).toBe('submit');
    });

    it('button with type submit can submit a form', async () => {
      const {harness, form} = await setupTest();
      harness.element.type = 'submit';

      spyOn(form, 'requestSubmit');
      spyOn(form, 'reset');
      await harness.clickWithMouse();

      expect(form.requestSubmit).toHaveBeenCalled();
      expect(form.reset).not.toHaveBeenCalled();
    });

    it('button with type reset can reset a form', async () => {
      const {harness, form} = await setupTest();
      harness.element.type = 'reset';

      spyOn(form, 'requestSubmit');
      spyOn(form, 'reset');
      await harness.clickWithMouse();

      expect(form.requestSubmit).not.toHaveBeenCalled();
      expect(form.reset).toHaveBeenCalled();
    });

    it('submit can be cancelled with preventDefault', async () => {
      const {harness, form} = await setupTest();
      harness.element.type = 'submit';

      spyOn(form, 'requestSubmit');

      harness.element.addEventListener('click', e => {
        e.preventDefault();
      }, {once: true});

      await harness.clickWithMouse();

      expect(form.requestSubmit).not.toHaveBeenCalled();
    });

    it('should set the button as the SubmitEvent submitter', async () => {
      const {harness, form} = await setupTest();
      const submitListener =
          jasmine.createSpy('submitListener').and.callFake((event: Event) => {
            event.preventDefault();
          });

      form.addEventListener('submit', submitListener);

      await harness.clickWithMouse();

      expect(submitListener).toHaveBeenCalled();
      const event = submitListener.calls.argsFor(0)[0] as SubmitEvent;
      expect(event.submitter)
          .withContext('event.submitter')
          .toBe(harness.element);
    });
  });
});
