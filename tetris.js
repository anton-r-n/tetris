'use strict';



/**
 * @constructor
 */
function Tetris() {}


/**
 * Init game object
 * @param {DOMNode} parent_node Container for game graphics.
 * @return {Object} instance.
 */
Tetris.prototype.init = function(parent_node) {
  this.scores = 0;
  this.width = 10;
  this.height = 20;
  this.interval = 500;

  this.elt = parent_node;
  this.board = new Board().init(this.height, this.width);

  this.next = Shape.random();
  this.pushShape(Shape.random());
  this.step();

  document.addEventListener('keydown', this.move.bind(this));

  return this;
};


/**
 * Push a new shape as next shape for game
 * @param {Object} shape Shape.
 */
Tetris.prototype.pushShape = function(shape) {
  this.current = this.next;
  this.next = shape;
  this.current.x = Math.floor((this.width - this.current.size) / 2);
  this.current.y = this.current.idx === 0 ? -2 : -1;
  this.current._y = this.current.y;
  this.current._x = this.current.x;
};


/**
 * Game main loop
 */
Tetris.prototype.step = function() {
  this.current._y = this.current.y + 1;
  if (this.board.validate(this.current)) {
    this.current.y += 1;
    this.draw(this.board.apply(this.current));
    setTimeout(this.step.bind(this), this.interval);
  }
  else {
    this.board.cells = this.board.apply(this.current);
    this.clearLines();
    this.pushShape(Shape.random());
    this.current._y = this.current.y + 1;
    if (this.board.validate(this.current)) {
      this.step();
    }
    else {
      console.log('stop');
    }
  }
};


Tetris.prototype.clearLines = function() {
  for (var y = 0; y < this.height; y++) {
    if (this.board.cells[y].indexOf(0) === -1) {
      this.board.cells.splice(y, 1);
      this.scores += 10;
      for (var i = 0, row = []; i < this.width; i++) { row[i] = 0 }
      this.board.cells.unshift(row);
      y--;
    }
  }
};


/**
 * Process keypress
 * @param {Object} e Event.
 */
Tetris.prototype.move = function(e) {
  switch (e.which) {
    case 37: /* left */
      this.current._x = this.current.x - 1;
      if (this.board.validate(this.current)) {
        this.current.x -= 1;
        this.draw(this.board.apply(this.current));
      }
      break;
    case 38: /* up (rotate) */
      if (this.current.idx !== 3) {
        var shape = this.current.clone().rotate();
        if (this.board.validate(shape)) {
          this.current = shape;
          this.draw(this.board.apply(this.current));
        }
      }
      break;
    case 39: /* right */
      this.current._x = this.current.x + 1;
      if (this.board.validate(this.current)) {
        this.current.x += 1;
        this.draw(this.board.apply(this.current));
      }
      break;
    case 40: /* down (drop) */
      this.current._y = this.current.y + 1;
      while (this.board.validate(this.current)) {
        this.current._y += 1;
      }
      if (this.current.y !== this.current._y - 1) {
        this.current.y = this.current._y - 1;
        this.draw(this.board.apply(this.current));
      }
      break;
  }
  this.current._x = this.current.x;
  this.current._y = this.current.y;
};


/**
 * Draw all elements of the game
 */
Tetris.prototype.draw = function(board) {
  var html = [];
  html.push(
      '<div class="border">',
      '<div class="matrix">'
  );

  for (var y = 0; y < this.height; y++) {
    html.push('<div class="row">');
    for (var x = 0; x < this.width; x++) {
      html.push('<span class="cell cell_', board[y][x], '"></span>');
    }
    html.push('</div>');
  }

  html.push('</div></div>');
  this.elt.innerHTML = html.join('');
};



/**
 * @constructor
 */
function Board() {}


/**
 * Create new board
 * @return {Array<Array>} board.
 */
Board.prototype.init = function(height, width) {
  this.cells = [];
  for (var y = 0; y < height; y++) {
    this.cells[y] = [];
    for (var x = 0; x < width; x++) {
      this.cells[y][x] = 0;
    }
  }
  return this;
};


/**
 * Apply shape to the board
 * @param {Object<Shape>} shape Current shape.
 * @return {Array<Array>} new_board The board clone with applied shape.
 */
Board.prototype.apply = function(shape) {
  /* Clone board */
  var board = this.cells.map(function(row) { return row.slice() }),
      height = board.length,
      width = board[0].length;

  /* Apply */
  for (var y = 0; y < shape.size; y++) {
    for (var x = 0; x < shape.size; x++) {
      var y1 = y + shape.y,
          x1 = x + shape.x,
          val = shape.tiles[y][x];
      if (val > 0 && y1 >= 0 && y1 < height && x1 >= 0 && x1 < width) {
        board[y1][x1] = shape.idx + 1;
      }
    }
  }

  return board;
};


/**
 * Check borders and intersection with filled cells
 * @param {Object<Shape>} shape Current shape.
 * @return {Boolean} validation.
 */
Board.prototype.validate = function(shape) {
  var h = this.cells.length,
      w = this.cells[0].length;

  for (var i = 0; i < shape.size; i++) {
    for (var j = 0; j < shape.size; j++) {
      var y = i + shape._y,
          x = j + shape._x,
          val = shape.tiles[i][j];
      if (val > 0 &&
          (y < 0 || y >= h || x < 0 || x >= w || this.cells[y][x] > 0)) {
        return false;
      }
    }
  }
  return true;
};



/**
 * @constructor
 */
function Shape() {}


/**
 * Init shape by index from preset
 * @param {Number<Int>} idx Index of preset.
 * @return {Object} instance.
 */
Shape.prototype.init = function(idx) {
  this.tiles = Shape.preset[idx];
  this.size = this.tiles.length;
  this.idx = idx;
  this.x = 0;
  this.y = 0;
  return this;
};


/**
 * Clone shape
 * @return {Object} new shape instance.
 */
Shape.prototype.clone = function() {
  var shape = new Shape();
  shape.tiles = this.tiles.map(function(row) { return row.slice() });
  shape.size = this.tiles.length;
  shape.idx = this.idx;
  shape.x = this.x;
  shape.y = this.y;
  shape._x = this._x;
  shape._y = this._y;
  return shape;
};


/**
 * Rotate clockwise;
 */
Shape.prototype.rotate = function() {
  var tiles = this.tiles.map(function(row) { return row.slice() });
  for (var y = 0; y < this.size; y++) {
    for (var x = 0; x < this.size; x++) {
      tiles[this.size - x - 1][y] = this.tiles[y][x];
    }
  }
  this.tiles = tiles;
  return this;
};


/**
 * Preset of all shapes
 */
Shape.preset = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  [[1, 1], [1, 1]],
  [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  [[1, 1, 1], [0, 1, 0], [0, 0, 0]],
  [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
];


/**
 * Init random shape
 * @return {Object} instance.
 */
Shape.random = function() {
  return new Shape().init(Math.floor(Math.random() * Shape.preset.length));
};


var tetris = new Tetris().init(document.querySelector('.Tetris'));
