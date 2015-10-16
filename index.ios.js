/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Component,
  Navigator,
} = React;

var RecipesList = require('./components/RecipesList');
var NavigationBarRouteMapper = require('./components/NavigationBarRouteMapper');

class Ricette extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Navigator 
        initialRoute= {{title: 'ROVAGNATI - Ricette Firmate', component: RecipesList}}
        renderScene= {(route, navigator) => {
            // console.log("renderScene", route, navigator); 
            if (route.component) {
                return React.createElement(route.component, { navigator, route });
            }
          }
        }
        navigationBar={
          <Navigator.NavigationBar
              routeMapper={NavigationBarRouteMapper}
              style={styles.navBar}
            />
        }
      />
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: '#c8201f',
  },
});

AppRegistry.registerComponent('Ricette', () => Ricette);
