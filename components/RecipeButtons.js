'use strict';

var React = require('react-native');
var FavoriteActions = require('./../actions/FavoriteActions');
var FavoriteStore = require('./../stores/FavoriteStore');
var BasketActions = require('../actions/BasketActions');
var BasketStore = require('./../stores/BasketStore');

var {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
} = React;

class RecipeButtons extends React.Component {
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.basketListener = null;
    this.state = {
      isFavorite: false
    }
  }
  
  componentWillUnmount() {
    FavoriteStore.removeChangeListener(this.changeListener);
    BasketStore.removeChangeListener(this.changeListener);
  }

  componentDidMount() {
    this.changeListener = this.reloadFavorite.bind(this);
    this.basketListener = this.basketChanged.bind(this);
    FavoriteStore.addChangeListener(this.changeListener);
    BasketStore.addChangeListener(this.changeListener);
    this.reloadFavorite();
  }

  reloadFavorite() {
    FavoriteStore.getById(this.props.recipeId).then((isFavorite)=> {
      this.setState({ isFavorite: isFavorite });
    });
  }
  basketChanged() {
    BasketStore.getAll().then((ingredients) => {
      console.log('basket changed', ingredients);
    });   
  }

  addFavorite() {
    if(!this.state.isFavorite) {
      FavoriteActions.addFavorite(this.props.recipeId);
    } else {
      FavoriteActions.removeFavorite(this.props.recipeId);
    }
  }
  addIngredients() {
    BasketActions.addIngredients(this.props.recipeId);
  }
  render() {
    var icon = this.state.isFavorite ? require('image!ico_menu_heart') : require('image!ico_heart');
    return (
      <View style={ [styles.container, styles.rightButton]}>
        <TouchableHighlight 
          underlayColor="transparent"
          onPress={this.addIngredients.bind(this)}>
          <Image source={ require('image!ico_basket') } style={styles.icon}></Image>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.addFavorite.bind(this)}
          underlayColor="transparent">
          <Image source={ icon } style={styles.icon}></Image>
        </TouchableHighlight>
        <TouchableHighlight 
          underlayColor="transparent">
          <Image source={ require('image!ico_sharing') } style={styles.icon}></Image>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  icon: {
    width: 30,
    height: 30,
    margin: 5,
    resizeMode: 'contain',
  },
});


module.exports = RecipeButtons;