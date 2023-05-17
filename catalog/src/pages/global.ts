import '../utils/theme.js';

const topAppBar = document.querySelector('top-app-bar')!;
const navDrawer = document.querySelector('nav-drawer')!;

function updateSticky() {
  if (globalThis.scrollY > 0) {
    topAppBar.classList.add('is-sticky');
    navDrawer.classList.add('is-sticky');
  } else {
    topAppBar.classList.remove('is-sticky');
    navDrawer.classList.remove('is-sticky');
  }
}

updateSticky();

globalThis.addEventListener(
  'scroll',
  () => {
    updateSticky();
  },
  { passive: true }
);
