class Painter {
  ctx; w; h; frame;

  constructor(appender, width, height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.backgroundColor = "white";
    canvas = appender.appendChild(canvas);
    this.ctx = canvas.getContext("2d");
    this.w = width;
    this.h = height;
  }

  new_frame() { this.frame = this.ctx.createImageData(this.w, this.h);  }

  send_frame() { this.ctx.putImageData(this.frame, 0, 0); }

  setpixel(a, c) {
    if(a[0] >= this.w || a[1] >= this.h || a[0] < 0 || a[1] < 0) return;
    let index = (a[0] + a[1] * this.w);
    this.frame.data[index * 4 + 0] = c[0];
    this.frame.data[index * 4 + 1] = c[1];
    this.frame.data[index * 4 + 2] = c[2];
    this.frame.data[index * 4 + 3] = c[3];
  }

  fill(a, b, color) {
    let vx = (a[0] <= b[0])? [a[0], b[0]] : [b[0], a[0]];
    let vy = (a[1] <= b[1])? [a[1], b[1]] : [b[1], a[1]];
    for(let x = vx[0]; x <= vx[1]; x++) {
      for(let y = vy[0]; y <= vy[1]; y++) {
        this.setpixel([x, y], color);
      } 
    }
  }

  line(a, b, color) {
    // Bresenham's Line Algorithm
    // https://www.uobabylon.edu.iq/eprints/publication_2_22893_6215df
    // https://imgur.com/a/2uT7LaV

    let incX = Math.sign(b[0] - a[0]);
    let dX = Math.abs(b[0] - a[0]);

    let incY = Math.sign(b[1] - a[1]);
    let dY = Math.abs(b[1] - a[1]);

    let XaY = dX > dY;
    let cmpt = Math.max(dX, dY);
    let incD = -2 * Math.abs(dX - dY);
    let incS = 2 * Math.min(dX, dY);

    let err = incD + cmpt;
    let X = a[0];
    let Y = a[1];

    while(cmpt >= 0) {
      let x = Math.ceil(X);
      let y = Math.ceil(Y);
    
      this.setpixel([x, y], color);
    
      cmpt -= 1.0;
      if (err >= 0 || XaY)
        X += incX;
      if (err >= 0 || !XaY)
        Y += incY;
      if (err >= 0)
        err += incD;
      else
        err += incS;
    }
  }

  point(a, color) {
    this.line([a[0] - 10, a[1]], [a[0] + 10, a[1]], color);
    this.line([a[0], a[1] - 10], [a[0], a[1] + 10], color);
  }
}