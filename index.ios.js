'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Component,
  Navigator,
  View,
  TouchableHighlight,
  Text,
  Image,
  Animated
} = React;

var RecipesList = require('./components/RecipesList');
var FavoritesList = require('./components/FavoritesList');
var RecipeNavigationBar = require('./components/RecipeNavigationBar');
var NavigationBarRouteMapper = require('./components/NavigationBarRouteMapper');
var SideMenu = require('./components/SideMenu');

class Ricette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      translateValue: new Animated.Value(0), //init value
      scaleValue: new Animated.Value(1)      //init value
    }
  }

  toggleMenu(event) {
    var visibility = this.state.showMenu;
    this.setState({
      showMenu: !visibility,
    });
    if(!visibility) {
      Animated.parallel([
        Animated.timing(                          
          this.state.translateValue,                 
          {
            toValue: 250,                        
            duration: 275
          }),
        Animated.timing(                          
          this.state.scaleValue,                 
          {
            toValue: 0.85,                        
            duration: 275
          })
        ]).start();  
    } else {
      Animated.parallel([
        Animated.timing(                          
          this.state.translateValue,                 
          {
            toValue: 0,                        
            duration: 275
          }),
        Animated.timing(                          
          this.state.scaleValue,                 
          {
            toValue: 1,                        
            duration: 275
          })
        ]).start();  
    }
  }

  //not used function
  navigate(navigator, section) {
    //navigate={this.navigate.bind(this)}
    //console.log('navigate',navigator, section);
    //console.log(navigator, section);
    this.toggleMenu();
    navigator.push({ title: 'Lista della spesa', component: FavoritesList, data: {} });
  }

  render() {
    return (
      <Navigator 
        initialRoute= {{title: 'ROVAGNATI - Ricette Firmate', section: 'home', component: RecipesList }}
        renderScene= {(route, navigator) => {
          if (route.component) {
            return (
              <View style={styles.container}>
                <SideMenu navigator={navigator} toggleMenu={this.toggleMenu.bind(this)} />
                <Animated.View style={[
                    styles.container, 
                    { transform: [{translateX: this.state.translateValue}, {scale: this.state.scaleValue}]}
                  ]}>
                  { React.createElement(route.component, { route, navigator }) }
                  <RecipeNavigationBar 
                    navigator={navigator} 
                    title={route.title} 
                    section={route.section} 
                    toggleMenu={this.toggleMenu.bind(this)} />
                </Animated.View>
              </View>
            );
          }
        }} />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  navBar: {
    backgroundColor: '#c8201f',
  },
  buttonText: {
    color: '#000',
    padding: 10,
    fontSize: 25,
  },
});

AppRegistry.registerComponent('Ricette', () => Ricette);
