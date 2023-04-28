/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../../testing/table/test-table.js';
import '../ripple.js';

import {css, html, LitElement} from 'lit';
import {customElement, property, queryAsync} from 'lit/decorators.js';

import {Harness} from '../../testing/harness.js';
import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {ripple} from '../directive.js';
import {MdRipple} from '../ripple.js';

const GOLDENS_LOCATION =
    'third_party/javascript/material/web/ripple/test/scuba_goldens';

@customElement('test-ripple-element')
class TestRippleElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 48px;
      height: 48px;
    }

    div {
      height: 100%;
      position: relative;
      width: 100%;
    }
  `;

  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) unbounded = false;

  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  constructor() {
    super();
    this.addEventListener('focusin', async () => {
      (await this.ripple)?.handleFocusin();
    });
    this.addEventListener('focusout', async () => {
      (await this.ripple)?.handleFocusout();
    });
  }

  protected override render() {
    return html`
      <div ${ripple(this.ripple)} tabindex="0">
        <md-ripple
          ?disabled=${this.disabled}
          ?unbounded=${this.unbounded}></md-ripple>
      </div>
    `;
  }
}

class RippleUsageHarness extends Harness<TestRippleElement> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('div')!;
  }
}

describe('<md-ripple>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  const templates =
      new TemplateBuilder().withHarness(RippleUsageHarness).withVariants({
        bounded(directive, props, state) {
          return html`
            <test-ripple-element
              ?disabled=${state === State.DISABLED}
              ${directive}
            ></test-ripple-element>
          `;
        },
        unbounded(directive, props, state) {
          return html`
            <test-ripple-element
              ?disabled=${state === State.DISABLED}
              unbounded
              ${directive}
            ></test-ripple-element>
          `;
        }
      });

  it('default', async () => {
    env.render(html`
      <md-test-table
        title="Default"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${templates.all()}
      ></md-test-table>
    `);

    expect(await env.diffRoot('default')).toHavePassed();

    env.render(html`
      <md-test-table
        dark
        class="dark"
        title="Default"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${templates.all()}
      ></md-test-table>
    `);

    expect(await env.diffRoot('default_dark')).toHavePassed();
  });
});
