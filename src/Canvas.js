var Simplex = require('perlin-simplex')
var simplex = new Simplex()

export default class Canvas {
  constructor(params) {
    this.params = params;
    this.el = document.createElement('canvas');
    this.el.classList = 'two-d';

    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.el.width = this.w;
    this.el.height = this.h;

    this.ctx = this.el.getContext('2d');

    this.xp();

  }
  xp() {
    this.x = 0;
    this.y = 0;
    // this.ctx.fillStyle='#'+Math.floor(Math.random()*16777215).toString(16);
  }
  render() {
    let yo = simplex.noise(this.x, this.y)
    this.x += Math.random() * 4 + yo;
    this.y += Math.random() * (1 + 1) -1 + yo;


    for (var i = 0; i < 40; i++) {
      this.ctx.globalAlpha = 0.01 * i;

      this.ctx.fillRect(this.x, i * this.h / 40 + this.y,10,i);
    }
    this.ctx.globalAlpha = 1;
  }
  click(x, y) {
    console.log('click', x,y);
    this.x = 0;
    this.y = 0;
    // this.ctx.fillStyle='#'+Math.floor(Math.random()*16777215).toString(16);

  }
  resize () {
    this.el.width = window.innerWidth;
    this.el.width = window.innerHeight;
  }
}
