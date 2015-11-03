'use strict';

var React = require('react-native');
var {
  Component,
} = React;

//var ResourceKeys = require('../constants/ResourceKeys');
//var DataService = require('../services/DataService');
var RecipeStore = require('../stores/RecipeStore');
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
    console.log('component mount');
    //DataService.getData(ResourceKeys.recipes)

    RecipeStore.getByFilter(this.props.route.data)
      .then((recipes) => {
        this.setState({
          dataSource: recipes,
        });
      }, (err) => {
        console.log("reject", err)
      })
      .catch((err)=> console.log("catch", err));

    RecipeStore.getAll()
      .then((responseData) => {
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
        
      }, (err) => {
        console.log("reject", err)
      })
      .catch((err)=> console.log("catch", err));
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
