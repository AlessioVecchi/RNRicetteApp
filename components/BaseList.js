'use strict';

var React = require('react-native');
var {
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Component,
} = React;

var RecipeSingle = require('./RecipeSingle');
var { filter, find } = require('lodash');

class BaseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.recipesSource),
      loaded: true,
    });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRecipe.bind(this)}
        automaticallyAdjustContentInsets={false}
        renderFooter={()=><View style={{height: 80,}}></View>}
        style={styles.listView} />
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  goToRecipe(recipeId) {
    this.props.navigator.push({
      data: {
        Key: 'RecipeID',
        Value: recipeId,
      },
      section: 'recipe-single',
      component: RecipeSingle,
    });
  }
  
  renderRecipe(recipe) {
    var iconBrand = '';
    if(recipe.ProductType === 'mondosnello') {
      iconBrand = require('image!snello_ico');
    } else {
      iconBrand = require('image!rovagnati_ico');
    }
   
    return (
      <TouchableHighlight style={[styles.itemWrap, styles.mTop20]}
          onPress={() => this.goToRecipe(recipe.ID)}
          underlayColor="transparent">
        <View style={styles.itemWrap}>
          <View style={styles.imgWrap}>
            <Image source={{uri: recipe.ImageUrl}}
              style={styles.img} />
            <Image source={iconBrand} style={styles.iconBrand} />
          </View>
          
          <View style={styles.imgFilter}>
            <Image source={require('image!img_filter_btm')} />
          </View>
          <Text style={styles.title}>{recipe.Title}</Text>
        </View>
      </TouchableHighlight>
      
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',

  },
  listView: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  year: {
    textAlign: 'center',
  },
  mTop20: {
    marginTop: 20,
  },
  itemWrap: {
    flex: 1,
    margin: 0,
    height: 250,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBrand: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'transparent',
  },
  imgWrap: {
    flex: 1,
    height: 250,
  },
  img: {
    flex: 1,
  },
  imgFilter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 5,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});

module.exports = BaseList;