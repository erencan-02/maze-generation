

var CELL_SIZE = 40;
var windowWidth;
var windowHeight;

var bg_color = [13, 17, 23];
var line_color = [0, 240, 60];//[200, 0, 200];

var grid = [];
var maze_gen;
var starting_cell;
var steps_per_frame = 5;
var frame_rate = 10;
var selected_algorithm = "RDFSI";

const getAlgorithm = function(name){
  //starting_cell = starting_cell == undefined ? grid[0][0] : starting_cell;

  var algorithms = {
    'RDFSI': new RDFSI(grid, starting_cell),
    'KRUSKAL': new RKruskal(grid),
    'PRIM': new RPrim(grid, starting_cell)
  };

  return algorithms[name];
}

const initializeGrid = function(grid, rowN, colN){
  while(grid.length > 0){
    grid.pop();
  }

  if(rowN == undefined){
    rowN = floor(windowHeight/CELL_SIZE);
  }

  if(colN == undefined){
    colN = floor(windowWidth/CELL_SIZE);
  }

  for(let i=0; i<rowN; i++){
      var row = [];
    for(let j=0; j<colN; j++){
      row.push(new Cell(i, j));
    }
    grid.push(row);
  }

  //Initialize adjacent Cell attribute in all the walls
  initializeWalls(grid);
}

const initializeWalls = function(grid){
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if(i < grid.length-1){
        var southWall = cell.walls['south'];
        southWall.setAdj(grid[i+1][j]);
      }

      if(j < grid[0].length-1){
        var eastWall = cell.walls['east'];
        eastWall.setAdj(grid[i][j+1]);
      }

      //Walls that are not visualized (west, north)
      if(i > 0){
        var northWall = cell.walls['north'];
        northWall.setAdj(grid[i-1][j]);
      }

      if(j > 0){
        var westWall = cell.walls['west'];
        westWall.setAdj(grid[i][j-1]);
      }
    });
  });
}

const reset = function(){
  //Recalculate resolution values
  CELL_SIZE = calculateIdealCellSize(windowWidth, windowHeight);

  //Reset control
  starting_cell = undefined;
  maze_gen = undefined;

  //Reset Grid
  initializeGrid(grid);

  /*
  grid.forEach((item, i) => {
    item.forEach((c, j) => {
      c.eastWall = true;
      c.southWall = true;
      c.visited = false;
    });
  });*/
}

const mod = function(n, m) {
  return ((n % m) + m) % m;
}

const calculateIdealCellSize = function(w, h){
  var minSize = 40;
  var maxSize = 70;
  var results = {};

  for(var i=minSize; i<maxSize; i++){
    results[i] = (floor(w/i)*i)/w;
  }

  return int(Object.keys(results).reduce((key, v) => results[v] > results[key] ? v : key));
}

function windowResized(){
  //resizeCanvas(windowWidth, windowHeight);
  //reset();
}

function setup(){
  background(bg_color);

  CELL_SIZE = calculateIdealCellSize(windowWidth, windowHeight);

  createCanvas(windowWidth, windowHeight);
  frameRate(frame_rate);

  initializeGrid(grid, floor(windowHeight/CELL_SIZE), floor(windowWidth/CELL_SIZE));
}

function draw() {
  frameRate(frame_rate);
  background(bg_color);

  grid.forEach((item, i) => {
    item.forEach((c, j) => {
      c.show();
    });
  });

  if(maze_gen !== undefined && starting_cell !== undefined){
    if(!maze_gen.is_done){
      for (var i = 0; i<steps_per_frame; i++) {
        maze_gen.step();
      }
    }
  }
}


function Cell(i, j){
  this.i = i;
  this.j = j;
  this.p = new Point(j*CELL_SIZE, i*CELL_SIZE);
  this.eastWall = true;
  this.southWall = true;
  this.visited = false;
  this.walls = {
    'east': new Wall(this, undefined, new Point(this.p.x + CELL_SIZE, this.p.y), new Point(this.p.x + CELL_SIZE, this.p.y + CELL_SIZE)),
    'south': new Wall(this, undefined, new Point(this.p.x, this.p.y + CELL_SIZE), new Point(this.p.x + CELL_SIZE, this.p.y + CELL_SIZE)),
    'west': new Wall(this, undefined, undefined, undefined),
    'north': new Wall(this, undefined, undefined, undefined)
  };

  this.show = function() {

    if((starting_cell == undefined) && this.isHovering()){
      fill([0, 200, 200]);
      stroke(0);
      rect(this.p.x, this.p.y, CELL_SIZE, CELL_SIZE);
    }

    this.setShadow(true);

    if(this.eastWall && this.walls['east'] !== undefined){
      //line(this.p.x + CELL_SIZE, this.p.y, this.p.x + CELL_SIZE, this.p.y + CELL_SIZE);
      this.walls['east'].show();
    }

    if(this.southWall && this.walls['south'] !== undefined){
      //line(this.p.x, this.p.y + CELL_SIZE, this.p.x + CELL_SIZE, this.p.y + CELL_SIZE);
      this.walls['south'].show();
    }


    //Walls for the border. Just visuals.
    //No impact on the algorithms.
    if(this.i == 0){
      line(this.p.x, this.p.y, this.p.x + CELL_SIZE, this.p.y);
    }

    if(this.j == 0){
      line(this.p.x, this.p.y, this.p.x, this.p.y + CELL_SIZE);
    }

    this.setShadow(false);
  }

  this.isHovering = function() {
    var pos = this.getPos();
    return mouseX > pos[0] && mouseX < pos[0] + CELL_SIZE && mouseY > pos[1] && mouseY < pos[1] + CELL_SIZE;
  }

  this.getPos = function() {
    return [CELL_SIZE*this.j, CELL_SIZE*this.i];
  }

  this.setShadow = function(b){
    drawingContext.shadowColor = color(line_color);

    if(b){
      drawingContext.shadowOffsetX = 1;
      drawingContext.shadowOffsetY = 1;
      drawingContext.shadowBlur = 6;
    }
    else{
      drawingContext.shadowOffsetX = 0;
      drawingContext.shadowOffsetY = 0;
      drawingContext.shadowBlur = 0;
    }
  }
}


function Point(x, y){
  this.x = x;
  this.y = y;
}

function Wall(cell1, cell2, p1, p2){
  this.cell1 = cell1;
  this.cell2 = cell2;
  this.p1 = p1;
  this.p2 = p2;

  this.show = function(){
    stroke(line_color);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  }

  this.setAdj = function(cell){
    if(cell == undefined){
      return;
    }

    this.cell2 = cell;
  }
}

function mouseClicked() {
  if(starting_cell == undefined){
    var i = int(mouseY/CELL_SIZE);
    var j = int(mouseX/CELL_SIZE);

    run(selected_algorithm, i, j);
  }
}

function run(algo_name, i, j){
  i = i == undefined ? 0 : i;
  j = j == undefined ? 0 : j;
  algo_name = algo_name == undefined ? "RDFSI" : algo_name.toUpperCase();

  starting_cell = grid[i][j];
  maze_gen = getAlgorithm(algo_name);
}
