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

var NavigationBarRouteMapper = {

  LeftButton: function (route, navigator, index, navState) {
  	console.log()
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