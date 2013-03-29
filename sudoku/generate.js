function SudokuGenerator(scale) {
  this.history = [];

  scale = parseInt(scale, 10);
  if (scale && scale > 3)
    this.scale = scale;
}

SudokuGenerator.fixtures = {3: [], 4: []};
SudokuGenerator.fixtures[3] = [

  [[8,6,5, 0,1,0, 7,0,2],
   [0,0,0, 8,0,0, 0,0,0],
   [1,0,4, 0,0,2, 0,6,8],

   [0,2,0, 0,0,0, 0,0,9],
   [0,5,0, 3,2,9, 0,8,0],
   [9,0,0, 0,0,0, 0,7,0],

   [2,8,0, 5,0,0, 6,0,1],
   [0,0,0, 0,0,4, 0,0,0],
   [5,0,1, 0,8,0, 9,3,7]],


  [[6,0,1, 8,5,0, 7,0,0],
   [8,5,0, 3,0,0, 1,0,4],
   [0,9,0, 0,4,0, 0,0,0],

   [5,7,0, 2,0,0, 0,0,0],
   [1,2,3, 0,0,0, 5,4,6],
   [0,0,0, 0,0,1, 0,8,7],

   [0,0,0, 0,8,0, 0,3,0],
   [9,0,5, 0,0,2, 0,7,8],
   [0,0,4, 0,9,3, 6,0,1]],


  [[1,0,0, 0,0,8, 0,9,0],
   [8,2,6, 4,0,0, 0,7,1],
   [3,0,4, 0,0,5, 0,0,0],

   [2,0,0, 1,0,4, 0,5,0],
   [0,4,0, 9,0,3, 0,2,0],
   [0,8,0, 6,0,7, 0,0,4],

   [0,0,0, 5,0,0, 3,0,8],
   [9,6,0, 0,0,2, 7,1,5],
   [0,5,0, 8,0,0, 0,0,9]]

];

SudokuGenerator.prototype = {
  scale: 3
};

SudokuGenerator.prototype.next = function() {
  var last = this.last()
  var fixture = SudokuGenerator.fixtures[this.scale] || [];
  fixture = fixture[Math.floor(Math.random() * fixture.length)];

  if (fixture && fixture.length > 0 && fixture != last)
    this.history.push(fixture);

  return fixture;
};

SudokuGenerator.prototype.last = function() {
  return this.history[this.history.length - 1];
};
