

class MazeGenerator{

  step(){

  }
}




class RDFS extends MazeGenerator{
  constructor(grid, start){
    super();
    this.grid = grid;
    this.start = start;
    this.stack = [this.start];
    this.currentCell = this.start;
  }

  step(){
    this.currentCell.visited = true;

    var unvN = this.unvisitedNeighbours(this.currentCell);

    if(unvN.length == 0){
      return;
    }

    var randomCell = random(unvN);

    var i1 = this.currentCell.i;
    var j1 = this.currentCell.j;
    var i2 = randomCell.i;
    var j2 = randomCell.j;

    var diff_i = i1 - i2;
    var diff_j = j1 - j2;

    if(diff_i < 0){
      this.currentCell.eastWall = false;
    }
    else if (diff_i > 0) {
      randomCell.eastWall = false;
    }

    if(diff_j < 0){
      this.currentCell.southWall = false;
    }
    else if (diff_j > 0) {
      randomCell.southWall = false;
    }

    //this.currentCell = randomCell;
    this.step(randomCell);
  }

  chooseRandomUnvisitedNeighbour(cell){
    var unvisited = getUnvisitedNeighbours(cell);
    return random(unvisited);
  }

  unvisitedNeighboursCount(cell){
    return this.unvisitedNeighbours(cell).length;
  }

  neighbourCells(cell){
    var cells = [];
    var i = cell.i;
    var j = cell.j;

    if(i != 0){
      cells.push(this.grid[i-1][j]);
    }

    if(i != grid.length-1){
      cells.push(this.grid[i+1][j]);
    }

    if(j != 0){
      cells.push(this.grid[i][j-1]);
    }

    if(j != grid.length-1){
      cells.push(this.grid[i][j+1]);
    }

    return cells;
  }

  unvisitedNeighbours(cell){
    return this.neighbourCells(cell).filter((c) => !c.visited);
  }
}







class RDFSI extends MazeGenerator{
  constructor(grid, start){
    super();
    this.grid = grid;
    this.start = start;
    this.stack = [this.start];
  }

  step(){
    if(this.stack.length == 0){
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

  getNeighbourCells(cell){
    var cells = [];
    var i = cell.i;
    var j = cell.j;

    if(i > 0){
      cells.push(this.grid[i-1][j]);
    }

    if(i < grid.length-1){
      cells.push(this.grid[i+1][j]);
    }

    if(j > 0){
      cells.push(this.grid[i][j-1]);
    }

    if(j < grid[0].length-1){
      cells.push(this.grid[i][j+1]);
    }

    return cells;
  }

  getUnvisitedNeighbours(cell){
    return this.getNeighbourCells(cell).filter((c) => !c.visited);
  }
}





























//whitespace
