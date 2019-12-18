var drawer = document.getElementsByTagName('mwc-drawer')[0];
var container = drawer.parentNode;
container.addEventListener('MDCTopAppBar:nav', function(e) {
  drawer.open = !drawer.open;
});