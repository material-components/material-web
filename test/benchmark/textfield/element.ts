import '@material/mwc-textfield/mwc-textfield-element'
import { html } from 'lit-html';
import { measureFixtureCreation } from '../helpers';
import { LitElement } from 'lit-element';

measureFixtureCreation(html`
  <mwc-textfield-element outlined label="this is my label" value="hello"></mwc-textfield-element>
`, {numRenders: 500, renderCheck: async (root) => {
  const textfields = root.querySelectorAll('mwc-textfield');
  textfields.forEach(e => e.shadowRoot!.querySelector('mwc-floating-label')!.float(true));
  await (root.lastChild as LitElement).updateComplete;
  document.body.offsetWidth;
}});