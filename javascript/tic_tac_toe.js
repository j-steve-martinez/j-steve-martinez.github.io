function ticTacToe() {

  var Controller = function() {
        "use strict";
        var updateBoard,
            computer,
            isEmpty,
            isWinner,
            reset,
            defaultMoves = [5, 1, 3, 7, 9, 2, 6, 8, 4],
            counter = 0;
    
        // keep track of moves on the board
        var board = {
          1 : "",
          2 : "",
          3 : "",
          4 : "",
          5 : "",
          6 : "",
          7 : "",
          8 : "",
          9 : "",
        };
    
        // winning patterns
        var patterns = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    
        var isGameOver = false;
    
        // user and computer token X or O
        var utoken = '';
        var ctoken = '';
    
        this.move = function(id) {
          "use strict";
          if (isEmpty(id)) {
            if (isGameOver === false) {
              updateBoard(id, 'u');
              computer();
            }
          }
        };
    
        this.setToken = function(t) {
          "use strict";
          utoken = t;
          utoken == 'X' ? ctoken = 'O' : ctoken = 'X';
        };
    
        this.newGame = function(answer) {
          "use strict";
          if (answer == "yes") {
            $('#again').hide();
            $('#board').fadeIn();
            reset();
          } else {
            $('#again').hide();
            $('#credits').fadeIn(2000);
          }
        };
    
        reset = function() {
          "use strict";
          board = {
            1 : "",
            2 : "",
            3 : "",
            4 : "",
            5 : "",
            6 : "",
            7 : "",
            8 : "",
            9 : "",
          };
    
          $('.box').css('background-color', '');
          isGameOver = false;
          counter = 0;
          updateBoard('reset');
        };
    
        updateBoard = function(id, who) {
          "use strict";
          var emptyCells = 0;
          if (id == 'reset') {
            // reset the board
            Object.keys(board).forEach(function(key) {
              $('#' + key).text(board[key]);
            });
          } else {
            // check if position is available
            // if so set token
            parseInt(id);
            if (board[id] == '') {
              // update board
              if (who == 'c') {
                board[id] = ctoken;
              } else {
                board[id] = utoken;
              }
            }
            Object.keys(board).forEach(function(key) {
              $('#' + key).text(board[key]);
              if (board[key] == "") {
                emptyCells++;
              }
            });
            if (emptyCells == 1) {
              isGameOver = true;
            }
            isWinner();
          }
        };
    
        computer = function() {
          "use strict";
          var block,
              win;
          var moves = [];
    
          // try to win or try to block
          // if 2 tokens in a row
          if (counter === 0) {
            // take center if available
            // then corners
            // then cross
            moves = defaultMoves;
          } else {
            // try to block
            for (var j = 0; j < patterns.length; j++) {
              var pArr = patterns[j];
              var count = 0;
              for (var i = 0; i < pArr.length; i++) {
                if (board[pArr[i]] == utoken) {
                  count++;
                }
                if (count == 2) {
                  var empty;
                  pArr.forEach(function(p) {
                    if (isEmpty(p)) {
                      empty = p;
                    }
                  });
                  if (isEmpty(empty)) {
                    block = empty;
                    if (moves[0] !== block) {
                      moves.unshift(block);
                    }
                    j = patterns.length;
                  }
                }
              }
            }
            // try to win
            for (var j = 0; j < patterns.length; j++) {
              var pArr = patterns[j];
              var count = 0;
              for (var i = 0; i < pArr.length; i++) {
                if (board[pArr[i]] == ctoken) {
                  count++;
                }
                if (count == 2) {
                  var empty;
                  pArr.forEach(function(p) {
                    if (isEmpty(p)) {
                      empty = p;
                    }
                  });
                  if (isEmpty(empty)) {
                    win = empty;
                    if (moves[0] !== win) {
                      moves.unshift(win);
                    }
                    j = patterns.length;
                  }
                }
              }
            }
          }
          // try to make a move better than default
          // it token and two empty move to empty
          if (moves.length === 0) {
            for (var j = 0; j < patterns.length; j++) {
              var pArr = patterns[j];
              var count = 0;
              var blank = 0;
              for (var i = 0; i < pArr.length; i++) {
                if (board[pArr[i]] == ctoken) {
                  count++;
                }
                if (board[pArr[i]] == "") {
                  blank++;
                }
    
                if (count == 1 && blank == 2) {
                  var empty;
                  pArr.forEach(function(p) {
                    if (isEmpty(p)) {
                      // empty = p;
                      moves.unshift(p);
                    }
                  });
                  j = patterns.length;
                  i = pArr.length;
                }
              }
            }
          }
          // when all else fails
          // make a default move
          if (moves.length === 0) {
            moves = defaultMoves;
          }
          // make the move
          for (var i = 0; i < moves.length; i++) {
            if (isEmpty(moves[i])) {
              updateBoard(moves[i], 'c');
              i = moves.length;
            }
          }
          // let the computer know it's not the first
          counter++;
        };
    
        isWinner = function() {
          "use strict";
          var winner = [];
          var pArr = [];
          var timer = 0;
          var cellList = [];
          var aWinner = false;
    
          function check(t) {
            var token = t;
            for (var j = 0; j < patterns.length; j++) {
              pArr = patterns[j];
              var count = 0;
              for (var i = 0; i < pArr.length; i++) {
                if (board[pArr[i]] == token) {
                  count++;
                }
                if (count == 3) {
                  winner = pArr;
                  j = patterns.length;
                }
              }
            }
          }
          check('O');
          check('X');
          if (winner.length === 3) {
            winner.forEach(function(id) {
              $('#' + id).css('background-color', 'green');
            });
            isGameOver = true;
            aWinner = true;
          }
          if (isGameOver) {
            $('#board').fadeOut(2900);
            var timerID = setInterval(function() {
              timer++;
              if (timer == 3) {
                // $('#again').show();
                reset();
                $("#ask").show();
                clearInterval(timerID);
              }
            }, 1000);
            if (aWinner === false) {
              Object.keys(board).forEach(function(key) {
                if (board[key] == "") {
                  cellList.push(key);
                }
              });
              $('#' + cellList[0]).text('Draw');
              $('#' + cellList[0]).css('background-color', 'red');
            }
    
          }
        };
        // check to see if a cell is empty
        // return true if empty
        isEmpty = function(x) {
          "use strict";
          if (board[+x] === '') {
            // is empty
            return true;
          } else {
            return false;
          }
        };
      };
  
  function main() {
    "use strict";
    var game = new Controller();
    // $('#credits').hide();
    $('#board').hide();
    // $('#again').hide();
    $('.ask').on('click', function(event) {
      game.setToken(event.currentTarget.id);
      $("#ask").hide();
      $('#board').show();
    });

    $('.new-game').on('click', function(event) {
      game.newGame(event.currentTarget.id);
    });

    $('.box').click(function(event) {
      game.move(event.currentTarget.id);
    });
  }

  $(document).ready(main);
}
