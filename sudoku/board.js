function SudokuBoard(el, game) {
  this.el = jQuery(el);
  this.el.addClass('rotate');
  this.ongamechanged = jQuery.proxy(this.ongamechanged, this);
  this.ongamereset = jQuery.proxy(this.ongamereset, this);

  this.el.on('click', jQuery.proxy(this.onclick, this));
  Mousetrap.bind('d backspace'.split(' '), jQuery.proxy(this.onbackspace, this));
  Mousetrap.bind('esc', jQuery.proxy(this.onescape, this));
  Mousetrap.bind('q', jQuery.proxy(this.onrotateback, this));
  Mousetrap.bind('e', jQuery.proxy(this.onrotateforward, this));
  Mousetrap.bind('0123456789'.split(''), jQuery.proxy(this.onnumber, this));
  Mousetrap.bind('h k l j left right up down'.split(' '),
                 jQuery.proxy(this.onarrow, this));

  this.bindGame(game);
  this.rotation = 0;
}

SudokuBoard.prototype = {
  rotation: 0,

  rotationKeyMap: {
    'h': 'left',
    'k': 'top',
    'l': 'right',
    'j': 'bottom',
    37: 'left',
    38: 'top',
    39: 'right',
    40: 'bottom'
  },

  rotationMap: {
    90: {
      'top': 'left',
      'right': 'top',
      'bottom': 'right',
      'left': 'bottom',
    },
    180: {
      'top': 'bottom',
      'right': 'left',
      'bottom': 'top',
      'left': 'right',
    },
    270: {
      'top': 'right',
      'right': 'bottom',
      'bottom': 'left',
      'left': 'top',
    }
  }
};

SudokuBoard.prototype.bindGame = function(game) {
  if (game) {
    this.unbindGame();
    this.game = game;
    this.game.bind('changed', this.ongamechanged);
    this.game.bind('reset', this.ongamereset);
  }
  return this;
}

SudokuBoard.prototype.unbindGame = function() {
  if (this.game) {
    this.game.unbind('changed', this.ongamechanged);
    this.game.unbind('reset', this.ongamereset);
    this.game = undefined;
    this.clear();
  }
  return this;
}

SudokuBoard.prototype.build = function() {
  var i = -1,
      j = -1,
      max = this.game.max,
      row,
      cell,
      value;

  this.el.empty();
  this.rotation = 0;
  this.el.removeClass('rotateForward rotateBack');

  for (; ++i < max; ) {
    j = -1;
    row = jQuery('<div />').
      addClass('row').
      appendTo(this.el);

    for (; ++j < max; ) {
      value = this.game.get(j, i);
      cell = jQuery('<div />').addClass('cell');
      cell = cell.addClass(value ? 'fixed' : '');
      jQuery('<span />').addClass('text').text(value || '').appendTo(cell);
      cell.appendTo(row);
    }
  }
  return this;
};

SudokuBoard.prototype.selected = function() {
  return this.el.find('.cell.selected');
};

SudokuBoard.prototype.set = function(value) {
  var game = this.game, el;
  this.selected().each(function() {
    el = jQuery(this);
    game.set(el.index(), el.parent().index(), value);
  });
};

SudokuBoard.prototype.rotate = function(direction) {
  var degs = [0, 90, 180, 270, 360], i = -1, cls;

  amount = direction === 'back' ? -90 : 90;
  this.rotation += amount;
  this.rotation = this.rotation > 360 ? this.rotation - 360 : this.rotation;
  this.rotation = this.rotation < 0 ? 360 + this.rotation : this.rotation;
  this.rotation = this.rotation === 360 ? 0 : this.rotation;

  for ( ; ++i < degs.length; ) {
    this.el.removeClass('rotate-back-' + degs[i])
    this.el.removeClass('rotate-forward-' + degs[i]);
  }

  cls = amount > 0 ? 'rotate-forward-' : 'rotate-back-';
  cls += this.rotation;
  this.el.addClass(cls);
  return this;
};

