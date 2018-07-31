/*
  Build a Recipe Box

    Objective: Build a CodePen.io app that is functionally similar to this:
               https://codepen.io/FreeCodeCamp/full/xVXWag/.
    Rule #1: Don't look at the example project's code. Figure it out for yourself.
    Rule #2: Fulfill the below user stories. Use whichever libraries or
             APIs you need. Give it your own personal style.
    Rule #3: You must use both Sass and React to build this project.
    User Story: I can create recipes that have names and ingredients.
    User Story: I can see an index view where the names of all the recipes are visible.
    User Story: I can click into any of those recipes to view it.
    User Story: I can edit these recipes.
    User Story: I can delete these recipes.
    User Story: All new recipes I add are saved in my browser's local storage.
             If I refresh the page, these recipes will still be there.

    Hint:  You should prefix your local storage keys on CodePen, i.e. _username_recipes
    Remember to use Read-Search-Ask if you get stuck.
    When you are finished, click the "I've completed this challenge" button and include a link to your CodePen.
    You can get feedback on your project from fellow campers by sharing it
     in our Code Review Chatroom.
     You can also share it on Twitter and your city's Campsite (on Facebook).
*/

// console.log('loading...');
var prefix = "_recipe_box_id_";
var Main = React.createClass({
  displayName: "Main",
  getInitialState: function() {
    // for development
    // localStorage.clear();
    // check if already init
    if (!localStorage.getItem(0) == true) {
      localStorage.setItem(0, true);
      this.props.data.forEach(function(item) {
        localStorage.setItem(prefix + item.id, JSON.stringify(item.recipe));
      });
    }
    // console.log('main init getLocalStorage()');
    var recipes = this.getLocalStorage();
    // console.log(recipes);
    return {
      data: recipes,
      id: 0,
      name: '',
      value: '',
      action: ''
    };

  },
  setLocalStorage: function(storage) {
    localStorage.clear();
    localStorage.setItem(0, true);
    storage.forEach(function(item, id) {
      id += 1;
      localStorage.setItem(prefix + id, JSON.stringify(item.recipe));
    });
  },
  getLocalStorage: function() {
    var id,
      recipe,
      recipes = [],
      i,
      len = localStorage.length;
    for (i = 0; i < len; i++) {
      id = i;
      if (id !== 0) {
        recipe = localStorage.getItem(prefix + id);
        recipe = JSON.parse(recipe);
        recipes.push({
          id: id,
          recipe: {
            name: recipe.name,
            list: recipe.list
          }
        });
      }
    }
    return recipes;
  },
  addRecipe: function(name, items) {
    var isLooping = true;
    var count = 1;
    var id = localStorage.length;
    if (name === '') {
      name = 'Untitled';
    }
    if (items === '') {
      items = 'Unknown';
    }
    var names = [];
    for (var i = 0; i < id - 1; i++) {
      names.push(this.state.data[i].recipe.name);
    }
    while (isLooping) {
      if (names.indexOf(name) === -1) {
        //unique name
        break;
      } else if (names.indexOf(name + count) === -1) {
        // add number to name
        name += count;
        break;
      }
      // make sure we don't go into a endless loop
      count === 10 ? isLooping = false : isLooping = true;
      count++;
    }
    var list = items.split(',');
    var myObj = {
      id: id,
      recipe: {
        name: name,
        list: list
      }
    };
    var myData = this.state.data;
    myData.push(myObj);
    this.setLocalStorage(myData);
    this.setState({
      data: myData,
      action: ''
    });
  },
  editRecipe: function(id, name, list) {
    if (list === undefined) {
      var recipe = JSON.parse(localStorage.getItem(prefix + id));
      this.setState({
        id: id,
        name: recipe.name,
        value: recipe.list,
        action: 'edit'
      });
    } else {
      var myObj = {
        id: id,
        recipe: {
          name: name,
          list: list.split(',')
        }
      };
      localStorage.setItem(prefix + myObj.id, JSON.stringify(myObj.recipe));
      var newlist = this.getLocalStorage();
      // console.log('done editing...');
      this.setState({
        data: newlist,
        name: '',
        value: '',
        action: ''
      });

    }
  },
  delRecipe: function(item) {
    // console.log(item);
    var currentData = this.state.data;
    var pos = item - 1;
    var removed = currentData.splice(pos, 1);
    this.setLocalStorage(currentData);
    currentData = this.getLocalStorage();
    this.setState({
      data: currentData
    });

  },
  handleAdd: function() {
    this.setState({
      action: 'add'
    });
  },
  handleCancel: function() {
    this.setState({
      name: '',
      value: '',
      action: ''
    });
  },
  componentDidMount: function() {
    $('.item-list').hide();
  },
  render: function() {
    // console.log(this.state);
    if (this.state.action === '') {
      var myForm = null;
      setModal('show');
    } else {
      var myForm = <Forms id={this.state.id} name={this.state.name} value={this.state.value} action={this.state.action} doAdd={this.addRecipe} doEdit={this.editRecipe} doCancel={this.handleCancel}/>
      setModal('hide');
    };
    return (
      <div className='container'>
          {/* <header className='text-center'><h1>Recipe Box</h1></header> */}
          <button onClick={this.handleAdd}>Add</button>
          <ListItems data={this.state.data} doEdit={this.editRecipe} doDelete={this.delRecipe}/>
          {/* <div className="footer text-center">&copy; Copyright MMXVI by J. Steve Martinez </div> */}
          {myForm}
        </div>
    );
  }
});

