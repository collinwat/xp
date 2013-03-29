function App() {
  this.init = jQuery.proxy(this.init, this);
  this.onrotate = jQuery.proxy(this.onrotate, this);
  this.onnew = jQuery.proxy(this.onnew, this);
  this.onreset = jQuery.proxy(this.onreset, this);
  this.game = new SudokuGame();
  this.generator = new SudokuGenerator();
  this.board = new SudokuBoard('.puzzle', this.game);
  this.newGame();
}

App.prototype.newGame = function() {
  this.game.reset(this.generator.next());
};

App.prototype.run = function() {
  jQuery(document).ready(this.init);
};

App.prototype.init = function() {
  this.board.build();
  jQuery('#su-new').on('click keypress', this.onnew);
  jQuery('#su-reset').on('click keypress', this.onreset);
  jQuery('#su-rotate').on('click keypress', this.onrotate);
};

App.prototype.onnew = function(e) {
  this.newGame();
};

App.prototype.onreset = function(e) {
  this.game.reset();
};

App.prototype.onrotate = function(e) {
  this.board.rotate();
};

app = new App();
app.run();
