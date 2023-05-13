import {Island} from '@11ty/is-land';

customElements.define('lit-island', class extends Island {
  override forceFallback() {}
});
