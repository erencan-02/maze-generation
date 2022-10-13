
class MazeSolver{

  step(){

  }

  getUnblockedAdjacentCells(cell, field){
    var cells = [];
    var i = cell.i;
    var j = cell.j;
    var neighbour;

    if(i > 0){
      neighbour = field[i-1][j];

      if(!neighbour.southWall){
        cells.push(neighbour);
      }
    }

    if(i < field.length-1){
      neighbour = field[i+1][j];

      if(!cell.southWall){
        cells.push(neighbour);
      }
    }

    if(j > 0){
      neighbour = field[i][j-1];

      if(!neighbour.eastWall){
        cells.push(neighbour);
      }
    }

    if(j < field[0].length-1){
      neighbour = field[i][j+1];

      if(!cell.eastWall){
        cells.push(neighbour);
      }
    }

    return cells;
  }
}


class AStar extends MazeSolver{

  constructor(grid, startCell, endCell){
    super();
    this.grid = grid;
    this.startCell = startCell;
    this.endCell = endCell;
    this.currentCell;

    this.openSet = [this.startCell];
    this.gScore = this.initializeGScore();
    this.fScore = this.initializeFScore();
    this.is_done = false;

    this.cameFrom = new WeakMap();
  }

  step(){
    if(this.is_done){
      return;
    }

    this.currentCell = this.getMinFScoreCell();
    this.currentCell.astar_is_checked = true;

    if(this.currentCell === this.endCell){
      this.drawPath()
      this.is_done = true;
      return;
    }

    this.openSet = removeFromArray(this.openSet, this.currentCell);

    var adj = this.getUnblockedAdjacentCells(this.currentCell, this.grid);

    for(var c of adj){
      var tentative_gScore = this.gScore.get(this.currentCell) + 1;

      if(tentative_gScore < this.gScore.get(c)){
        //Reconstructed path
        this.cameFrom.set(c, this.currentCell);

        this.gScore.set(c, tentative_gScore);
        this.fScore.set(c, tentative_gScore + this.h(c));

        if(!this.openSet.includes(c)){
          this.openSet.push(c);
        }
      }
    }
  }

  drawPath(){
    var path = this.reconstructPath(this.cameFrom, this.endCell);

    for(var c of path){
      c.astar_is_path = true;
    }
  }

  getMinFScoreCell(){
    return fold(
      (x, y) => {
        return (this.fScore.get(x) < this.fScore.get(y)) ? x : y;
      },
      this.openSet[0],
      this.openSet
    );
  }

  initializeGScore(){
    var costs = new WeakMap();

    this.grid.forEach((item, i) => {
      item.forEach((c, j) => {
        costs.set(c, (i == this.startCell.i) && (j == this.startCell.j) ? 0 : Infinity);
      });
    });

    return costs;
  }

  initializeFScore(){
    var costs = new WeakMap();

    this.grid.forEach((item, i) => {
      item.forEach((c, j) => {
        costs.set(c, (i == this.startCell.i) && (j == this.startCell.j) ? this.h(c) : Infinity);
      });
    });

    return costs;
  }

  reconstructPath(cameFrom, current){
    var total_path = [current];

    while(cameFrom.has(current)){
      current = cameFrom.get(current);
      total_path = prepend(current, total_path);
    }

    return total_path;
  }

  f(cell1, cell2){
    return this.g(cell1, cell2) + this.h(cell1, cell2);
  }

  h(cell){
    return Math.abs(cell.p.x - this.endCell.p.x) + Math.abs(cell.p.y - this.endCell.p.y);
  }

  g(cell){
    return Math.abs(cell.p.x - this.startCell.p.x) + Math.abs(cell.p.y - this.startCell.p.y)
  }
}
