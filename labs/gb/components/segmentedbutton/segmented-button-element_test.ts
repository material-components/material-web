/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-segmented-button.js';

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {SEGMENTED_BUTTON_CLASSES} from './segmented-button.js';
import {
  SegmentedButtonElement,
  segmentGroupDisabled,
  segmentSelectionMode,
} from './segmented-button-element.js';

class SegmentHarness extends Harness<SegmentedButtonElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    await this.element.updateComplete;
    return this.element.shadowRoot!.querySelector(
      '[part="segmented-btn"]',
    ) as HTMLElement;
  }
}

describe('SegmentedButtonElement', () => {
  const env = new Environment();

  beforeAll(() => {
    const noTransitions = new CSSStyleSheet();
    noTransitions.replaceSync(`
      md-gb-segmented-button,
      md-gb-segmented-button::part(segmented-btn) {
        transition: none !important;
      }
    `);
    adoptStyles(document, [m3Styles, noTransitions]);
  });

  it('is registered', () => {
    const el = document.createElement('md-gb-segmented-button');
    expect(el).toBeInstanceOf(SegmentedButtonElement);
    expect(customElements.get('md-gb-segmented-button')).toBeDefined();
  });

  it('has expected defaults', async () => {
    const root = env.render(
      html`<md-gb-segmented-button></md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;

    expect(segment.selected).toBeFalse();
    expect(segment.disabled).toBeFalse();
    expect(segment.value).toBe('');
  });

  it('renders button[type=button][part=segmented-btn]', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button');

    expect(button).not.toBeNull();
    expect(button!.getAttribute('type')).toBe('button');
    expect(button!.getAttribute('part')).toBe('segmented-btn');
  });

  it('reflects selected and disabled to attributes', async () => {
    const root = env.render(
      html`<md-gb-segmented-button></md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;

    segment.selected = true;
    await segment.updateComplete;
    expect(segment.hasAttribute('selected')).toBeTrue();

    segment.selected = false;
    await segment.updateComplete;
    expect(segment.hasAttribute('selected')).toBeFalse();

    segment.disabled = true;
    await segment.updateComplete;
    expect(segment.hasAttribute('disabled')).toBeTrue();

    segment.disabled = false;
    await segment.updateComplete;
    expect(segment.hasAttribute('disabled')).toBeFalse();
  });

  it('enforces that a segment cannot be simultaneously selected and disabled', async () => {
    const root = env.render(html`
      <md-gb-segmented-button id="s1">Option 1</md-gb-segmented-button>
      <md-gb-segmented-button id="s2" selected disabled>
        Option 2
      </md-gb-segmented-button>
    `);
    await env.waitForStability();
    const s1 = root.querySelector('#s1') as SegmentedButtonElement;
    const s2 = root.querySelector('#s2') as SegmentedButtonElement;
    const b1 = s1.shadowRoot!.querySelector('button')!;
    const b2 = s2.shadowRoot!.querySelector('button')!;

    // 4) Initial markup with selected and disabled has selected removed
    expect(s2.selected).toBeFalse();
    expect(s2.hasAttribute('selected')).toBeFalse();
    expect(s2.disabled).toBeTrue();
    expect(b2.getAttribute('aria-checked')).toBe('false');

    // 1) Setting segment.disabled = true on a selected segment immediately deselects it
    s1.selected = true;
    await s1.updateComplete;
    expect(s1.selected).toBeTrue();
    expect(s1.hasAttribute('selected')).toBeTrue();
    expect(b1.getAttribute('aria-checked')).toBe('true');
    expect(
      b1.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected),
    ).toBeTrue();

    s1.disabled = true;
    await s1.updateComplete;
    expect(s1.selected).toBeFalse();
    expect(s1.hasAttribute('selected')).toBeFalse();
    expect(b1.getAttribute('aria-checked')).toBe('false');
    expect(
      b1.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected),
    ).toBeFalse();

    // 3) Setting segment.selected = true while segment.disabled is true is ignored
    s1.selected = true;
    await s1.updateComplete;
    expect(s1.selected).toBeFalse();
    expect(s1.hasAttribute('selected')).toBeFalse();

    // 2) Setting segment[segmentGroupDisabled] = true on a selected segment immediately deselects it
    s1.disabled = false;
    s1.selected = true;
    await s1.updateComplete;
    expect(s1.selected).toBeTrue();

    s1[segmentGroupDisabled] = true;
    await s1.updateComplete;
    expect(s1.selected).toBeFalse();
    expect(s1.hasAttribute('selected')).toBeFalse();
    expect(b1.getAttribute('aria-checked')).toBe('false');
    expect(
      b1.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected),
    ).toBeFalse();

    // Setting segment.selected = true while segmentGroupDisabled is true is ignored
    s1.selected = true;
    await s1.updateComplete;
    expect(s1.selected).toBeFalse();
  });

  it('aria-checked mirrors selected', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('aria-checked')).toBe('false');

    segment.selected = true;
    await segment.updateComplete;
    expect(button.getAttribute('aria-checked')).toBe('true');
  });

  it('updates aria-checked and selected class synchronously on setter', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('aria-checked')).toBe('false');
    expect(
      button.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected),
    ).toBeFalse();

    segment.selected = true;
    expect(button.getAttribute('aria-checked')).toBe('true');
    expect(
      button.classList.contains(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected),
    ).toBeTrue();
  });

  it('role mirrors selectionMode', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('role')).toBe('radio');

    segment[segmentSelectionMode] = 'multiple';
    await segment.updateComplete;
    expect(button.getAttribute('role')).toBe('checkbox');
  });

  it('disabled sets native disabled on inner button so it cannot be focused', async () => {
    const root = env.render(
      html`<md-gb-segmented-button disabled>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.disabled).toBeTrue();
  });

  it('group disabled sets native disabled on inner button', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    segment[segmentGroupDisabled] = true;
    await segment.updateComplete;
    expect(button.disabled).toBeTrue();
  });

  it('host.focus() moves focus to the inner button via delegatesFocus', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    segment.focus();
    expect(segment.shadowRoot!.activeElement).toBe(button);
  });

  it('host aria-label is delegated and host exposes no role', async () => {
    const root = env.render(
      html`<md-gb-segmented-button
        aria-label="Favorite"></md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('aria-label')).toBe('Favorite');
    expect(segment[internals].role).toBeNull();
    expect(segment.hasAttribute('aria-label')).toBeFalse();
  });

  it('multiple mode omits aria-posinset on inner button even when set on host', async () => {
    const root = env.render(
      html`<md-gb-segmented-button aria-posinset="5"
        >Day</md-gb-segmented-button
      >`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    segment[segmentSelectionMode] = 'multiple';
    await segment.updateComplete;
    const button = segment.shadowRoot!.querySelector('button')!;
    expect(button.hasAttribute('aria-posinset')).toBeFalse();
  });

  it('the graphic is aria-hidden', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const graphic = segment.shadowRoot!.querySelector(
      '.segmented-btn-graphic',
    )!;

    expect(graphic.getAttribute('aria-hidden')).toBe('true');
  });

  it('detects label-only, label+icon, and icon-only from slots', async () => {
    const root = env.render(html`
      <md-gb-segmented-button id="label-only">Day</md-gb-segmented-button>
      <md-gb-segmented-button id="label-icon">
        <span slot="icon">*</span>
        Day
      </md-gb-segmented-button>
      <md-gb-segmented-button id="icon-only">
        <span slot="icon">*</span>
      </md-gb-segmented-button>
    `);
    await env.waitForStability();
    const lOnly = root.querySelector('#label-only') as SegmentedButtonElement;
    const lIcon = root.querySelector('#label-icon') as SegmentedButtonElement;
    const iOnly = root.querySelector('#icon-only') as SegmentedButtonElement;

    const bLabelOnly = lOnly.shadowRoot!.querySelector('button')!;
    const bLabelIcon = lIcon.shadowRoot!.querySelector('button')!;
    const bIconOnly = iOnly.shadowRoot!.querySelector('button')!;

    expect(
      bLabelOnly.classList.contains('segmented-btn-with-icon'),
    ).toBeFalse();
    expect(
      bLabelOnly.classList.contains('segmented-btn-icon-only'),
    ).toBeFalse();

    expect(bLabelIcon.classList.contains('segmented-btn-with-icon')).toBeTrue();
    expect(
      bLabelIcon.classList.contains('segmented-btn-icon-only'),
    ).toBeFalse();

    expect(bIconOnly.classList.contains('segmented-btn-with-icon')).toBeTrue();
    expect(bIconOnly.classList.contains('segmented-btn-icon-only')).toBeTrue();
  });

  it('whitespace-only text does not count as a label', async () => {
    const root = env.render(html`
      <md-gb-segmented-button id="ws-only">
        <span slot="icon">*</span>
      </md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector('#ws-only') as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.classList.contains('segmented-btn-icon-only')).toBeTrue();
  });

  it('dynamically appending and removing an icon updates with-icon and icon-only classes', async () => {
    const root = env.render(html`
      <md-gb-segmented-button id="dyn-icon">Label</md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector('#dyn-icon') as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    expect(button.classList.contains('segmented-btn-with-icon')).toBeFalse();
    expect(button.classList.contains('segmented-btn-icon-only')).toBeFalse();

    const iconSpan = document.createElement('span');
    iconSpan.setAttribute('slot', 'icon');
    iconSpan.textContent = '*';
    segment.appendChild(iconSpan);
    await env.waitForStability();

    expect(button.classList.contains('segmented-btn-with-icon')).toBeTrue();
    expect(button.classList.contains('segmented-btn-icon-only')).toBeFalse();

    iconSpan.remove();
    await env.waitForStability();

    expect(button.classList.contains('segmented-btn-with-icon')).toBeFalse();
    expect(button.classList.contains('segmented-btn-icon-only')).toBeFalse();
  });

  it('editing an existing label text node shows the label and updates accessible name', async () => {
    const textNode = document.createTextNode('');
    const root = env.render(html`
      <md-gb-segmented-button id="dynamic-btn"></md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      '#dynamic-btn',
    ) as SegmentedButtonElement;
    segment.appendChild(textNode);
    await env.waitForStability();

    const labelSpan = segment.shadowRoot!.querySelector(
      '.segmented-btn-label',
    )!;
    const button = segment.shadowRoot!.querySelector('button')!;

    textNode.data = 'Day';
    await env.waitForStability();

    expect(labelSpan.hasAttribute('hidden')).toBeFalse();
    expect(button.classList.contains('segmented-btn-icon-only')).toBeFalse();
    const slot =
      segment.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;
    expect(slot.assignedNodes()).toContain(textNode);
    expect(segment.textContent?.trim()).toBe('Day');
  });

  it('a click selects it and fires input and change from the host', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;

    let inputFired = false;
    let changeFired = false;
    let selectedOnInput = false;

    segment.addEventListener('input', () => {
      inputFired = true;
      selectedOnInput = segment.selected;
    });
    segment.addEventListener('change', () => {
      changeFired = true;
    });

    const harness = new SegmentHarness(segment);
    await harness.clickWithMouse();

    expect(segment.selected).toBeTrue();
    expect(inputFired).toBeTrue();
    expect(changeFired).toBeTrue();
    expect(selectedOnInput).toBeTrue();
  });

  it('clicking inside a <form> does not submit it', async () => {
    let submitted = false;
    const root = env.render(html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          submitted = true;
        }}>
        <md-gb-segmented-button>Day</md-gb-segmented-button>
      </form>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;

    const harness = new SegmentHarness(segment);
    await harness.clickWithMouse();

    expect(submitted).toBeFalse();
  });

  it('shows the focus ring when focused with the keyboard', async () => {
    const root = env.render(
      html`<md-gb-segmented-button>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;

    await new SegmentHarness(segment).focusWithKeyboard();

    expect(getComputedStyle(button).outlineStyle).toBe('solid');
  });

  it('hides the element when hidden attribute is set', async () => {
    const root = env.render(
      html`<md-gb-segmented-button hidden>Day</md-gb-segmented-button>`,
    );
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;

    expect(getComputedStyle(segment).display).toBe('none');
  });

  it('selected segment checkmark and graphic are 18x18 with 8px gap to label', async () => {
    const root = env.render(html`
      <div>
        <md-gb-segmented-button id="label-only" selected>
          Day
        </md-gb-segmented-button>
        <md-gb-segmented-button id="label-icon" selected>
          <span slot="icon">*</span>Day
        </md-gb-segmented-button>
      </div>
    `);
    await env.waitForStability();

    for (const id of ['label-only', 'label-icon']) {
      const segment = root.querySelector(`#${id}`) as SegmentedButtonElement;
      await segment.updateComplete;
      const shadow = segment.shadowRoot!;
      const checkmark = shadow.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const graphic = shadow.querySelector(
        '.segmented-btn-graphic',
      ) as HTMLElement;
      const label = shadow.querySelector('.segmented-btn-label') as HTMLElement;

      const checkmarkRect = checkmark.getBoundingClientRect();
      expect(Math.round(checkmarkRect.width)).toBe(18);
      expect(Math.round(checkmarkRect.height)).toBe(18);

      const graphicRect = graphic.getBoundingClientRect();
      expect(Math.round(graphicRect.width)).toBe(18);
      expect(Math.round(graphicRect.height)).toBe(18);

      const labelRect = label.getBoundingClientRect();
      expect(Math.round(labelRect.left - checkmarkRect.right)).toBe(8);
    }
  });

  it('hides the label element in icon-only mode', async () => {
    const root = env.render(html`
      <md-gb-segmented-button aria-label="Day">
        <span slot="icon">*</span>
      </md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    await segment.updateComplete;
    const label = segment.shadowRoot!.querySelector(
      '.segmented-btn-label',
    ) as HTMLElement;
    expect(label.hidden).toBeTrue();
    expect(getComputedStyle(label).display).toBe('none');
  });

  it('deselects on connection when rendered with disabled and selected', async () => {
    const root = env.render(html`
      <md-gb-segmented-button disabled selected
        >Disabled</md-gb-segmented-button
      >
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    await segment.updateComplete;
    expect(segment.selected).toBeFalse();
    expect(segment.hasAttribute('selected')).toBeFalse();
  });

  it('detects label from non-icon slotted element child during initial slotted content setup', async () => {
    const root = env.render(html`
      <md-gb-segmented-button>
        <span class="custom-label">Element Label</span>
      </md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    await segment.updateComplete;
    const label = segment.shadowRoot!.querySelector(
      '.segmented-btn-label',
    ) as HTMLElement;
    expect(label.hidden).toBeFalse();
    expect(
      segment.shadowRoot!.querySelector('.segmented-btn-icon-only'),
    ).toBeNull();
  });

  it('click() delegates to internal button element', async () => {
    const root = env.render(html`
      <md-gb-segmented-button>Option</md-gb-segmented-button>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    await segment.updateComplete;
    let clicked = false;
    segment.addEventListener('click', () => {
      clicked = true;
    });
    segment.click();
    expect(clicked).toBeTrue();
  });
});
