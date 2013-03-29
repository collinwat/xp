function SudokuGame(state, scale) {
  if (scale && scale > 3)
    this.scale = scale

  this.max = this.scale * this.scale;
  this.reset(state);
}

SudokuGame.prototype = {
  scale: 3
};

MicroEvent.mixin(SudokuGame)

SudokuGame.prototype.coords = function(x, y) {
  x = parseInt(x, 10);
  x = x >= this.max || x < 0 ? undefined : x;

  y = parseInt(y, 10);
  y = y >= this.max || y < 0 ? undefined : y;
  return {x: x, y: y};
};

SudokuGame.prototype.get = function(x, y) {
  return this.getValue(this.state, x, y);
};

SudokuGame.prototype.getValue = function(state, x, y) {
  var p = this.coords(x, y);
  state = state || [];

  if (p.x > -1 && p.y > -1 && state[p.y])
    return state[p.y][p.x];
};

SudokuGame.prototype.getInitial = function(x, y) {
  return this.getValue(this.initial, x, y);
};

SudokuGame.prototype.set = function(x, y, value) {
  var p = this.coords(x, y);

  if (p.x != null && p.y != null) {
    this.state[p.y] = !this.state[p.y] ? [] : this.state[p.y];
    this.state[y][x] = value;
    this.trigger('changed', {
      x: p.x,
      y: p.y,
      value: value,
      initial: this.getInitial(x, y)
    });
  }

  return this;
};

SudokuGame.prototype.reset = function(state) {
  var i = -1;
  state = state || this.initial || [];
  this.initial = state ? state : this.initial;
  this.state = this.initial.slice(0, this.max);

  for ( ; ++i < this.max; ) {
    if (this.state[i])
      this.state[i] = this.state[i].slice(0, this.max);
  }

  this.trigger('reset');
  return this;
};
