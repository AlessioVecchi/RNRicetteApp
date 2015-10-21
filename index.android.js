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
var MenuLateral = require('./components/MenuLateral');

class Ricette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      translateValue: new Animated.Value(0),
      scaleValue: new Animated.Value(1)
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
            duration: 700
          }),
        Animated.timing(                          
          this.state.scaleValue,                 
          {
            toValue: 0.85,                        
            duration: 700
          })
        ]).start();  
    } else {
      Animated.parallel([
        Animated.timing(                          
          this.state.translateValue,                 
          {
            toValue: 0,                        
            duration: 700
          }),
        Animated.timing(                          
          this.state.scaleValue,                 
          {
            toValue: 1,                        
            duration: 700
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
    navigator.push({ title: 'Lista della spesa', component: FavoritesList, data: {} })
  }

  render() {
    return (
      <Navigator 
        initialRoute= {{title: 'ROVAGNATI - Ricette Firmate', section: 'home', component: RecipesList }}
        renderScene= {(route, navigator) => {
          if (route.component) {
            return (
              <View style={styles.container}>
                <MenuLateral navigator={navigator} toggleMenu={this.toggleMenu.bind(this)} />
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

  // render() {
  //   return (
  //     <Navigator 
  //       initialRoute= {{title: 'ROVAGNATI - Ricette Firmate', component: RecipesList}}
  //       renderScene= {(route, navigator) => {
  //           // console.log("renderScene", route, navigator); 
  //           if (route.component) {
  //               return React.createElement(route.component, { navigator, route });
  //           }
  //         }
  //       }
  //       navigationBar={
  //         <Navigator.NavigationBar
  //             routeMapper={NavigationBarRouteMapper}
  //             style={styles.navBar}
  //           />
  //       }
  //     />
  //   );
  // }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#c8201f',
  },
  
   buttonText: {
    color: '#000',
    padding: 10,
    fontSize: 25,
  },
  // toggled: {
  //   transform: [{translateX: 280}],
  // }
});

AppRegistry.registerComponent('Ricette', () => Ricette);
