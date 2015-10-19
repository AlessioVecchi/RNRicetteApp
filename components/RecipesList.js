'use strict';

var React = require('react-native');
var {
  Component,
} = React;

var ResourceKeys = require('../constants/ResourceKeys');
var { getData } = require('../services/DataService');
var RecipeSingle = require('./RecipeSingle');
var List = require('./List');
var { filter, find } = require('lodash');

class RecipesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    getData(ResourceKeys.recipes).then((responseData) => {
      var recipeData = responseData;
      if(this.props.route.data) {
        console.log(this.props.route.data.Key);
        var dataFilter = this.props.route.data;
        recipeData = filter(responseData, (item) => {
          return item[dataFilter.Key] == dataFilter.Value;
        });
      } 

      this.setState({
        dataSource: recipeData,
      });

    });
  }

  render() {
    return (
      <List
        recipesSource={this.state.dataSource}
        navigator={this.props.navigator} />
    );
  }

}

module.exports = RecipesList;