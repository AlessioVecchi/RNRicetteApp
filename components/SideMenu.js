'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  WebView,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
  Component,
} = React;

var RecipesList = require('./RecipesList');
var FavoritesList = require('./FavoritesList');
var BasketList = require('./BasketList');

class SideMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImg}
            source={require('image!logo')}
          />
          <Text style={styles.title}>Ricette Rovagnati</Text>
        </View>
        <TouchableHighlight 
        underlayColor={colors.red}
        onPress={()=> {
          this.props.toggleMenu();
          this.props.navigator.popToTop()}
        }>
          <View style={styles.menuItem}>
            <View style={styles.imgWrap}>
              <Image
                style={styles.icon}
                source={require('image!ico_menu_all')}
              />
            </View>
            <Text style={styles.buttonText}>Tutte le ricette</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
        underlayColor={colors.red}
        onPress={()=> {
            this.props.toggleMenu();
            this.props.navigator.push({ title: 'Ricette Snello', component: RecipesList, data: {Key: 'ProductType', Value: 'mondosnello',} });
          }
        }> 
          <View style={styles.menuItem}>
            <View style={styles.imgWrap}>
              <Image
                style={styles.icon}
                source={require('image!ico_menu_snello')}
              />
            </View>
            <Text style={styles.buttonText}>Ricette Snello</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
        underlayColor={colors.red}
        onPress={()=> {
            this.props.toggleMenu();
            this.props.navigator.push({ title: 'Ricette Rovagnati', component: RecipesList, data: {Key: 'ProductType', Value: 'rovagnati',} });
          }
        }>
          <View style={styles.menuItem}>
            <View style={styles.imgWrap}>
              <Image
                style={styles.icon}
                source={require('image!ico_menu_rovagnati')}
              />
            </View>
            <Text style={styles.buttonText}>Ricette Rovagnati</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
        underlayColor={colors.red}
        onPress={()=> {
            this.props.toggleMenu();
            this.props.navigator.push({ title: 'Preferiti', component: FavoritesList, data: {Key: 'Favorites', Value: 'Favorites'}});
          }
        }>
          <View style={styles.menuItem}>
            <View style={styles.imgWrap}>
              <Image
                style={styles.icon}
                source={require('image!ico_menu_heart')}
              />
            </View>
            <Text style={styles.buttonText}>Preferiti</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight 
        underlayColor={colors.red}
        onPress={()=> {
            this.props.toggleMenu();
            this.props.navigator.push({ title: 'Lista della spesa', component: BasketList, data: {Key: 'Basket', Value: 'Basket'}});
          }
        }>
          <View style={styles.menuItem}>
            <View style={styles.imgWrap}>
              <Image
                style={styles.icon}
                source={require('image!ico_menu_basket')}
              />
            </View>
            <Text style={styles.buttonText}>Lista della spesa</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
  
};
var colors = {
  red: '#930c10',
}
var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.red,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    left: 20,
    right: 100,
    top: 30,
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  logoImg: {
    height: 47,
    width: 155,
  },
  imgWrap: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    padding: 5,
    fontSize: 17,
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    lineHeight: 40,
  },
});
module.exports = SideMenu;