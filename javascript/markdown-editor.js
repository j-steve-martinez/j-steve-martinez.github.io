marked.setOptions({
    renderer : new marked.Renderer(),
    gfm : true,
    tables : true,
    breaks : false,
    pedantic : false,
    sanitize : true,
    smartLists : true,
    smartypants : false
});

var marking = [];
marking.push('# H1');
marking.push('## H2');
marking.push('### H3');
marking.push('#### H4');
marking.push('##### H5');
marking.push('*italic*');
marking.push('**bold**');
marking.push('`monospace`');
marking.push('~~strikethrough~~');
marking.push('  ');
marking.push('lists:');
marking.push('- apples');
marking.push('- oranges');
marking.push('- [x] pears');
marking.push('  ');
marking.push('Quote');
marking.push('> Purple Rain  ');
marking.push('  ');
marking.push('highlight `code`');
marking.push('  ');
marking.push('*By: [J. Steve Martinez](https://github.com/j-steve-martinez)*');

var text = marked('# HEADER1');
// var mark = "# H1";
var mark = marking.join('  \n');
// form
//      contains wrapper div
// input
//      contains left div
// output
//      contains right div

var TextArea = React.createClass({
    getInitialState : function() {
        return {
            defaultValue : 'Original Text'
        };
    },
    handleKeyUp : function(e) {
        //handle the keyup event
        // console.log('key up event');
        mark = document.getElementById('textarea').value;
        ReactDOM.render(React.createElement(Markup), document.getElementById('output'));
    },
    render : function() {
        return React.createElement('textarea', {
            id : 'textarea',
            defaultValue : mark,
            onKeyUp : this.handleKeyUp
        });
    }
});

var Markup = React.createClass({
    rawMarkup : function() {
        var rawMarkup = marked(mark, {
            sanitize : true
        });
        return {
            __html : rawMarkup
        };
    },
    render : function() {
        var span = React.createElement('div', {
            value : mark,
            dangerouslySetInnerHTML : this.rawMarkup()
        });
        var div = React.createElement('div', {
            id : 'markup'
        }, "", span);
        return div;
    }
});

var Input = React.createClass({
    displayName : "Input",
    render : function() {
        var textarea = React.createElement(TextArea);
        var div = React.createElement('div', {
            id : 'left'
        }, "", textarea);
        return div;
    }
});

var Output = React.createClass({
    displayName : 'Output',
    render : function() {
        var out = React.createElement('div', {
            id : 'output'
        });
        var div = React.createElement('div', {
            id : 'right'
        }, "", out);
        return div;
    }
});

var Wrapper = React.createClass({
    displayName : 'Form',
    render : function() {
        var markup = React.createElement(Markup);
        var left = React.createElement(Input);
        var right = React.createElement(Output, null, "Output", markup);
        var wrapper = React.createElement("div", {
            id : 'wrapper'
        }, "", left, right);
        return wrapper;
    }
});

ReactDOM.render(React.createElement(Wrapper), document.getElementById('content'));
ReactDOM.render(React.createElement(Markup), document.getElementById('output'));

