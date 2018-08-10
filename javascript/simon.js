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
(function () {

  var Controller = function () {
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
      '1': {
        mousedown: 'lightgreen',
        mouseup: 'green',
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'
      },
      // red
      '2': {
        mousedown: 'red',
        mouseup: 'darkred',
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'
      },
      // yellow
      '3': {
        mousedown: 'gold',
        mouseup: 'goldenrod',
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
      },
      // blue
      '4': {
        mousedown: 'lightblue',
        mouseup: 'blue',
        sound: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'
      }
    };

    setGameMoves = function () {
      var min = 1;
      var max = 4;
      for (var i = 0; i < 20; i++) {
        // for (var i = 0; i < 1; i++) {
        cmoves[i] = Math.round(Math.random() * (max - min) + min).toString();
      }
    };

    checkMoves = function (id) {
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

    playGame = function (count, caller) {
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
        var gtimer = setInterval(function () {
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

    winner = function () {
      $('#start').text('YOU');
      $('#strict').text('WIN');
      $('#reset').text('GAME');
    };

    animate = function (id) {
      // flash mouse down color
      setBackgroundColor('mousedown', id);
      // play the sound
      playSound(id);
      // set timeout for mouse up color
      setTimeout(setBackgroundColor, 500, 'mouseup', id);
    };

    showCount = function () {
      if (gameCounter === 0 && isStarted === false) {
        myCount = '--';
      } else {
        var myCount = gameCounter + 1;
      }
      // myCount.toString();
      if (myCount < 10) {
        myCount = "0" + myCount;
      }
      $('#counter').text(myCount);
    };

    showError = function (id) {
      var eid,
        etime,
        ecount = 0;

      eid = setInterval(function () {
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

    setStrict = function () {
      if (isOn) {
        isStrict ? isStrict = false : isStrict = true;
        if (isStrict) {
          $('#strict').css('color', 'yellow');
        } else {
          $('#strict').css('color', 'red');
        }
      }
    };

    playSound = function (id) {
      if (id !== undefined) {
        var sound = new Audio(color[id].sound);
        sound.play();
      }
    };

    setBackgroundColor = function (type, id) {
      if (id !== undefined) {
        $('#' + id).css('background-color', color[id][type]);
      }
    };

    animateLabels = function (type, id) {
      // console.log('set color');
      var arr = ['start', 'strict', 'reset'];
      arr.forEach(function (item) {
        looper(item);
      });

      function looper(id) {
        var len = id.length;
        var label = '';
        var dom = $('#' + id);
        var count = 0;
        dom.text('');

        var timer = setInterval(function () {
          label += id.slice(count, count + 1);
          // console.log(label);
          dom.text(label.toUpperCase());
          if (count === len) {
            clearInterval(timer);
          }
          count++;
        }, 100);
      }

    };

    resetStrict = function () {
      setGameMoves();
      gameCounter = 0;
      moveError = false;
      umoves = [];
      setTimeout(playGame, 1000, gameCounter);
    };

    resetGame = function () {
      setGameMoves();
      gameCounter = 0;
      moveError = false;
      if (isStrict) {
        setStrict();
      }
      isStarted = false;
      umoves = [];
      if (isOn) {
        $('#start').css('color', 'red');
      }
      animateLabels();
      showCount();
    };

    this.strict = function () {
      setStrict();
    };

    this.power = function () {
      // console.log(state);
      isOn ? isOn = false : isOn = true;
      if (isOn) {
        // turn on
        $('#power').css('border-right', '1px solid black');
        $('#power').css('border-left', '25px solid black');
        $('#power').css('background-color', 'red');
        $('.label').css('color', 'red');
        $('#counter').css('color', 'red');
        animate('1');
        setTimeout(animate, 500, '2');
        setTimeout(animate, 1000, '4');
        setTimeout(animate, 1500, '3');
        setTimeout(animateLabels, 2000);
      } else {
        // turn off
        $('#power').css('border-left', '1px solid black');
        $('#power').css('border-right', '25px solid black');
        $('#power').css('background-color', 'darkred');


        $('.label').css('color', 'black');
        $('#counter').css('color', 'black');
        resetGame();
      }
    };

    this.reset = function () {
      resetGame();
    };

    this.sound = function (id) {
      if (moveError === false && isStarted === true && isAnimating === false) {
        playSound(id);
      }

    };

    this.mouse = function (type, id) {
      if (moveError === false && isStarted === true && isAnimating === false) {
        setBackgroundColor(type, id);
      }

    };

    this.move = function (id) {
      if (isStarted && isAnimating === false) {
        checkMoves(id);
      }
    };

    this.start = function (id) {
      if (isStarted === false && isOn === true) {
        // console.log('starting game');
        $('#start').css('color', '#80ff80');
        setGameMoves();
        isStarted = true;
        playGame(gameCounter, 'start');
      }
    };

  };
  // end controller

  function setHtml() {
    /**
     * get the root element
     */
    var root = document.getElementById("simon");
    root.innerText = "";

    /**
     * Add big buttons
     */
    var bigButtons = {
      1: "quarter quarter-tl",
      2: "quarter quarter-tr",
      3: "quarter quarter-bl",
      4: "quarter quarter-br"
    }
    var bigBtnWrap = document.createElement("div");
    bigBtnWrap.className = "bigBtnWrap";
    Object.entries(bigButtons).forEach((arrayS, count) => {
      var tmp = document.createElement("div");
      tmp.id = arrayS[0];
      tmp.className = arrayS[1];
      bigBtnWrap.appendChild(tmp);
    });

    /**
     * Add controls
     */
    var ctrlBtns = {
      "simon": "logo",
      "pad": "none",
      "power": "none",
      "power-label": "none",
      "start-c": "small-circle btn",
      "start": "label",
      "strict-c": "small-circle btn",
      "strict": "label",
      "reset-c": "small-circle btn",
      "reset": "label",
      "pad2": "none",
      "counter": "label",
    }
    var ctrlBtnsWrap = document.createElement("div");
    ctrlBtnsWrap.className = "ctrlBtnsWrap";
    Object.entries(ctrlBtns).forEach((arrayS, count) => {
      var tmp = document.createElement("div");
      tmp.id = arrayS[0];
      tmp.className = arrayS[1];
      if (arrayS[1] == "label") {
        tmp.innerText = arrayS[0].toUpperCase();
      }
      if (arrayS[0] == "counter") {
        tmp.innerText = "--";
      }
      if (arrayS[0] == "power-label") {
        tmp.innerText = "POWER";
      }
      if (arrayS[0] == "simon") {
        tmp.innerText = "SIMON SEEZ";
      }
      ctrlBtnsWrap.appendChild(tmp);
    });

    /**
     * Create a wrapper and add to root
     */
    var simonWrap = document.createElement("div");
    simonWrap.className = "simon-wrapper";
    simonWrap.appendChild(ctrlBtnsWrap);
    simonWrap.appendChild(bigBtnWrap);
    root.appendChild(simonWrap);

  }

  function setSounds() {
    var sounds = {
      sound1: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
      sound2: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
      sound3: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
      sound4: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
    }
    for (const sound in sounds) {
      if (sounds.hasOwnProperty(sound)) {
        /**
         * Creating the sound object preloads the sound
         */
        var note = new Audio(sounds[sound]);
      }
    }
  }

  $(document).ready(function () {
    'use strict';
    /**
     * init the sounds
     */
    setSounds();
    /**
     * create the html tags
     */
    setHtml("simon");

    var isChrome = !!window.chrome;
    if (isChrome) {
      $('body').css('font-family', 'sans-serif');
      $('.label').css('font-size', '14px');
      $('#power-label').css('font-size', '14px');
      $('h1').css('margin-left', '55px');
    }

    $('.label').css('color', 'black');
    $('#counter').css('color', 'black');

    var game = new Controller();

    $('.quarter').on('mousedown', function (e) {
      // console.log('mouse down');
      game.mouse(e.type, e.target.id);
      game.sound(e.target.id);
    });

    $('.quarter').on('mouseup', function (e) {
      // console.log('mouse up');
      game.mouse(e.type, e.target.id);
      game.move(e.target.id);
    });

    $('#strict-c').click(function (e) {
      game.strict();
    });

    $('#reset-c').click(function (e) {
      game.reset();
    });

    $('#start-c').click(function (e) {
      game.start(e.target.id);
    });

    $('#power').click(function (e) {
      game.power('on');
    });
  });

})();