import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-list/mwc-radio-list-item';

import '../shared/demo-header';

addEventListener('load', function() {document.body.classList.remove('unresolved')});
    const basic = document.querySelector('#basic');
    const basicOut = document.querySelector('#basicIndex');

    basic.addEventListener('selected', function() {
      basicOut.innerText = basic.index;
    });

    const multi = document.querySelector('#multi');
    const multiOut = document.querySelector('#multiIndex');

    multi.addEventListener('selected', function() {
      multiOut.innerText = '{ ' + Array.from(multi.index) + ' }';
    });

    const activatable = document.querySelector('#activatable');
    const activatableOut = document.querySelector('#activatableIndex');

    activatable.addEventListener('selected', function() {
      activatableOut.innerText = activatable.index;
    });

    const checklist = document.querySelector('#checklist');
    const checklistOut = document.querySelector('#checklistIndex');

    checklist.addEventListener('selected', function() {
      checklistOut.innerText = '{ ' + Array.from(checklist.index) + ' }';
    });

    const radio = document.querySelector('#radio');
    const radioOut = document.querySelector('#radioIndex');

    radio.addEventListener('selected', function() {
      radioOut.innerText = radio.index;
    });

    const multiRadio = document.querySelector('#multiRadio');
    const multiRadioOut = document.querySelector('#multiRadioIndex');

    multiRadio.addEventListener('selected', function() {
      multiRadioOut.innerText = '{ ' + Array.from(multiRadio.index) + ' }';
    });

    const graphics = document.querySelector('#graphics');
    const graphicsOut = document.querySelector('#graphicsIndex');

    graphics.addEventListener('selected', function() {
      graphicsOut.innerText = '{ ' + Array.from(graphics.index) + ' }';
    });