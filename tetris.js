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

  this.draw();

  return this;
};


/**
 * Draw all elements of the game
 */
Tetris.prototype.draw = function() {
  var html = [];
  html.push(
      '<div class="border">',
      '<div class="matrix">'
  );

  for (var y = 0; y < this.height; y++) {
    html.push('<div class="row">');
    for (var x = 0; x < this.width; x++) {
      var type = Math.round(Math.random() * 7);
      html.push('<span class="cell cell_', type, '"></span>');
    }
    html.push('</div>');
  }

  html.push('</div></div>');
  this.elt.innerHTML = html.join('');
};



/**
 * @constructor
 */
function Shape() {}


/**
 * Preset of all shapes
 */
Shape.preset = [
  [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[6, 6, 6], [0, 6, 0], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];


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
 * Init random shape
 * @return {Object} instance.
 */
Shape.prototype.init_random = function() {
  return this.init(Math.round(Math.random() * Shape.preset.length));
};


var tetris = new Tetris().init(document.querySelector('.Tetris'));
