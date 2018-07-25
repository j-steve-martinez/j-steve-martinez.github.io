/*
 User Story: I am presented with a random series of button presses.
 User Story: Each time I input a series of button presses correctly,
 I see the same series of button presses but with an additional step.

 User Story: I hear a sound that corresponds to each button
 both when the series of button presses plays,
 and when I personally press a button.

 User Story: If I press the wrong button,
 I am notified that I have done so,
 and that series of button presses starts again
 to remind me of the pattern so I can try again.

 User Story: I can see how many steps are in the current series of button presses.

 User Story: If I want to restart,
 I can hit a button to do so,
 and the game will return to a single step.

 User Story: I can play in strict mode where
 if I get a button press wrong,
 it notifies me that I have done so,
 and the game restarts at a new random series of button presses.

 User Story: I can win the game by getting a series of 20 steps correct.
 I am notified of my victory, then the game starts over.
 */
(function() {

  var Controller = function() {
    'use strict';

    var setBackgroundColor;
    var playSound;
    var setGameMoves;
    var checkMoves;
    var playGame;
    var setStrict;
    var umoves = [];
    var cmoves = [];
    var isStrict = false;
    var isStarted = false;
    var isOn = false;
    var isAnimating = false;
    var moveError = false;
    var gameCounter = 0;
    var animate;
    var showError;
    var animateLabels;
    var showCount;
    var resetGame;
    var resetStrict;
    var winner;

    var color = {
      // green
      '1' : {
        mousedown : '#80ff80',
        mouseup : '#008000',
        sound : 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
      },
      // red
      '2' : {
        mousedown : '#ff8080',
        mouseup : '#ff0000',
        sound : 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
      },
      // yellow
      '3' : {
        mousedown : '#ffffcc',
        mouseup : '#ffff00',
        sound : 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
      },
      // blue
      '4' : {
        mousedown : '#8080ff',
        mouseup : '#0000ff',
        sound : 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'
      }
    };

    setGameMoves = function() {
      var min = 1;
      var max = 4;
      for (var i = 0; i < 20; i++) {
        // for (var i = 0; i < 1; i++) {
        cmoves[i] = Math.round(Math.random() * (max - min) + min).toString();
      }
    };

    checkMoves = function(id) {
      // console.log('checking id: ' + id);
      if (isAnimating === false) {

        umoves.push(id);
        var user,
            comp,
            tid,
            time,
            item,
            key,
            error,
            count;

        key = umoves.length - 1;
        item = umoves[key];
        comp = cmoves[key];
        // console.log(key + '  ' + item + '  ' + comp);
        // console.log('gamecount: ' + gameCounter);

        if (item !== comp) {
          moveError = true;
          umoves = [];
        }

        if (moveError === true) {
          // console.log('moveError true: ' + moveError + '  ' + comp);
          showError(comp);
        } else if (key === gameCounter) {
          // console.log('gamecount: ' + gameCounter);
          // console.log('moveError: ' + moveError);
          gameCounter++;
          time = 1000;
          umoves = [];
          tid = window.setTimeout(playGame, time, gameCounter, 'check moves');
        }
      }
    };

    playGame = function(count, caller) {
      // console.log('playing game...caller: ' + caller);
      if (cmoves.length === gameCounter) {
        resetGame();
        setTimeout(winner, 1000);
        setTimeout(resetGame, 3000);
        return;
      }
      isAnimating = true;
      showCount();
      var position = 0;
      if (count === 0) {
        animate(cmoves[count]);
      } else {
        var gtimer = setInterval(function() {
          // console.log(position);
          animate(cmoves[position]);
          if (position === count) {
            //exit the loop
            clearInterval(gtimer);
          }
          position++;
        }, 800);
      }
      isAnimating = false;
    };

    winner = function() {
      $('#button-start').text('YOU');
      $('#button-strict').text('WIN');
      $('#button-reset').text('GAME');
    };

    animate = function(id) {
      // flash mouse down color
      setBackgroundColor('mousedown', id);
      // play the sound
      playSound(id);
      // set timeout for mouse up color
      setTimeout(setBackgroundColor, 500, 'mouseup', id);
    };

    showCount = function() {
      if (gameCounter === 0 && isStarted === false) {
        myCount = '--';
      } else {
        var myCount = gameCounter + 1;
      }
      // myCount.toString();
      if (myCount < 10) {
        myCount = "0" + myCount;
      }
      $('#output-counter').text(myCount);
    };

    showError = function(id) {
      var eid,
          etime,
          ecount = 0;

      eid = setInterval(function() {
        setBackgroundColor('mousedown', id);

        if (ecount === 0) {
          playSound(id);
        }

        if (ecount === 1) {
          setBackgroundColor('mouseup', id);
        }

        if (ecount === 3) {
          setBackgroundColor('mouseup', id);
        }

        if (ecount === 5) {
          setBackgroundColor('mouseup', id);
          moveError = false;
          clearInterval(eid);
          // do custom event
          if (isStrict) {
            resetStrict();
          } else {
            setTimeout(playGame, 1000, gameCounter, 'error handler');
          }
        }
        ecount++;
      }, 300);
    };

    setStrict = function() {
      if (isOn) {
        isStrict ? isStrict = false : isStrict = true;
        if (isStrict) {
          $('#button-strict').attr('class', 'simon-button-strict');
        } else {
          $('#button-strict').attr('class', 'simon-button-strict-on');
        }
      }
    };

    playSound = function(id) {
      if (id !== undefined) {
        var sound = new Audio(color[id].sound);
        sound.play();
      }
    };

    // deprecated
    setBackgroundColor = function(type, id) {
      if (id !== undefined) {
        console.log($('#input-' + id))
        $('#input-' + id).css('background-color', color[id][type]);

      }
    };

    var toggleBackground = (type, id) => {

    };

    animateLabels = function(type, id) {
      // console.log('set color');
      var arr = ['start', 'strict', 'reset'];
      // arr.forEach(function(item) {
      //   looper(item);
      // });
      function looper(id) {
        var len = id.length;
        var label = '';
        var dom = $('#button-' + id);
        var count = 0;
        dom.text('');

        var timer = setInterval(function() {
          label += id.slice(count, count + 1);
          console.log(label);
          // dom.text(label.toUpperCase());
          dom.text(label);
          if (count === len) {
            clearInterval(timer);
          }
          count++;
        }, 100);
      }

    };

    resetStrict = function() {
      setGameMoves();
      gameCounter = 0;
      moveError = false;
      umoves = [];
      setTimeout(playGame, 1000, gameCounter);
    };

    resetGame = function() {
      setGameMoves();
      gameCounter = 0;
      moveError = false;
      if (isStrict) {
        setStrict();
      }
      isStarted = false;
      umoves = [];
      if (isOn) {
        // $('#button-start').css('color', 'red');
        $('#button-start').attr('class', 'simon-button-start-on');
      }
      // animateLabels();
      showCount();
    };

    this.strict = function() {
      setStrict();
    };

    this.power = function() {
      // console.log(state);
      isOn ? isOn = false : isOn = true;
      if (isOn) {
        // turn on
        // $('#button-power').css('border-right', '0px solid black');
        // $('#button-power').css('border-left', '25px solid black');
        // $('.label').css('color', 'red');
        // $('#output-counter').css('color', 'red');
        $("#output-counter").attr('class', 'simon-control-output');
        animate('1');
        setTimeout(animate, 500, '2');
        setTimeout(animate, 1000, '4');
        setTimeout(animate, 1500, '3');
        // setTimeout(animateLabels, 2000);
      } else {
        // turn off
        // $('#button-power').css('border-left', '0px solid black');
        // $('#button-power').css('border-right', '25px solid black');
        // $('.label').css('color', 'black');
        // $('#output-counter').css('color', 'black');
        $("#output-counter").attr('class', 'simon-control-output-off');
        resetGame();
      }
    };

    this.reset = function() {
      resetGame();
    };

    this.sound = function(id) {
      if (moveError === false && isStarted === true && isAnimating === false) {
        playSound(id);
      }

    };

    this.mouse = function(type, id) {
      if (moveError === false && isStarted === true && isAnimating === false) {
        setBackgroundColor(type, id);
      }

    };

    this.move = function(id) {
      if (isStarted && isAnimating === false) {
        checkMoves(id);
      }
    };

    this.start = function(id) {
      if (isStarted === false && isOn === true) {
        // console.log('starting game');
        // $('#button-start').css('color', '#80ff80');
        $('#button-start').attr('class', 'simon-button-start-on');
        setGameMoves();
        isStarted = true;
        playGame(gameCounter, 'start');
      }
    };

  };
  // end controller

  $(document).ready(function() {
    'use strict';

    // var isChrome = !!window.chrome;
    // if (isChrome) {
    //   $('body').css('font-family', 'sans-serif');
    //   $('.label').css('font-size', '14px');
    //   $('#power-label').css('font-size', '14px');
    //   $('h1').css('margin-left', '55px');
    // }


    // $('.label').css('color', 'black');
    // $('#output-counter').css('color', 'black');

    var game = new Controller();

    $('.simon-input').on('mousedown', function(e) {
      // console.log(e.target.id.split('-')[1]);
      // console.log('mouse down');
      game.mouse(e.type, e.target.id.split('-')[1]);
      game.sound(e.target.id.split('-')[1]);
    });

    $('.simon-input').on('mouseup', function(e) {
      // console.log('mouse up');
      // e.target.id
      game.mouse(e.type, e.target.id.split('-')[1]);
      game.move(e.target.id.split('-')[1]);
    });

    $('#button-strict').click(function(e) {
      game.strict();
    });

    $('#button-reset').click(function(e) {
      game.reset();
    });

    $('#button-start').click(function(e) {
      game.start(e.target.id);
    });

    $('#button-power').click(function(e) {
      game.power('on');
    });
  });

})(); 