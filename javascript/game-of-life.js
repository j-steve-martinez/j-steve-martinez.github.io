/*
User Story: When I first arrive at the game, it will randomly generate a board and start playing.
User Story: I can start and stop the board.
User Story: I can set up the board.
User Story: I can clear the board.
User Story: When I press start, the game will play out.
User Story: Each time the board changes, I can see how many generations have gone by.
*/
(()=>{
'use strict'
function setGameBoard(board, isBlank){
  var small  = {x : 10, y : 10},
      medium = {x : 20, y : 20},
      large  = {x : 30, y : 30},
      columns = [],
      rows = [],
      size;
  switch(board){
    case 'small':
      size = small;
      break;
    case 'medium':
      size = medium;
      break;
    case 'large':
      size = large;
      break;
  };
  columns.length = size.x;
  rows.length = size.y;
  rows.fill(0 , 0, rows.length);
  columns.fill(0 , 0, rows.length);
  if(isBlank === ''){
    var isBlank = false;
  };
  rows.forEach(function(item, x, arr){
    var cols = columns.map(function(item, y, arr){
      if (isBlank === true) {
          var rand = 0;
      } else {
          var rand = Math.round(Math.random());
      }
      // console.log(rand);
      return rand;
    });
    rows[x] = cols;
    // console.log(x);
  });
  return { type : board, cells : rows, size : size, isBlank : isBlank};
};
// var edit_array;
var Display = React.createClass({
  displayName : "display",
  getInitialState: function() {
    var new_board = this.getNewBoard('small');
    return {secondsElapsed: 0, board : new_board};
  },
  tick: function() {
    // console.log('tick');
    // this.state.game.step();
    var time = this.state.secondsElapsed +1;
    this.nextGenCells(time);
    // var curCells = this.state.game.getCurrentGenCells();
    // console.log(curCells);
    // this.setState({cells : curCells, secondsElapsed: this.state.secondsElapsed + 1});
    // this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  getNewBoard : function(size, isBlank){
    var new_board = setGameBoard(size, isBlank);
    // console.log(new_board);
    var init_cells = new_board.cells;

    // Convert init_cells array of 0's and 1's to actual Cell objects
    var length_y = init_cells.length,
        length_x,
        y, x;
    // each row
    for (y = 0; y < length_y; y++) {
        length_x = init_cells[y].length;
        // each column in rows
        for (x = 0; x < length_x; x++) {
            var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
            init_cells[y][x] = this.cell(x, y, state);
        }
    }
    new_board.cells = init_cells;
    return new_board;
  },
  nextGenCells : function(time) {
    // Function to calculate the next generation of cells, based
    //  on the rules of the Game of Life
    // Implement the Game of Life rules
    // Simple algorithm:
    //  - For each cell:
    //      - Check all of its neighbours
    //      - Based on the rules, set the next gen cell to alive or dead
    // console.log('start next gen');
    // console.log(this.state.cells[0]);
    var new_board = this.state.board;
    // console.log(new_board);
    var current_gen = new_board.cells,
        next_gen = [],      // New array to hold the next gen cells
        length_y = new_board.cells.length,
        length_x,
        y, x, alive = 0;
    // each row

    for (y = 0; y < length_y; y++) {
      length_x = current_gen[y].length;
      next_gen[y] = []; // Init new row
      // each column in rows
      for (x = 0; x < length_x; x++) {
        //var state = (init_cells[y][x] == 1) ? 'alive' : 'dead';
        var cell = current_gen[y][x];
        // Calculate above/below/left/right row/column values
         // If current cell is on first row, cell "above" is the last row (stitched)
        var row_above = (y-1 >= 0) ? y-1 : length_y-1;
         // If current cell is in last row, then cell "below" is the first row
        var row_below = (y+1 <= length_y-1) ? y+1 : 0;
         // If current cell is on first row, then left cell is the last row
        var column_left = (x-1 >= 0) ? x-1 : length_x - 1;
         // If current cell is on last row, then right cell is in the first row
        var column_right = (x+1 <= length_x-1) ? x+1 : 0;

        var neighbours = {
          top_left: current_gen[row_above][column_left].clone(),
          top_center: current_gen[row_above][x].clone(),
          top_right: current_gen[row_above][column_right].clone(),
          left: current_gen[y][column_left].clone(),
          right: current_gen[y][column_right].clone(),
          bottom_left: current_gen[row_below][column_left].clone(),
          bottom_center: current_gen[row_below][x].clone(),
          bottom_right: current_gen[row_below][column_right].clone()
        };

        var alive_count = 0;
        var dead_count = 0;
        for (var neighbour in neighbours) {
          if (neighbours[neighbour].getState() == "dead") {
            dead_count++;
          } else {
            alive_count++;
          }
        }
        // Set new state to current state, but it may change below
        var new_state = cell.getState();
        if (cell.getState() == "alive") {
          if (alive_count < 2 || alive_count > 3) {
            // new state: dead, overpopulation/ underpopulation
            new_state = "dead";
          } else if (alive_count === 2 || alive_count === 3) {
            // lives on to next generation
            alive++;
            new_state = "alive";
          }
        } else {
          if (alive_count === 3) {
            // new state: live, reproduction
            new_state = "alive";
          }
        }
        //console.log("Cell at x,y: " + x + "," + y + " has dead_count: " + dead_count + "and alive_count: " + alive_count);
        next_gen[y][x] = this.cell(x, y, new_state);
        // next_gen[x][y] = this.cell(x, y, new_state);
        //console.log(next_gen[y][x]);
      }
    }
    // console.log(alive);
    new_board.cells = next_gen;
    this.setState({secondsElapsed : time, board : new_board});
  },
  cell : function(x_pos, y_pos, state) {
    //console.log("Creating cell at " + x_pos + "," + y_pos + ", and cell state is: " + state);
    /*var x_pos = 0,        // X Position of Cell in Grid
        y_pos = 0,        // Y position of cell in Grid
        state = "dead",   // Cell state: dead or alive.
        asdf;*/
    return {
      x_pos: x_pos,
      y_pos: y_pos,
      state: state,
      getXPos: function() {
        return x_pos;
      },
      getYPos: function() {
        return y_pos;
      },
      getState: function() {
        return state;
      },
      clone: function() {
        return this;
      }
    };
  },
  componentDidMount: function() {
    // console.log('didMount');
    // console.log(this.state);
    this.start();
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  start: function(){
    this.interval = setInterval(this.tick, 1000);
  },
  stop: function(){
    clearInterval(this.interval);
    this.setState({secondsElapsed: 0});
  },
  pause: function(){
    var time = this.state.secondsElapsed;
    clearInterval(this.interval);
  },
  cellClick : function(cell){
    // console.log('cell clicked: ');
    // console.log(cell);
    var x = cell.indexOf('x');
    var y = cell.indexOf('y');
    var xPos = parseInt(cell.slice(x + 1, y));
    var yPos = parseInt(cell.slice(y + 1));
    // console.log(xPos + ':' + yPos );
    var new_board = this.state.board;
    // console.log(new_board.cells[xPos][yPos]);
    var state = new_board.cells[xPos][yPos].getState();
    // new_board.cells[xPos][yPos].toggleState();
    // console.log(state);
    state === 'dead' ? state = 'alive' : state = 'dead';
    // console.log(state);
    new_board.cells[xPos][yPos] = this.cell(yPos, xPos, state);
    // console.log(new_board.cells[xPos][yPos]);
    // console.log(new_board.cells);
    this.setState({board : new_board});
    // this.setState({edit : cell});
  },
  size : function(e){
    // console.log(e.target.id);
    this.stop();
    var new_board = this.getNewBoard(e.target.id);
    this.setState({board : new_board});
  },
  clear : function(){
    // console.log('clear');
    // console.log(this.state.board.type);
    this.stop();
    var new_board = this.getNewBoard(this.state.board.type, true);
    this.setState({board : new_board});
  },
  render : function(){
    // console.log('start render');
    // console.log(this.state.board.cells);
    if(this.state.board.cells === undefined){
      var table = null;
    } else {
      var table = <Table cells={this.state.board.cells} doClick={this.cellClick}/>;
    }
    return (
      <div>
        <div className='container' >
          <h2>The Game Of Life</h2>
          <div className='buttons'>
            <button id='small' onClick={this.size}>Small</button>
            <button id='medium' onClick={this.size}>Medium</button>
            <button id='large' onClick={this.size}>Large</button>
          </div>
          <div className='counter'>Generations: {this.state.secondsElapsed}</div>
          {table}
          <div className='buttons'>
            <button id='start' onClick={this.start}>Start</button>
            <button id='pause' onClick={this.pause}>Pause</button>
            {/*<button id='stop' onClick={this.stop}>Stop</button>*/}
            <button id='clear' onClick={this.clear}>Clear</button>
          </div>
        </div>
      </div>

    );
  }
});

var Table = React.createClass({
  displayName : 'Table',
  render : function(){
    // console.log('Table');
    // console.log(this.props);
    var rows = [],row,x;
    var cellLen = this.props.cells.length;
    for(x=0; x<cellLen; x++){
      // console.log(this.props.cells[x]);
      row = <TableCol columns={this.props.cells[x]} key={x} doClick={this.props.doClick} />;
      rows.push(row);
    };
    var table = <table><tbody>{rows}</tbody></table>
    return table;
  }
});

var TableCol = React.createClass({
  displayName : 'TableCol',
  handleClick : function(e){
    this.props.doClick(e.target.id);
  },
  render : function(){
    // console.log('Table col');
    // console.log(this.props);
    var len = this.props.columns.length;
    var x, cell, cells = [];
    for(x=0;x<len;x++){
      var id = 'x' + this.props.columns[x].y_pos + 'y' + this.props.columns[x].x_pos;
      cell = <td key={x}><div id={id} className={this.props.columns[x].state} key={x} onClick={this.handleClick}></div></td>;
      cells.push(cell);
    };
    var data = <tr>{cells}</tr>
    return data;

  }
});

ReactDOM.render(React.createElement(Display, null), document.getElementById('game-of-life'));
})();