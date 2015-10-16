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

class MenuLateral extends Component {
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
        onPress={()=> this.props.navigator.popToTop()}>
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
        onPress={()=> this.props.navigator.push({ title: 'Ricette Snello', component: RecipesList, data: {Key: 'ProductType', Value: 'mondosnello',} })}>
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
        onPress={()=> this.props.navigator.push({ title: 'Ricette Rovagnati', component: RecipesList, data: {Key: 'ProductType', Value: 'rovagnati',} })}>
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
        onPress={()=> this.props.navigator.push({ title: 'Preferiti', component: '', data: {} })}>
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
        onPress={()=> this.props.navigator.push({ title: 'Lista della spesa', component: '', data: {} })}>
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
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
  },
  logoImg: {
    height: 47,
    width: 155,
  },
  imgWrap: {
    width: 30,
    marginRight: 15,
  },
  icon: {
    flex: 1,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    padding: 5,
    fontSize: 17,
  },
  buttonText: {
    color: '#fff',
    padding: 10,
    fontSize: 25,
  },
});
module.exports = MenuLateral;