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
      html.push('<span></span>');
    }
    html.push('</div>');
  }

  html.push('</div></div>');
  this.elt.innerHTML = html.join('');
};


var tetris = new Tetris().init(document.querySelector('.Tetris'));
