// keep the variables for clashing
(function () {
    $(document).ready(function () {
        setResultHandlers();
        showNum(0);
    });

    // this should be used to keep track of all actions and numbers
    // chained in order
    // [number, divide, number] max 3 elements
    var actions = [];

    // theses keep track of the numbers
    // entered by click
    // used in the getNumber function
    var num = '';
    var results = [];
    var keyPress;

    // format a number for output to screen and
    // keep track of actions array
    function getNumber(e) {
        'use strict';

        // if the actions array has a number
        // and no operator then reset the array
        if (actions.length === 1) {
            num = '';
            results = [];
            actions = [];
        }

        keyPress = e.currentTarget.id;
        // console.log(keyPress);

        // make sure only one decimal
        if (keyPress === 'dot' || keyPress === '.') {
            // console.log(result.indexOf('.'));
            if (results.indexOf('.') === -1) {
                keyPress = '.';
                results.push(keyPress);
            }
        } else {
            results.push(keyPress);
        }
        // console.log(results);

        // make the number from the array
        num = results.join('');
        // strip off leading zero's
        // console.log(/^0+[1-9]+/.test(num));
        if (/^0+[1-9]+/.test(num)) {
            // console.log("zeros with a number");
            num = num.replace(/^0+/, '');
        } else if (/^0+\./.test(num)) {
            // console.log("zeros with a dot");
            num = num.replace(/^0+\./, '0.');
        } else if (/^0+/.test(num)) {
            // zero
            // console.log("all zeros");
            num = 0;
        }
        // console.log('results: ' + num);
        if (isNaN(num) === false) {
            showNum(num);
            return;
        } else {
            return;
        }
    }

    // set which function handles a key pressed
    function setResultHandlers() {
        'use strict';
        // console.log('in setResultHandlers');
        var id = '';
        for (var i = 0; i < 10; i++) {
            id = '#' + i;
            // console.log(id);
            $(id).click(getNumber);
        }
        $("#dot").click(getNumber);

        $("#add").click(action);
        $("#subtract").click(action);
        $("#multiply").click(action);
        $("#divide").click(action);
        $("#submit").click(action);

        $("#percent").click(action);
        $("#clear").click(clear);
        return;
    }

    // when a + - / * = is pressed
    // perform and action
    function action(e) {
        'use strict';

        // get the operator
        var myOperator = e.currentTarget.innerText;

        // we want a 3 element array
        // push the number to the action array
        switch (actions.length) {
            case 0:
            case 2:
                actions.push(+num);
                break;
        }

        // check for %
        // and convert num to percent
        // if it's the second number
        // convert to a percent of the first
        // and update the array
        if (myOperator == '%' && action.length !== 0) {
            if (actions.length === 1) {
                actions[0] = actions[0] / 100;
                showNum(actions[0]);
                return;
            } else if (actions.length === 3) {
                actions[2] = actions[0] * (actions[2] / 100);
                console.log('% ' + actions[2]);
                showNum(actions[2]);
                return;
            }
        }

        // don't do anything if action without a number
        if (actions.length !== 0) {
            // if we have 3 then do some math
            if (actions.length == 3) {
                var myNum1 = actions[0];
                var myOp = actions[1];
                var myNum2 = actions[2];
                var myResult = '';
                switch (myOp) {
                    case '+':
                        myResult = myNum1 + myNum2;
                        break;
                    case '-':
                        myResult = myNum1 - myNum2;
                        break;
                    case '*':
                        myResult = myNum1 * myNum2;
                        break;
                    case '/':
                        myResult = myNum1 / myNum2;
                        break;
                }
                // clear out the actions
                actions = [];

                // push the result to the array
                // to reuse in next operation
                actions.push(myResult);

                // update the screen
                if (myResult !== '') {
                    showNum(myResult);
                }
            }

            // if the action was = don't push action
            if (myOperator !== '=') {
                console.log('pushing myOperator on actions...');
                actions.push(myOperator);
            }

            // reset the number
            num = '';
            results = [];
        }
        return;
    }

    // reset the calculator
    function clear() {
        'use strict';
        actions = [];
        num = '';
        results = [];
        showNum(0);
        console.clear();
        return;
    }

    function showNum(n) {
        document.getElementById('result').value = n;
    }

})();