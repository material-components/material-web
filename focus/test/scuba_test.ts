/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../focus-ring.js';

import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import {Harness} from '../../testing/harness.js';
import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {pointerPress, setForceStrongFocus, shouldShowStrongFocus} from '../strong-focus.js';

declare global {
  interface HTMLElementTagNameMap {
    'test-button': TestButton;
  }
}

@customElement('test-button')
class TestButton extends LitElement {
  @state() private showFocusRing = false;

  protected override render() {
    return html`
      <button
          type="button"
          style="position: relative;"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
        >
        <md-focus-ring .visible="${this.showFocusRing}"></md-focus-ring>
        Button!
      </button>
    `;
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handleBlur() {
    this.showFocusRing = false;
  }

  private handlePointerDown() {
    pointerPress();
  }
}

class TestButtonHarness extends Harness<TestButton> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector<HTMLElement>('button')!;
  }
}

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/focus/test/scuba_goldens';

describe('<md-focus-ring>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(TestButtonHarness).withVariants({
        default(directive) {
          return html`<test-button ${directive}></test-button>`;
        },
      });

  beforeEach(() => {
    // Make sure strong focus is off by default.
    setForceStrongFocus(false);
  });

  it('default', async () => {
    renderTable('Default');

    expect(await env.diffRootWithRtl('default')).toHaveAllPassed();
  });

  it('strong focus', async () => {
    setForceStrongFocus(true);
    renderTable('Strong Focus');

    expect(await env.diffRootWithRtl('strong_focus')).toHaveAllPassed();
  });

  function renderTable(
      title: string, props: TemplateProps<TestButtonHarness> = {}) {
    const testTemplates = templates.all(props);
    env.render(html`
      <md-test-table
        title="${title}"
        class="test-button"
        .states=${[State.DEFAULT, State.FOCUS, State.HOVER, State.PRESSED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }
});
