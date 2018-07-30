(function () {

    var Timer = function (type) {
        // id is the element id to update
        var id = $('#time');
        // type is session or break
        var type = type;
        // countdown time minutes
        var mytime;
        // countdown time seconds
        var seconds;
        // timer id
        var timerID;
        // used to set the time on first run
        var isFirstTime = true;
        // status of countdown timer is running
        var isRun = false;
        // session number
        var myWork = $('#wnum');
        // break number
        var myBreak = $('#bnum');
        // output for countdown
        var myPanel = $('#panel');

        // The start and stop funcions
        // will return the status of the timer
        // if it's running  == true
        //         stopped  == false
        // start the countdown
        this.start = function () {
            if (isRun) {
                return true;
            } else {
                updateClass();
                timerID = setInterval(showTime, 1000);
                isRun = true;
                return isRun;
            }
        };

        // stop the countdown
        this.stop = function () {
            if (isRun) {
                clearInterval(timerID);
                isRun = false;
                return isRun;
            } else {
                return false;
            }
        };

        // reset the countdown
        this.reset = function () {
            // console.log('reset');
            isFirstTime = true;
            clearInterval(timerID);
            isRun = false;
            type = 'w';
            updateClass('reset');
            $('#bnum').text('5');
            $('#wnum').text('25');
            $('#time').text('25');
            updateTime();
        };

        // show the status of countdown
        this.isRunning = function () {
            return isRun;
        };

        this.typeOf = function () {
            return type;
        };

        this.setType = function (theType) {
            type = theType;
            return true;
        };

        this.setClass = function () {
            updateClass();
        };

        this.setTime = function () {
            updateTime();
        };

        updateClass = function (p) {
            var myP = p;
            // console.log(myPanel);
            if (myPanel.hasClass('panel-info')) {
                myPanel.removeClass('panel-info');
            } else if (myPanel.hasClass('panel-success')) {
                myPanel.removeClass('panel-success');
            } else if (myPanel.hasClass('panel-danger')) {
                myPanel.removeClass('panel-danger');
            }

            if (myP == 'reset') {
                myPanel.addClass('panel-info');
            } else if (type == 'w') {
                myPanel.addClass('panel-success');
            } else if (type == 'b') {
                myPanel.addClass('panel-danger');
            }
        };

        // set the time for the type
        updateTime = function () {
            if (type == "w") {
                mytime = $('#wnum').text();
            } else if (type == "b") {
                mytime = $('#bnum').text();
            }
        };

        // display the countdown on screen
        showTime = function () {
            var timeString,
                min,
                sec;
            // first time decrement the minutes
            if (isFirstTime) {
                // get the time
                updateTime();
                // no longer the first run
                isFirstTime = false;
                mytime--;
                seconds = 60;
            }
            seconds--;
            if (seconds == 0 && mytime != 0) {
                mytime--;
                seconds = 60;
            }
            // pad the seconds
            if (seconds.toString().length == 1) {
                sec = '0' + seconds;
            } else {
                sec = seconds;
            }
            // pad the minutes
            if (mytime.toString().length == 1) {
                min = '0' + mytime;
            } else {
                min = mytime;
            }

            // update the screen
            timeString = min + ':' + sec;
            id.text(timeString);
            $('#time-control').val(timeString);
            // console.log(timeString);

            // stop the timer if at zero
            if (mytime == 0 && seconds == 0) {
                clearInterval(timerID);
                isRun = false;
                isFirstTime = true;
                // create an event
                var evt = $.Event('timeend');
                evt.state = true;
                $(window).trigger(evt);

            }
        };

        this.updateControl = function (e) {
            // console.log('in updateControl');
            var bId = e.currentTarget.id;
            // console.log(e);

            var w = myWork.text();
            var b = myBreak.text();
            switch (bId) {
                case 'wpos':
                    w++;
                    myWork.text(w);
                    break;
                case 'wneg':
                    w--;
                    if (w == 0) {
                        w = 1;
                    }
                    myWork.text(w);
                    break;
                case 'bpos':
                    b++;
                    myBreak.text(b);
                    break;
                case 'bneg':
                    b--;
                    if (b == 0) {
                        b = 1;
                    }
                    myBreak.text(b);
                    break;
            }
            if (type == 'w') {
                $('#time').text(w);
            } else if (type == 'b') {
                $('#time').text(b);
            }
        };
    };

    $(document).ready(function () {

        var status = false;
        var countdown = new Timer('w');

        $('#time').text(25);
        $('#wnum').text(25);
        $('#bnum').text(5);

        //for debugging
        // $('#time').text(1);
        // $('#wnum').text(1);
        // $('#bnum').text(1);

        $('#start').on('click', function () {
            countdown.start();
        });

        $('#stop').on('click', function () {
            countdown.stop();
        });

        $('#reset').on('click', function () {
            countdown.stop();
            countdown.reset();
        });

        $('#rest').on('click', function () {
            countdown.reset();
            $('#bnum').text(5);
            countdown.setType('b');
            countdown.setClass();
            $('#time').text(5);
            countdown.setTime();
        });

        $('#work').on('click', function () {
            countdown.reset();
            $('#wnum').text(25);
            countdown.setType('w');
            countdown.setClass();
            $('#time').text(25);
            countdown.setTime();
        });

        $('.my-button').on('click', function (e) {
            status = countdown.stop();
            countdown.updateControl(e);
        });

        $(window).on('timeend', function (e) {
            // console.log('the time has ended ', e.state);
            if (countdown.typeOf() == 'w') {
                status = countdown.setType('b');
                status = countdown.stop();
                status = countdown.start();
            } else {
                countdown.reset();
            }
        });
    });

})();