var ListItems = React.createClass({
  displayName: 'ListItems',
  handleClick: function(e) {
    var theObj = splitIt(e.target.id);
    switch (theObj.type) {
      case 'link':
        setDisplay(theObj.id)
        break;
      case 'edit':
        // console.log('do edit');
        // console.log(theObj);
        this.props.doEdit(theObj.id);
        break;
      case 'del':
        // console.log('del item');
        // console.log(theObj);
        this.props.doDelete(theObj.id);
        break;
    }
  },
  render: function() {
    var items = this.props.data.map(function(item, index) {
      var edit = 'edit-' + item.id;
      var del = 'del-' + item.id;
      var show = 'show-' + item.id;
      var link = 'link-' + item.id;
      return (
        <div className='recipe' key={index}>
          <div id={link} className='item-link' onClick={this}>{item.recipe.name}</div>
          <div id={show} className='item-list'>
            <Recipe list={item.recipe.list} />
            <button id={edit} className='edit' onClick={this}>Edit</button>
            <button id={del}  className='del' onClick={this}>Delete</button>
          </div>
        </div>
      );
    }, this.handleClick);
    return (
      <div className='recipes'>{items}</div>
    );
  }
});

var Recipe = React.createClass({
  displayName: 'Recipe',
  render: function() {
    var list = this.props.list.map(function(item, key) {
      return (
        <div className='recipe-item' key={key}>{item}</div>
      )
    });
    return (
      <div className='recipe-list' >
      <h5>{list}</h5>
    </div>)
  }
});

var FormComp = React.createClass({
  displayName: 'form',
  render: function() {
    return (
      <form ref='form' className='form'>
        <div className='form-header'>Recipe</div>
        <div id="insturctions">Use comma seperated list for ingredients</div>
        {this.props.children}
    </form>)
  }
});
FormComp.Label = React.createClass({
  displayName: 'form.label',
  render: function() {
    return <div className='form-label'>{this.props.label}</div>
  },
});
FormComp.Input = React.createClass({
  displayName: 'form.input',
  render: function() {
    return <input type={this.props.type} className='form-name' ref='name' defaultValue={this.props.value}/>
  },
});
FormComp.TextArea = React.createClass({
  displayName: 'form.testarea',
  render: function() {
    return (<textarea className='form-value' defaultValue={this.props.defaultTextArea} ref='value'/>)
  },
});
FormComp.Button = React.createClass({
  displayName: 'form.button',
  render: function() {
    // // console.log(this.props);
    return <button className={this.props.button} id={this.props.id} type='button' onClick={this.props.handler}>{this.props.button}</button>
  },
});
var Forms = React.createClass({
  add: function(e) {
    this.props.doAdd($('.form-name').val(), $('.form-value').val());
  },
  save: function(e) {
    // console.log('save item');
    this.props.doEdit(e.target.id, $('.form-name').val(), $('.form-value').val());
  },
  cancel: function(e) {
    // console.log('cancel item');
    this.props.doCancel();
  },
  render: function() {
    // console.log('render form');
    // console.log(this);
    var Form = FormComp;
    if (this.props.action === 'edit') {
      var buttons = (
        <div className='form-footer'>
          <Form.Button id={this.props.id} button='Save' handler={this.save}/>
          <Form.Button button='Cancel' handler={this.cancel}/>
        </div>
      );
    } else if (this.props.action === 'add') {
      var buttons = (
        <div className='form-footer'>
          <Form.Button button='Save' handler={this.add}/>
          <Form.Button button='Cancel' handler={this.cancel}/>
        </div>
      );
    };
    var Editor = (
      <Form>
        <Form.Label label='Name' />
        <Form.Input ref='name' type='text' value={this.props.name}/>
        <Form.Label label='Ingredients' />
        <Form.TextArea ref='value' defaultTextArea={this.props.value} />
        <Form.Label label='' />
        {buttons}
      </Form>
    );
    return (
      <div className='modal-content'>
            {Editor}
      </div>
    )
  }
});

function splitIt(item) {
  var arr = item.split('-');
  var myObj = {
    type: arr[0],
    id: arr[1]
  };
  return myObj;
};

function setDisplay(id) {
  var list = $('.item-list');
  var len = list.length;
  var show = '#show-' + id;
  $(show).toggle();
  for (var i = 0; i < len; i++) {
    var current = '#' + list[i].id;
    if (show != current) {
      $(current).hide();
    };
  };
};

function setModal(it) {
  if (it === 'show') {
    $('header').show();
    $('.recipes').show();
    $('.footer').show();
  } else {
    $('header').hide();
    $('.recipes').hide();
    $('.footer').hide();
  }
}

// Initial Recipes
var data = [{
  id: 1,
  recipe: {
    name: 'Pizza',
    list: ['crust', 'cheese', 'sauce', 'veggies']
  }
}, {
  id: 2,
  recipe: {
    name: 'Pancakes',
    list: ['flower', 'water', 'eggs']
  }
}, {
  id: 3,
  recipe: {
    name: 'Scrambled Eggs',
    list: ['2 eggs', 'salt', 'pepper', 'oil']
  }
}];

ReactDOM.render(React.createElement(Main, {
  data: data
}), document.getElementById("recipe-box"));
// console.log('end');