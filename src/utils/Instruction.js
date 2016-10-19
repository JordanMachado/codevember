export default class Instruction {
  constructor({ text, style = '' }) {
    this.el = document.createElement('p');
    this.el.classList = `instruction ${style}`;
    this.el.innerHTML = text;
  }
  add() {
    document.body.appendChild(this.el);
  }
  show() {

  }
  hide() {

  }
}
