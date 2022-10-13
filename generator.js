
class MazeGenerator{

  step(){

  }

  removeWall(c1, c2){
    var i1 = c1.i;
    var j1 = c1.j;
    var i2 = c2.i;
    var j2 = c2.j;

    var diff_i = i1 - i2;
    var diff_j = j1 - j2;

    if(diff_i == 1){
      c2.southWall = false;
    }
    else if(diff_i == -1){
      c1.southWall = false;
    }

    if(diff_j == 1){
      c2.eastWall = false;
    }
    else if(diff_j == -1){
      c1.eastWall = false;
    }
  }

  getAdjacentCells(cell, field){
    var cells = [];
    var i = cell.i;
    var j = cell.j;

    if(i > 0){
      cells.push(field[i-1][j]);
    }

    if(i < field.length-1){
      cells.push(field[i+1][j]);
    }

    if(j > 0){
      cells.push(field[i][j-1]);
    }

    if(j < field[0].length-1){
      cells.push(field[i][j+1]);
    }

    return cells;
  }

  getWalls(grid){
    var w = [];

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if(i < grid.length-1){
          var southWall = cell.walls['south'];
          w.push(southWall);
        }

        if(j < grid[0].length-1){
          var eastWall = cell.walls['east'];
          eastWall.setAdj(grid[i][j+1]);
          w.push(eastWall);
        }
      });
    });

    return w;
  }
}


class RDFS extends MazeGenerator{
  constructor(grid, start){
    super();
    this.grid = grid;
    this.start = start;
    this.stack = [this.start];
    this.is_done = false;
  }

  step(){
    if(this.stack.length == 0 || this.is_done){
      this.is_done = true;
      return;
    }

    var currentCell = this.stack.pop();
    currentCell.visited = true;

    var neighbours = this.getUnvisitedNeighbours(currentCell);

    if(neighbours.length > 0){
      this.stack.push(currentCell);
      var r = random(neighbours);
      this.removeWall(currentCell, r);
      this.stack.push(r);
    }
  }

  getUnvisitedNeighbours(cell){
    return this.getAdjacentCells(cell, this.grid).filter((c) => !c.visited);
  }
}


class RKruskal extends MazeGenerator{
  constructor(grid){
    super();
    this.grid = grid;
    this.is_done = false;
    this.id = this.generateUnion(this.grid);
    this.walls = this.getWalls(this.grid);
    shuffle(this.walls);
  }

  step(){
    if(this.is_done || this.walls.length == 0){
      this.is_done = true;
      return;
    }

    var wall = this.walls.pop();

    if(!this.hasEqualId(wall.cell1, wall.cell2)){
      this.removeWall(wall.cell1, wall.cell2)
      this.overwriteID(this.getID(wall.cell1), this.getID(wall.cell2));
      wall.cell1.visited = true;
      wall.cell2.visited = true;
    }
  }

  generateUnion(grid){
    var array = []
    var c = 0;

    for(var i=0; i<grid.length; i++){
      var a = []
      for (var j=0; j<grid[0].length; j++) {
        a[j] = c;
        c++;
      }
      array.push(a);
    }

    return array;
  }

  hasEqualId(cell1, cell2){
    return this.id[cell1.i][cell1.j] == this.id[cell2.i][cell2.j];
  }

  overwriteID(oldID, newID){
    for(var i=0; i<this.id.length; i++){
      for (var j=0; j<this.id[0].length; j++) {
        if(this.id[i][j] == oldID){
          this.id[i][j] = newID;
        }
      }
    }
  }

  getID(cell){
    return this.id[cell.i][cell.j];
  }
}


class RPrim extends MazeGenerator{
  constructor(grid, startingCell){
    super();
    this.grid = grid;
    this.startingCell = startingCell;
    this.startingCell.visited = true;
    this.walls = this.getWallsOfCell(this.startingCell);
    this.is_done = false;
    //shuffle(this.walls);
  }

  step(){
    if(this.walls.length == 0 || this.is_done){
      this.is_done = true;
      return;
    }

    //shuffle(this.walls);
    var randomWall = this.walls.splice(Math.floor(Math.random()*this.walls.length), 1)[0]; //this.walls.pop(); //random(this.walls);


    var cell1 = randomWall.cell1;
    var cell2 = randomWall.cell2;

    if(cell1 == undefined || cell2 == undefined){
      return;
    }

    if(int(cell1.visited) + int(cell2.visited) == 1){
      var notInMaze = cell2.visited ? cell1 : cell2;

      cell1.visited = true;
      cell2.visited = true;

      this.removeWall(cell1, cell2);

      this.walls = this.walls.concat(this.getWallsOfCell(notInMaze)); 
    }
  }

  getWallsOfCell(cell){
    return Object.values(cell.walls).filter((x) => x !== undefined);
  }

  getAllWallsOfCell(cell){

  }
}


//Source: https://javascript.info/task/shuffle
const shuffle = (array) => {
  if(array.length <= 1){
    return;
  }

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const fold = (reducer, init, xs) => {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};

const removeFromArray = (array, e) => {
  return array.filter((x) => x !== e);
}


const prepend = (value, array) => {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
}
