import type { PlaygroundPreview } from 'playground-elements/playground-preview';
import { PostDoc } from 'postdoc-lib';
import '@material/web/iconbutton/outlined-icon-button.js';
import { MdOutlinedIconButton } from '@material/web/iconbutton/outlined-icon-button.js';

async function updateMessageTargetOnIframeLoad(
  postdoc: PostDoc,
  previewEl: PlaygroundPreview
) {
  await previewEl.updateComplete;
  const iframe = previewEl.iframe!;
  iframe.addEventListener('load', updateMessageTarget(postdoc));
}

function updateMessageTarget(postdoc: PostDoc) {
  return (e: Event) => {
    const iframe = e.target as HTMLIFrameElement;
    postdoc.messageTarget = iframe.contentWindow;
  };
}

function updatePostdocTarget(postdoc: PostDoc) {
  const tagname = 'playground-preview' as const;
  const isPreviewDefined = !!customElements.get(tagname);
  const previewEl = document.querySelector(tagname);

  if (!previewEl) {
    return;
  }

  if (isPreviewDefined) {
    updateMessageTargetOnIframeLoad(postdoc, previewEl);
  } else {
    customElements.whenDefined(tagname).then(() => {
      updateMessageTargetOnIframeLoad(postdoc, previewEl);
    });
  }
}

async function handhsakePostdoc() {
  async function onMessage(e: MessageEvent) {
    if (e.data === 'request-theme') {
      await postdoc.handshake;
      postdoc.postMessage(localStorage.getItem('material-theme'));
    }
  }

  const postdoc = new PostDoc({
    messageReceiver: window,
    onMessage,
  });

  const isPlaygroundDefined = !!customElements.get('playground-preview');

  if (!isPlaygroundDefined) {
    await customElements.whenDefined('playground-preview');
  }

  updatePostdocTarget(postdoc);

  await postdoc.handshake;

  window.addEventListener('theme-changed', async () => {
    await postdoc.handshake;
    postdoc.postMessage(localStorage.getItem('material-theme'));
  });
}

function demoDropdown() {
  const detailsEl = document.querySelector('details');
  const expandButton = document.querySelector(
    'summary md-outlined-icon-button'
  ) as MdOutlinedIconButton;
  const summary = document.querySelector(
    'summary:has(md-outlined-icon-button)'
  ) as HTMLElement;

  detailsEl?.addEventListener('toggle', () => {
    expandButton!.selected = detailsEl.open;
  });

  expandButton?.addEventListener('click', () => {
    summary.click();
  });
}

handhsakePostdoc();
demoDropdown();