SudokuBoard.prototype.navigate = function(dir) {
  if (this.selected().length < 1) {
    this.el.find('.cell:not(.fixed)').first().addClass('selected');
    return this;
  }

  if (this.rotationMap[this.rotation])
    dir = this.rotationMap[this.rotation][dir] || dir;

  if (dir === 'top')
    this.selectLiteralTop();
  else if (dir === 'right')
    this.selectLiteralRight();
  else if (dir === 'bottom')
    this.selectLiteralBottom();
  else if (dir === 'left')
    this.selectLiteralLeft();
};

SudokuBoard.prototype.selectLiteralTop = function() {
  var el, index, next;
  this.selected().each(function() {
    el = jQuery(this);
    index = el.index() + 1;
    next = el.parent().prevAll('.row')
    next = next.find('.cell:not(.fixed):nth-child(' + index + ')')
    next = next.last();
    if (next.length > 0) {
      next.addClass('selected');
      el.removeClass('selected');
    }
  });
};

SudokuBoard.prototype.selectLiteralRight = function() {
  this.selected().each(function() {
    var next = jQuery(this).nextAll(':not(.fixed)').first();
    if (next.length > 0) {
      next.addClass('selected');
      jQuery(this).removeClass('selected');
    }
  });
};

SudokuBoard.prototype.selectLiteralBottom = function() {
  var el, index, next;
  this.selected().each(function() {
    el = jQuery(this);
    index = el.index() + 1;
    next = el.parent().nextAll('.row')
    next = next.find('.cell:not(.fixed):nth-child(' + index + ')')
    next = next.first();
    if (next.length > 0) {
      next.addClass('selected');
      el.removeClass('selected');
    }
  });
};

SudokuBoard.prototype.selectLiteralLeft = function() {
  this.selected().each(function() {
    var next = jQuery(this).prevAll(':not(.fixed)').first();
    if (next.length > 0) {
      next.addClass('selected');
      jQuery(this).removeClass('selected');
    }
  });
};


SudokuBoard.prototype.increment = function(el) {
  var self = this;
  el = jQuery(el) || this.selected();
  el.each(function() {
    number = parseInt(jQuery(this).find('.text').text() || 0, 10);
    number = isNaN(number) ? 0 : number;
    number = (number > 8 || number < 0) ? undefined : number + 1;
    self.set(number);
  });
};

SudokuBoard.prototype.clear = function() {
  this.el.find('.cell .text').text('');
  return this;
};

SudokuBoard.prototype.ongamechanged = function(cell) {
  var q = '.row:nth-child(' + (cell.y + 1) + ') ';
  q += '.cell:nth-child(' + (cell.x + 1) + ') ';
  q += '.text'
  this.el.find(q).text(cell.value || '');
};

SudokuBoard.prototype.ongamereset = function() {
  this.build();
};

SudokuBoard.prototype.onclick = function(e) {
  var number, selected;
  var el = e && e.target ? jQuery(e.target) : undefined;

  if (!el || !el.hasClass('cell') || el.hasClass('fixed'))
    return

  if (!el.hasClass('selected')) {
    this.selected().removeClass('selected');
    el.addClass('selected');
    return;
  }

  this.increment(el);
};

SudokuBoard.prototype.onincrement = function() {
  this.increment();
};

SudokuBoard.prototype.onnumber = function(e) {
  // Since we are only reading in one character and setting it, this only
  // allows for a range of 0-9 which implies the game has a scale of 3.
  // This needs to be updated once more scales are tested for.
  var number = parseInt(String.fromCharCode(e.which || e.keyCode), 10);
  this.set(number);
};

SudokuBoard.prototype.onbackspace = function(e) {
  this.set(undefined);
};

SudokuBoard.prototype.onescape = function(e) {
  this.selected().removeClass('selected');
};

SudokuBoard.prototype.onrotateback = function() {
  this.rotate('back');
};

SudokuBoard.prototype.onrotateforward = function() {
  this.rotate();
};

SudokuBoard.prototype.onarrow = function(e) {
  var code = e.which || e.keyCode;
  var dir = this.rotationKeyMap[code];

  if (!dir && e.type === 'keypress')
    dir = this.rotationKeyMap[String.fromCharCode(code)];

  this.navigate(dir);
};
