/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../menu.js';
import '../menu-item.js';
import '../menu-item-link.js';
import '../sub-menu-item.js';
import '../../icon/icon.js';
import '../../testing/table/test-table.js';
import '../../divider/divider.js';

import {html} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder, TemplateProps} from '../../testing/templates.js';
import {MenuHarness} from '../harness.js';
import {Corner, MdMenu} from '../menu.js';


const GOLDENS_LOCATION =
    'third_party/javascript/material/web/menu/test/scuba_goldens';

describe('<md-menu>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  function renderTest(
      title: string, templates: TemplateBuilder<MenuHarness, string>,
      props: TemplateProps<MenuHarness> = {}) {
    const testTemplates = templates.all(props);
    return env.render(html`
      <md-test-table
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }

  const anchorCorners: Corner[] =
      ['START_START', 'START_END', 'END_START', 'END_END'];
  const menuCorners: Corner[] = [...anchorCorners];

  for (const anchorCorner of anchorCorners) {
    for (const menuCorner of menuCorners) {
      it(`anchor: ${anchorCorner}, menu: ${menuCorner}`, async () => {
        const template = getMenuTemplate();
        renderTest(
            `anchor: ${anchorCorner}, menu: ${menuCorner}`, template,
            {anchorCorner, menuCorner});
        expect(await env.diffRoot(`anchor_${anchorCorner}_menu_${menuCorner}`))
            .toHavePassed();
      });
    }
  }
});

function renderItem(
    props: TemplateProps<MenuHarness>, state: string, index: number) {
  return html`<md-menu-item
        headline="Item ${index}"
        ?disabled=${state === State.DISABLED}>
    </md-menu-item>`;
}

function renderItemLink(
    props: TemplateProps<MenuHarness>, state: string, index: number) {
  return html`<md-menu-item-link
      headline="Link Item ${index}"
      ?disabled=${state === State.DISABLED}>
    <md-icon data-variant="icon" slot="end">open_in_new</md-icon>
  </md-menu-item-link>`;
}

function renderSubMenuItem(
    props: TemplateProps<MenuHarness>, state: string, index: number) {
  const parentMenuCorner = props.menuCorner ?? 'START_START' as const;
  const parentMenuCornerInline =
      parentMenuCorner.split('_')[1] as 'START' | 'END';
  let menuCorner: 'START_START'|'START_END' = 'START_START';
  let anchorCorner: 'START_START'|'START_END' = 'START_END';
  if (parentMenuCornerInline === 'START') {
    menuCorner = 'START_END';
    anchorCorner = 'START_START';
  }
  return html`<md-sub-menu-item
      headline="Link Item ${index}"
      ?disabled=${state === State.DISABLED}
      hover-open-delay="0"
      hover-close-delay="0"
      anchor-corner=${anchorCorner}
      menu-corner=${menuCorner}
      hover-open-delay="0"
      hover-close-delay="0">
    <md-icon data-variant="icon" slot="end">navigate_next</md-icon>
    <md-menu
      stay-open-on-outside-click
      stay-open-on-focusout
      slot="submenu">
      ${
          [renderItem(props, state, 0),
           renderDivider(),
           renderItem(props, state, 1),
           renderDivider(),
           renderItem(props, state, 2),
           renderDivider(),
           renderItem(props, state, 3),
           renderDivider(),
           renderItem(props, state, 4),
  ]}
    </md-menu>
  </md-sub-menu-item>`;
}

function renderDivider() {
  return html`<md-divider></md-divider>`;
}

function getMenuTemplate() {
  return new TemplateBuilder().withHarness(MenuHarness).withVariants({
    listItem(directive, props, state) {
      const anchorRef = createRef<HTMLElement>();
      return html`
        <div style="padding-inline:305px;padding-block:305px;">
          <div style="position:relative;">
            <div
                style="display:flex;border:1px solid black;width:5px;height:5px"
                ${ref(anchorRef)}>
            </div>
              <md-menu
                  stay-open-on-outside-click
                  stay-open-on-focusout
                  data-label="Test menu"
                  anchor-corner=${props.anchorCorner ?? 'END_START'}
                  menu-corner=${props.menuCorner ?? 'START_START'}
                  ${directive}
                  ${ref(element => {
        (element as MdMenu).anchor = anchorRef.value!;
      })}
              >
                ${
              [renderItem(props, state, 0),
               renderDivider(),
               renderItem(props, state, 1),
               renderDivider(),
               renderItem(props, state, 2),
               renderDivider(),
               renderItem(props, state, 3),
               renderDivider(),
               renderItem(props, state, 4),
      ]}
              </md-menu>
          </div>
    </div>
      `;
    },

    listItemLink(directive, props, state) {
      const anchorRef = createRef<HTMLElement>();
      return html`
        <div style="padding-inline:305px;padding-block:305px;">
          <div style="position:relative;">
            <div
                style="display:flex;border:1px solid black;width:5px;height:5px"
                ${ref(anchorRef)}>
            </div>
              <md-menu
                  stay-open-on-outside-click
                  stay-open-on-focusout
                  data-label="Test menu"
                  anchor-corner=${props.anchorCorner ?? 'END_START'}
                  menu-corner=${props.menuCorner ?? 'START_START'}
                  ${directive}
                  ${ref(element => {
        (element as MdMenu).anchor = anchorRef.value!;
      })}
              >
                ${
              [renderItemLink(props, state, 0),
               renderDivider(),
               renderItemLink(props, state, 1),
               renderDivider(),
               renderItemLink(props, state, 2),
               renderDivider(),
               renderItemLink(props, state, 3),
               renderDivider(),
               renderItemLink(props, state, 4),
      ]}
              </md-menu>
          </div>
    </div>
      `;
    },

    subMenuItem(directive, props, state) {
      const anchorRef = createRef<HTMLElement>();
      return html`
        <div style="padding-inline:305px;padding-block:305px;">
          <div style="position:relative;">
            <div
                style="display:flex;border:1px solid black;width:5px;height:5px"
                ${ref(anchorRef)}>
            </div>
              <md-menu
                  stay-open-on-outside-click
                  stay-open-on-focusout
                  has-overflow
                  data-label="Test menu"
                  anchor-corner=${props.anchorCorner ?? 'END_START'}
                  menu-corner=${props.menuCorner ?? 'START_START'}
                  ${directive}
                  ${ref(element => {
        (element as MdMenu).anchor = anchorRef.value!;
      })}
              >
                ${
              [renderSubMenuItem(props, state, 0),
               renderDivider(),
               renderSubMenuItem(props, state, 1),
               renderDivider(),
               renderSubMenuItem(props, state, 2),
               renderDivider(),
               renderSubMenuItem(props, state, 3),
               renderDivider(),
               renderSubMenuItem(props, state, 4),
      ]}
              </md-menu>
          </div>
    </div>
      `;
    },
  });
}
