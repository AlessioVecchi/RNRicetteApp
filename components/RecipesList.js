'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Component,
} = React;

var ResourceKeys = require('../constants/ResourceKeys');
var { getData } = require('../services/DataService');
var RecipeSingle = require('./RecipeSingle');
var FavoriteStore = require('./../stores/FavoriteStore');
var { filter, find } = require('lodash');

class RecipesList extends Component {
  constructor(props) {
    super(props);
    //this.changeListener = null;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    }
  } 

  componentWillUnmount() {
    //FavoriteStore.removeChangeListener(this.changeListener);
  }
  
  componentDidMount() {
    console.log('componentDidMount');

    //this.changeListener = this.reloadFavorite.bind(this);
    //FavoriteStore.addChangeListener(this.changeListener);

    getData(ResourceKeys.recipes).then((responseData)=> {
      if(this.props.route.data) {
        console.log(this.props.route.data.Key);
        switch(this.props.route.data.Key) {
          case 'Favorites':
           this.reloadFavorite(responseData);
          break;
          default:
            var dataFilter = this.props.route.data;
            responseData = filter(responseData, (item) => {
              return item[dataFilter.Key] == dataFilter.Value;
            });
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(responseData),
              loaded: true,
            });
            break;
        }
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
        });
      }
    });
  }

  reloadFavorite(responseData) {
    console.log('reloadFavorite');
    FavoriteStore.getAll().then((favorites) => {
      var favoritesRecipes = [];
      favorites.forEach((item, index) => {    
        favoritesRecipes.push(find(responseData, { ID: item.id }));
      });
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(favoritesRecipes),
        loaded: true,
      });
    });
  }


  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRecipe.bind(this)}
        style={styles.listView} />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  goToRecipe(recipeId) {
    // console.log(this);
    this.props.navigator.push({
      data: {
        Key: 'RecipeID',
        Value: recipeId,
      },
      component: RecipeSingle,
    });
  }
  
  renderRecipe(recipe) {
    return (
      <TouchableHighlight style={styles.itemWrap}
          onPress={() => this.goToRecipe(recipe.ID)}
          underlayColor="transparent">
        <View style={styles.itemWrap}>
          <View style={styles.imgWrap}>
            <Image source={{uri: recipe.ImageUrl}}
              style={styles.img} />
          </View>
          <View style={styles.imgFilter}>
            <Image source={require('image!img_filter_btm')} />

          </View>
          <Text style={styles.title}>{recipe.Title}</Text>
        </View>
      </TouchableHighlight>
      
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',

  },
  listView: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  year: {
    textAlign: 'center',
  },
  itemWrap: {
    flex: 1,
    margin: 0,
    marginTop: 20,
    height: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imgWrap: {
    flex: 1,
    height: 250,
  },
  img: {
    flex: 1,
  },
  imgFilter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

module.exports = RecipesList;