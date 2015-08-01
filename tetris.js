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
  this.width = 10;
  this.height = 20;

  this.elt = parent_node;
  this.board = new Board().init(this.height, this.width);

  this.next = Shape.random();
  this.pushShape(Shape.random());

  this.draw(this.board.apply(this.current));

  return this;
};


Tetris.prototype.pushShape = function(shape) {
  this.current = this.next;
  this.next = shape;
  this.current.x = Math.floor((this.width - this.current.size) / 2);
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
        board[y1][x1] = val;
      }
    }
  }

  return board;
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
  this.x = 0;
  this.y = 0;
  return this;
};


/**
 * Preset of all shapes
 */
Shape.preset = [
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[6, 6, 6], [0, 6, 0], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];


/**
 * Init random shape
 * @return {Object} instance.
 */
Shape.random = function() {
  return new Shape().init(Math.floor(Math.random() * Shape.preset.length));
};


var tetris = new Tetris().init(document.querySelector('.Tetris'));
