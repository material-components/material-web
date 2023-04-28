/** @license Googler-authored internal-only code. */

// import 'jasmine'; (google3-only)
import '../list.js';
import '../list-item.js';
import '../../testing/table/test-table.js';
import '../../divider/divider.js';
import '../../icon/icon.js';

import {html, TemplateResult} from 'lit';

import {ScubaEnvironment} from '../../testing/google3/scuba-environment.js';
import {State, TemplateBuilder} from '../../testing/templates.js';
import {ListHarness} from '../harness.js';

import {AVATAR_URL, IMAGE_URL, VIDEO_URL} from './assets.js';


const GOLDENS_LOCATION =
    'third_party/javascript/material/web/list/test/scuba_goldens';

describe('<md-list>', () => {
  // TODO(b/243534912): Use ScubaStateProvider instead of the Environment model
  const env = new ScubaEnvironment({goldensLocation: GOLDENS_LOCATION});

  function renderTest(
      title: string, templates: TemplateBuilder<ListHarness, string>) {
    const testTemplates = templates.all();
    env.render(html`
      <md-test-table
        title="${title}"
        .states=${
            [State.DEFAULT, State.HOVER, State.FOCUS, State.PRESSED,
             State.DISABLED]}
        .templates=${testTemplates}
      ></md-test-table>
    `);
  }

  it('text_only', async () => {
    renderTest('text_only', getListTemplate());

    expect(await env.diffRoot('text_only')).toHavePassed();
  });

  it('icon', async () => {
    renderTest('icon', getListTemplate({
                 startSlot: html`
                  <md-icon slot="start" data-variant="icon">
                    account_circle
                  </md-icon>`
               }));

    expect(await env.diffRoot('icon')).toHavePassed();
  });

  it('avatar', async () => {
    renderTest('avatar', getListTemplate({
                 startSlot: html`
                  <img
                    slot="start"
                    data-variant="avatar"
                    .src="${getTestAvatar()}"
                    alt="Example avatar"
                    >`
               }));

    expect(await env.diffRoot('avatar')).toHavePassed();
  });

  it('avatar_label', async () => {
    renderTest('avatar_label', getListTemplate({
                 startSlot: html`
                  <span
                    slot="start"
                    data-variant="avatar"
                    >EM</span>`
               }));

    expect(await env.diffRoot('avatar_label')).toHavePassed();
  });

  it('image', async () => {
    renderTest('image', getListTemplate({
                 startSlot: html`
                  <img
                    slot="start"
                    data-variant="image"
                    .src="${getTestImage()}"
                    alt="Example image"
                    >`
               }));

    expect(await env.diffRoot('image')).toHavePassed();
  });

  it('video', async () => {
    let resolve = (value: unknown) => {};
    const videoLoaded = new Promise((res) => {
      resolve = res;
    });

    renderTest('video', getListTemplate({
                 startSlot: html`
                  <video
                    slot="start"
                    data-variant="video"
                    @loadeddata=${resolve}
                    .src="${getTestVideo()}"
                    alt="Example video thumbnail"
                    >
                  </video>`
               }));
    await videoLoaded;
    expect(await env.diffRoot('video')).toHavePassed();
  });

  it('video_large', async () => {
    let resolve = (value: unknown) => {};
    const videoLoaded = new Promise((res) => {
      resolve = res;
    });

    renderTest('video_large', getListTemplate({
                 startSlot: html`
                  <video
                    slot="start"
                    data-variant="video-large"
                    @loadeddata=${resolve}
                    .src="${getTestVideo()}"
                    alt="Example video thumbnail"
                    >
                  </video>`
               }));
    await videoLoaded;
    expect(await env.diffRoot('video_large')).toHavePassed();
  });
});

function getListTemplate({startSlot}: {startSlot?: TemplateResult} = {}) {
  return new TemplateBuilder().withHarness(ListHarness).withVariants({
    list(directive, props, state) {
      return html`
        <md-list
          aria-label="Test list"
          ${directive}
        >
          <md-list-item
            headline="Headline"
            ?disabled=${state === State.DISABLED}
            >
            ${startSlot}
          </md-list-item>
          <md-list-item
            headline="Headline"
            ?disabled=${state === State.DISABLED}
            >
            ${startSlot}
            <md-icon slot="end" data-variant="icon">arrow_forward</md-icon>
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item
            headline="Headline"
            trailingSupportingText="May 9"
            ?disabled=${state === State.DISABLED}
            >
            ${startSlot}
          </md-list-item>
          <md-list-item
            headline="Headline"
            supportingText="Supporting text"
            trailingSupportingText="100+"
            ?disabled=${state === State.DISABLED}
            >
            ${startSlot}
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item
            headline="Headline"
            supportingText="Supporting line text lorem ipsum dolor sit amet, consectetur"
            multiLineSupportingText
            trailingSupportingText="100+"
            ?disabled=${state === State.DISABLED}
            >
            ${startSlot}
          </md-list-item>
        </md-list>
      `;
    }
  });
}

function getTestAvatar() {
  return AVATAR_URL;
}

function getTestImage() {
  return IMAGE_URL;
}

function getTestVideo() {
  return VIDEO_URL;
}
