
const ALGORITHMS = ["RDFS", "KRUSKAL", "PRIM"];
const DEFAULT_ALGORITHM = ALGORITHMS[2];

//Resolution Settings
var cell_size = 40;
var windowWidth;
var windowHeight;

//Color Settings
var bg_color = "#0D1117";
var line_color = "#00F03C";
var astar_checked_color = "#FF0066";
var astar_path_color = "#FFFFFF";

//Speed Settings
var steps_per_frame = 20;
var frame_rate = 30;

var canvas;
var grid = [];
var maze_gen;
var maze_solver;
var starting_cell;
var selected_algorithm = DEFAULT_ALGORITHM;
var is_paused = false;
var show_maze = false;
var solve_maze = false;

const getAlgorithm = function(name){
  name = name == undefined ? DEFAULT_ALGORITHM : name;

  var algorithms = {
    'RDFS': new RDFS(grid, starting_cell),
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
    rowN = floor(windowHeight/cell_size);
  }

  if(colN == undefined){
    colN = floor(windowWidth/cell_size);
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

const resetCanvas = function(){
  //Recalculate resolution values
  //cell_size = calculateIdealCellSize(windowWidth, windowHeight);

  //resetCanvas control
  starting_cell = undefined;
  maze_gen = undefined;
  maze_solver = undefined;

  //resetCanvas Grid
  initializeGrid(grid);
}

const mod = function(n, m) {
  return ((n % m) + m) % m;
}

const calculateIdealCellSize = function(w, h){
  var minSize = 30;
  var maxSize = 70;
  var results = {};

  for(var i=minSize; i<maxSize; i++){
    results[i] = (floor(w/i)*i)/w;
  }

  return int(Object.keys(results).reduce((key, v) => results[v] > results[key] ? v : key));
}

const handleAlgorithms = function(){
  if(maze_gen !== undefined && starting_cell !== undefined){
    if(!maze_gen.is_done){
      for (var i = 0; i<steps_per_frame && !is_paused; i++) {
        maze_gen.step();
      }
    }
    else{
      if(maze_solver == undefined && solve_maze){
        maze_solver = new AStar(grid, starting_cell, grid[grid.length-1][grid[0].length-1]);
      }
      else if(maze_solver != undefined){
        if(maze_solver.is_done){
          maze_solver.drawPath();
        }
        else{
          for (var i = 0; i<steps_per_frame && !is_paused; i++) {
            maze_solver.step();
          }
        }
      }
    }
  }
}

const solveMaze = function(){
  solve_maze = !solve_maze;
}

function setup(){
  background(bg_color);
  frameRate(frame_rate);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.mouseClicked(checkMouseClick);

  cell_size = calculateIdealCellSize(windowWidth, windowHeight);
  initializeValues();
  initializeGrid(grid, floor(windowHeight/cell_size), floor(windowWidth/cell_size));
}

function draw() {
  frameRate(frame_rate);
  background(bg_color);

  grid.forEach((item, i) => {
    item.forEach((c, j) => {
      c.show();
    });
  });

  handleAlgorithms();
}

function Cell(i, j){

  //Position infos
  this.i = i;
  this.j = j;
  this.p = new Point(j*cell_size, i*cell_size);

  //Walls
  this.eastWall = true;
  this.southWall = true;
  this.visited = false;
  this.walls = {
    'east': new Wall(this, undefined, new Point(this.p.x + cell_size, this.p.y), new Point(this.p.x + cell_size, this.p.y + cell_size)),
    'south': new Wall(this, undefined, new Point(this.p.x, this.p.y + cell_size), new Point(this.p.x + cell_size, this.p.y + cell_size)),
    'west': new Wall(this, undefined, undefined, undefined),
    'north': new Wall(this, undefined, undefined, undefined)
  };

  //Maze solving algorithm
  this.astar_is_checked = false;
  this.astar_is_path = false;
  this.path_box_factor = 0.4;
  this.path_box_offset = cell_size * (1 - this.path_box_factor)/2;

  this.show = function() {

    if(this.eastWall && this.walls['east'] !== undefined){
      this.walls['east'].show();
    }

    if(this.southWall && this.walls['south'] !== undefined){
      this.walls['south'].show();
    }

    //Walls for the border. Just visuals.
    //No impact on the algorithms.
    stroke(line_color);
    if(this.i == 0){
      line(this.p.x, this.p.y, this.p.x + cell_size, this.p.y);
    }

    if(this.j == 0){
      line(this.p.x, this.p.y, this.p.x, this.p.y + cell_size);
    }

    stroke(0);

    if(this.astar_is_path){
      fill(astar_path_color);
      rect(this.p.x + this.path_box_offset, this.p.y + this.path_box_offset, cell_size*this.path_box_factor, cell_size*this.path_box_factor);
    }
    else if(this.astar_is_checked){
      fill(astar_checked_color);
      rect(this.p.x + this.path_box_offset, this.p.y + this.path_box_offset, cell_size*this.path_box_factor, cell_size*this.path_box_factor);
    }
    else if(((starting_cell == undefined) && this.isHovering()) || (show_maze && this.visited)){
      fill([0, 200, 200]);
      rect(this.p.x, this.p.y, cell_size, cell_size);
    }
  }

  this.getPos = function() {
    return [cell_size*this.j, cell_size*this.i];
  }

  this.isHovering = function() {
    return mouseX > this.p.x && mouseX < this.p.x + cell_size && mouseY > this.p.y && mouseY < this.p.y + cell_size;
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


function checkMouseClick(){
    if(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height){
      process();
      return;
    }
}

function process() {
  if(starting_cell == undefined){
    var i = int(mouseY/cell_size);
    var j = int(mouseX/cell_size);

    run(selected_algorithm, i, j);
  }
}

function run(algo_name, i, j){
  i = i == undefined ? 0 : i;
  j = j == undefined ? 0 : j;
  starting_cell = grid[i][j];

  var params = getParameters();
  setParameters(params["frame_rate"], params["steps_per_frame"], params["selected_algorithm"]);

  maze_gen = getAlgorithm(selected_algorithm);
}

function getParameters(){
  var input_frame_frate = parseInt(document.getElementById("input_frame_rate").value);
  var input_steps_per_frame = parseInt(document.getElementById("input_steps_per_frame").value);
  var input_algorithm = document.getElementById("input_selected_algorithm").value;

  return {
    "frame_rate": input_frame_frate,
    "steps_per_frame": input_steps_per_frame,
    "selected_algorithm": input_algorithm
  }
}

function setParameters(fr, spf, algo){
  frame_rate = fr <= 0 ? 1 : fr;
  steps_per_frame = spf <= 0 ? 1 : spf;
  selected_algorithm = algo == undefined || !ALGORITHMS.includes(algo.toUpperCase()) ? DEFAULT_ALGORITHM : algo.toUpperCase();
}

function setPause(b){
  is_paused = b;
}

function setStepsPerFrame(spf){
  steps_per_frame = spf > 0 ? spf : 1;
   document.getElementById("input_steps_per_frame").value = steps_per_frame;
}

function setShowMaze(b){
  show_maze = b;
  document.getElementById("input_show_maze").checked = show_maze;
}

function setCellSize(n){
  var minSize = 15;
  var maxSize = 1000;

  cell_size = minSize <= n <= maxSize ? n : calculateIdealCellSize(windowWidth, windowHeight);
  resetCanvas();
}

function setSelectedAlgorithm(i){
  selected_algorithm = ALGORITHMS[mod(i, ALGORITHMS.length)];
  document.getElementById("input_selected_algorithm").value = selected_algorithm;
}
