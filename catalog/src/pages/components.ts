import type { PlaygroundPreview } from 'playground-elements/playground-preview';
import { PostDoc } from 'postdoc-lib';

async function onMessage(e: MessageEvent) {
  if (e.data === 'request-theme') {
    await postdoc.handshake;
    postdoc.postMessage(localStorage.getItem('theme-string'));
  }
}

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
  postdoc.postMessage(localStorage.getItem('theme-string'));
});
