const styles = document.head.querySelectorAll('link[rel="preload"][as="style"]');

for (let i = 0; i < styles.length; i++) {
  const style = styles[i];
  style.removeAttribute('onload');
  style.setAttribute('rel', 'stylesheet');
  style.removeAttribute('as');
}
