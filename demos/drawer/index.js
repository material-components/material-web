import '../shared/demo-header';

addEventListener('load', () => {
  document.body.classList.remove('unresolved');
});

const drawer = document.getElementsByTagName('mwc-drawer')[0];
if (drawer) {
  const container = drawer.parentNode;
  container.addEventListener('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
  });
}
