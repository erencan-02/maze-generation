const BG_COLOR = [13, 17, 23];
const LINE_COLOR = [200, 0, 200];
const CELL_SIZE = 100;
var SCREEN_WIDTH; // = 1900;
var SCREEN_HEIGHT; // = 1050;

var grid = [];
var maze_gen;
var startingCell;

function setup(){
  background(BG_COLOR);

  SCREEN_WIDTH = windowWidth;
  SCREEN_HEIGHT = windowHeight;

  createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  //frameRate(30);

  // let inp = createInput('');
  // inp.position(0, 0);
  // inp.size(100);
  // inp.input(() => 1);

  for(let i=0; i<floor(SCREEN_HEIGHT/CELL_SIZE); i++){
      var row = [];
    for(let j=0; j<floor(SCREEN_WIDTH/CELL_SIZE); j++){
      row.push(new Cell(i, j));
    }
    grid.push(row);
  }
}

function draw() {
  background(BG_COLOR);

  grid.forEach((item, i) => {
    item.forEach((c, j) => {
      c.show();
    });
  });

  if(startingCell != undefined){
    maze_gen.step();
  }
}

function mouseClicked() {
  if(startingCell == undefined){
    var i = int(mouseY/CELL_SIZE);
    var j = int(mouseX/CELL_SIZE);

    startingCell = grid[i][j];
    maze_gen = new RDFSI(grid, startingCell);
  }
}


function Cell(i, j){
  this.i = i;
  this.j = j;
  this.eastWall = true;
  this.southWall = true;
  this.visited = false;

  this.show = function() {
    var pos = this.getPos();

    if((startingCell == undefined) && this.isHovering()){
      fill([0, 200, 200]);
      stroke(0);
      rect(pos[0], pos[1], CELL_SIZE, CELL_SIZE);
    }

    stroke(LINE_COLOR);

    if(this.eastWall){
      line(pos[0] + CELL_SIZE, pos[1], pos[0] + CELL_SIZE, pos[1] + CELL_SIZE);
    }

    if(this.southWall){
      line(pos[0], pos[1] + CELL_SIZE, pos[0] + CELL_SIZE, pos[1] + CELL_SIZE);
    }
    //rect(this.j*CELL_SIZE, this.i*CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  this.isHovering = function() {
    var pos = this.getPos();
    return mouseX > pos[0] && mouseX < pos[0] + CELL_SIZE && mouseY > pos[1] && mouseY < pos[1] + CELL_SIZE;
  }

  this.getPos = function() {
    return [CELL_SIZE*this.j, CELL_SIZE*this.i];
  }
}
