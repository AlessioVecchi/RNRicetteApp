'use strict';

var React = require('react-native');
var {
  Component,
} = React;

var ResourceKeys = require('../constants/ResourceKeys');
// var { getData } = require('../services/DataService');
var DataService = require('../services/DataService');
var RecipeSingle = require('./RecipeSingle');
var BaseList = require('./BaseList');
var { filter, find } = require('lodash');

var Dimensions = require('Dimensions');
var PixelRatio = require('PixelRatio');

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;

class RecipesList extends Component {
  constructor(props) {
    super(props);
    //console.log(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    DataService.getData(ResourceKeys.recipes).then((responseData) => {
      var recipeData = responseData;
      if(this.props.route.data) {
        //console.log(this.props.route.data.Key);
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
      <BaseList
        recipesSource={this.state.dataSource}
        navigator={this.props.navigator} />
    );
  }

}

module.exports = RecipesList;