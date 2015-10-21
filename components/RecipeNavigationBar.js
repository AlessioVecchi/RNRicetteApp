'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Component,
} = React;

var RecipesFilter = require('./RecipesFilter');
var RecipeButtons = require('./RecipeButtons');

class LeftButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //Home Page
    if (this.props.section === 'home') {
      return (
        <TouchableHighlight style={[styles.navBarWrap, styles.leftButton]}
          underlayColor="transparent"
          onPress={this.props.toggleMenu}>
          <Image
            style={[styles.icon, styles.iconMenu]}
            source={require('image!ico_menu')}
          />
        </TouchableHighlight>
      );
    }

    return (  
      <TouchableHighlight
        onPress={() => this.props.navigator.pop()}
        style={[styles.navBarWrap, styles.leftButton]}>
        <Image
          style={styles.icon}
          source={require('image!ico_back')}
        />
      </TouchableHighlight>
    );
  }
}

class RightButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {

      
      switch(this.props.section) {
        case 'home':
        return (
          <TouchableHighlight style={[styles.navBarWrap, styles.rightButton]}
            underlayColor="transparent"
            onPress={() => this.props.navigator.push({ title:'Filtra Ricette', section: 'filter', component: RecipesFilter })}>
            <Image
              style={styles.icon}
              source={require('image!ico_filter')}
            />
          </TouchableHighlight>
        );
        break;
        case 'recipe-single':
          var routes = this.props.navigator.getCurrentRoutes();
          var route = routes[routes.length -1];
          //console.log('route', route.data.Value);
          return <RecipeButtons recipeId={route.data.Value} />;
        break;
        case 'ProductID':
        case 'RecipeTypeKey':
        default:
          // RecipesFilter
          return ( <Text />);
        break;
      }  
  }
}


class RecipeNavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    //this.props.navigator.push({ title: 'Lista della spesa', component: '', data: {} })
    //console.log(nextProps);
  }

  render() {
    return (
      <View style={styles.navbar}> 
        <LeftButton navigator={this.props.navigator} section={this.props.section} toggleMenu={this.props.toggleMenu} />
        <View style={styles.navBarWrap}>
          <Text style={styles.navBarText}>{this.props.title}</Text>
        </View>
        <RightButton navigator={this.props.navigator} section={this.props.section} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  navbar: {  
    backgroundColor: '#c8201f',
    height: 64,
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  },
  leftButton: {
    position: 'absolute',
    top: 13,
    left: 0,
  },
  rightButton: {
    position: 'absolute',
    top: 13,
    right: 0,
  }
});

module.exports = RecipeNavigationBar;