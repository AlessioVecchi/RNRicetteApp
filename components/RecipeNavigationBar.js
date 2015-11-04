'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Component,
  PixelRatio,
  Dimensions
} = React;

var RecipesFilter = require('./RecipesFilter');
var RecipeButtons = require('./RecipeButtons');
var Sections = require('../constants/AppSections');

class LeftButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //Home Page
    if (this.props.section === Sections.HOME) {
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
    //other page display back button
    return (  
      <TouchableHighlight
        onPress={() => this.props.navigator.pop()}
        underlayColor="transparent"
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
      case Sections.HOME:
      return (
        <TouchableHighlight style={[styles.navBarWrap, styles.rightButton]}
          underlayColor="transparent"
          onPress={() => this.props.navigator.push({ title: 'Filtra Ricette', section: Sections.FILTERS, component: RecipesFilter })}>
          <Image
            style={styles.icon}
            source={require('image!ico_filter')}
          />
        </TouchableHighlight>
      );
      break;
      case Sections.RECIPE:
        var routes = this.props.navigator.getCurrentRoutes();
        var routeId;
        if(routes.length > 0) {
          var route = routes[routes.length -1];
          routeId = route.data.Value;  
        } 
        return <RecipeButtons recipeId={routeId} />;
      break;
      case 'ProductID':
      case 'RecipeTypeKey':
      default:
        // RecipesFilter
        return ( <Text style={[styles.navBarWrap, styles.rightButton]} />);
      break;
    }  
  }
}

class RecipeNavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  //componentWillReceiveProps(nextProps) {
  //this.props.navigator.push({ title: 'Lista della spesa', component: '', data: {} })
  //console.log(nextProps);
  //}

  render() {
    var recipeSingle = false;
    if(this.props.section === Sections.RECIPE) {
      recipeSingle = true;
    }
    return (
      <View style={[styles.navbar, recipeSingle && styles.navbarSingle]}> 
        <LeftButton navigator={this.props.navigator} section={this.props.section} toggleMenu={this.props.toggleMenu} />
        <View style={styles.navBarWrap}>
          <Text style={styles.navBarText}>{this.props.title}</Text>
        </View>
        <RightButton navigator={this.props.navigator} section={this.props.section} />
      </View>
    );
  }
}

var SCREEN_WIDTH = Dimensions.get('window').width;

var styles = StyleSheet.create({
  navbar: {  
    backgroundColor: '#c8201f',
    height: 64,
    // paddingTop: 14,
    position: 'absolute',
    top:0,
    left:0,
    right:0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbarSingle: {
    // backgroundColor: 'transparent',
  },
  navBarText: {
    color: '#fff',
    fontSize: 21,
    width: SCREEN_WIDTH - 100,
    textAlign: 'center',
  },
  icon: {
    margin: 5,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  iconMenu: {
    marginLeft: 0,
  },
  leftButton: {
    width: 50,
    alignItems: 'flex-start',
  },
  rightButton: {
    width: 50,
    alignItems: 'flex-end',
  }
});

module.exports = RecipeNavigationBar;
