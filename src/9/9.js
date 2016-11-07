import deviceType from 'ua-device-type';
import domReady from 'domready';
import raf from 'raf';
import dat from 'dat-gui';
import Canvas from '../Canvas';
import Instruction from '../utils/Instruction';

import 'gsap';
console.warn = function() {}
// Vars
window.DEBUG = true;
let device;
let instruction;
let canvas;


function animate() {
  raf(animate);
  canvas.render();
}

// Events
function resize() {

}
function click(e) {
  if (canvas.params.events.click) canvas.click(e.clientX, e.clientY);

}

domReady(() => {
  device = deviceType(navigator.userAgent);
  document.querySelector('html').classList.add(device);
  canvas = new Canvas({
    events: {
      click: true,
    }

  });
  document.body.appendChild(canvas.el);

  window.addEventListener('click', click);

  if (window.DEBUG || window.DEVMODE) {
    window.gui = new dat.GUI();
  }
  instruction = new Instruction({ text: 'Day 9', style: 'light' });
  instruction.add();

  // let's start
  animate();
});
