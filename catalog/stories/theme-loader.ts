import { PostDoc } from 'postdoc-lib';

const ss = new CSSStyleSheet();
let hasAdopted = false;

function applyTheme(theme: string) {
  ss.replace(theme);
  if (!hasAdopted) {
    hasAdopted = true;
    document.adoptedStyleSheets.push(ss);
  }
}

const onMessage = (e: MessageEvent<string>) => {
  applyTheme(e.data);
};

const postdoc = new PostDoc({
  // Where to listen for handshake messages
  messageReceiver: window,
  messageTarget: window.top!,
  onMessage,
});


await postdoc.handshake;

postdoc.postMessage('request-theme');
