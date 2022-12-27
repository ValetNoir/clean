class Logger {
  div; span; vars; graphs;

  constructor(color) {
    let div = document.createElement("div");
    div.style.backgroundColor = color;
    div.style.position = "absolute";
    div.style.top = 0;
    div.style.left = 0;
    div.style.border = "1px solid black";
    this.div = document.body.appendChild(div);
    this.span = this.div.appendChild(document.createElement("div"));
    this.vars = {};
    this.graphs = {};
  }

  addGraph(varname, linecolor, titlecolor) {
    this.graphs[varname] = new Graph(this.div, varname, linecolor, titlecolor);
  } 

  setVar(varname, value) {
    this.vars[varname] = value;
  }

  display() {
    this.span.innerHTML = "";
    Object.keys(this.vars).forEach((key) => {
      let value = this.vars[key];
      this.span.innerHTML = this.span.innerHTML + key + " : " + value + "</br>";
      if(this.graphs[key]) {
        this.graphs[key].plot(value);
      }
    });
  }
}

class Graph {
  painter; span; varname; linecolor; previous_values; avg;

  constructor(logger_div, varname, linecolor, titlecolor) {
    let div = logger_div.appendChild(document.createElement("div"));
    let span = document.createElement("div");
    span.innerHTML = varname;
    span.style.backgroundColor = titlecolor;
    span.style.border = "1px solid black";
    this.span = div.appendChild(span);
    this.painter = new Painter(div, 300, 100);
    this.linecolor = linecolor;
    this.varname = varname;
    this.previous_values = [];
    this.avg = 1;
  }

  plot(value) {
    this.span.innerHTML = this.varname + " (avg: " + this.avg + ")";
    this.painter.new_frame();
    this.previous_values.unshift(value);
    this.avg = average((this.previous_values.length > 50)? this.previous_values.slice(0, 50) : this.previous_values);
    if(this.previous_values.length > 1) {
      let middle = this.painter.context.width - 10;
      let h = this.painter.context.height;
      for(let i = 0; i < this.previous_values.length; i++) {
        this.painter.line([-i + middle, h - this.previous_values[i]], [-(i + 1) + middle, h - this.previous_values[i + 1]], this.linecolor);
      }
      if(this.previous_values.length > middle) this.previous_values.pop();
    }
    this.painter.send_frame();
  }
}