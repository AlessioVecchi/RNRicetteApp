'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  View
} = React;

var RecipesFilter = require('./RecipesFilter');
var MenuLateral = require('./MenuLateral');


var FavoriteActions = require('./../actions/FavoriteActions');
var FavoriteStore = require('./../stores/FavoriteStore');
var ResourceKeys = require('../constants/ResourceKeys');

class RecipeButtons extends React.Component {
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.state = {
      isFavorite: false
    }
  }
  componentWillUnmount() {
    FavoriteStore.removeChangeListener(this.changeListener);
  }

  componentDidMount() {
    this.changeListener = this.reloadFavorite.bind(this);
    FavoriteStore.addChangeListener(this.changeListener);
    this.reloadFavorite();
  }

  reloadFavorite() {
    FavoriteStore.getById(this.props.recipeId).then((isFavorite)=> {
      this.setState({ isFavorite: isFavorite });
    });
  }

  addFavorite() {
    if(!this.state.isFavorite) {
      FavoriteActions.addFavorite(this.props.recipeId);
    } else {
      FavoriteActions.removeFavorite(this.props.recipeId);
    }
  }
  render() {
    var icon = this.state.isFavorite ? require('image!ico_menu_heart') : require('image!ico_heart');
    return (
      <TouchableHighlight onPress={this.addFavorite.bind(this)}>
        <Image source={ icon }></Image>
      </TouchableHighlight>
    );
  }
}

var NavigationBarRouteMapper = {

  LeftButton: function (route, navigator, index, navState) {
  	//Home Page
    if (index === 0) {
    	return (
  			<TouchableHighlight style={styles.navBarWrap}
          underlayColor="transparent"
          onPress={() => navigator.push({ title:'Menu', component: MenuLateral })}>
          <Image
            style={[styles.icon, styles.iconMenu]}
            source={require('image!ico_menu')}
          />
  			</TouchableHighlight>
    	);
    }

    var previousRoute = navState.routeStack[index - 1];
    return (	
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarWrap}>
        <Image
          style={styles.icon}
          source={require('image!ico_back')}
        />
      </TouchableOpacity>
    );
  },

  RightButton: function (route, navigator, index, navState) {

    //console.log('route: ', route, navState);
    if (route.data) {
      switch(route.data.Key) {
        case 'RecipeID':
          return <RecipeButtons recipeId={route.data.Value} />;
        break;
        case 'ProductID':
        case 'RecipeTypeKey':
        default:
          // RecipesFilter
        break;
      }
    }
    


    //Home Page
    if (index === 0) {
    	return (
  			<TouchableHighlight style={styles.navBarWrap}
          underlayColor="transparent"
  				onPress={() => navigator.push({ title:'Filtra Ricette', component: RecipesFilter })}>
  				<Image
            style={styles.icon}
            source={require('image!ico_filter')}
          />
  			</TouchableHighlight>
    	);
    }
    // return (
    //   <TouchableOpacity
    //     onPress={() => navigator.push(newRandomRoute())}
    //     style={styles.navBarWrap}>
    //     <Text style={styles.navBarText}>
    //       Next
    //     </Text>
    //   </TouchableOpacity>
    // );
  },

  Title :  function (route, navigator, index, navState) {
    return (
      <View style={styles.navBarWrap}>
        <Text style={styles.navBarText}>
          {route.title}
        </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  navBarWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  navBarText: {
    color: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  iconMenu: {
    marginLeft: 0,
  }
});

module.exports = NavigationBarRouteMapper;