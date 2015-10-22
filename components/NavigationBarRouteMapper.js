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
var SideMenu = require('./SideMenu');
var RecipeButtons = require('./RecipeButtons');

var NavigationBarRouteMapper = {

  LeftButton: function (route, navigator, index, navState) {
  	//Home Page
    if (index === 0) {
    	return (
  			<TouchableHighlight style={styles.navBarWrap}
          underlayColor="transparent"
          onPress={() => navigator.push({ title:'Menu', component: SideMenu })}>
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
    resizeMode: 'contain',
  },
  iconMenu: {
    marginLeft: 0,
  }
});

module.exports = NavigationBarRouteMapper;