'use strict';

var React = require('react-native');
var {
  Component,
} = React;

var RecipeStore = require('../stores/RecipeStore');
var RecipeSingle = require('./RecipeSingle');
var BaseList = require('./BaseList');
var { filter, find } = require('lodash');

class RecipesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    RecipeStore.getByFilter(this.props.route.data)
      .then((recipes) => {
        this.setState({
          dataSource: recipes,
        });
      }, (err) => {
        console.log("reject", err)
      })
      .catch((err) => console.log("catch", err));
  }

  render() {
    return (
      <BaseList
        recipesSource={this.state.dataSource}
        navigator={this.props.navigator} />
    );
  }

}

module.exports = RecipesList;
