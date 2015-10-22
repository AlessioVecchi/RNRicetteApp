'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Component,
} = React;

var ResourceKeys = require('../constants/ResourceKeys');
var DataService = require('../services/DataService');
var RecipesList = require('./RecipesList');
var TabNavigation = require('./TabNavigation');

class RecipesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      tabs: [
        {
          id: 0,
          text: 'Portata',
          resourceKey: ResourceKeys.recipestypes,
          selected: true,
        },
        {
          id: 1,
          text: 'Prodotti',
          resourceKey: ResourceKeys.products,
          selected: false,
        }
      ],
      selectedTab: ResourceKeys.recipestypes,
      loaded: false,
    }
  }
  
  componentDidMount() {
    this.fetchData(ResourceKeys.recipestypes);
  }
  
  fetchData(resourceKey) {
    DataService.getData(resourceKey).then((responseData)=> {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        loaded: true,
        selectedTab: resourceKey,
      });
    });
  }

  selectTab(tabId) {
    var tabArray = this.state.tabs
    tabArray.forEach((el) => {
      if(el.id === tabId) {
        el.selected = true;
        this.fetchData(el.resourceKey);
      } else {
        el.selected = false;
      }
    });
    this.setState({
      tabs: tabArray,
    })
  }
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <TabNavigation tabs={this.state.tabs} selectTab={this.selectTab.bind(this)} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderFilters.bind(this)}
          automaticallyAdjustContentInsets={false}
          style={styles.listView}
        />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  filterRecipes(filter) {
    let recipeFilter = {};

    if(this.state.selectedTab === ResourceKeys.recipestypes) {
      recipeFilter = {
        Key: 'RecipeTypeKey',
        Value: filter.Code,
      }
    } else {
      recipeFilter = {
        Key: 'ProductID',
        Value: filter.ID,
      }
    }

    this.props.navigator.push({
      data: recipeFilter,
      title: filter.Title,
      component: RecipesList,
    });
  }
  
  renderFilters(filter) {
    var imgFilter;
    if (filter.ID) {
      imgFilter = <View style={styles.imgFilter}><Image source={require('image!img_filter_btm')} /></View>
    }
    return (
      <TouchableHighlight
          onPress={() => this.filterRecipes(filter)}
          underlayColor="transparent">
        <View style={[styles.itemWrap, styles[this.state.selectedTab + 'Wrap'], filter.Code && styles['bg' + filter.Code]]}>
          <View style={[styles.imgWrap, styles[this.state.selectedTab + 'ImgWrap']]}>
            <Image source={{uri: filter.ImageUrl}}
              style={styles.img} />
          </View>
          { imgFilter }
          <Text style={styles[this.state.selectedTab + 'Title']}>{filter.Title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
var colors = {
  red: '#930c10',
  green: '#5B7A22',
  yellow: '#BF9500',
  purple: '#703971',
  lightRed: '#E03A31',
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    position: 'relative',
    marginTop: 64,
  },
  recipestypesTitle: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  productsTitle: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  itemWrap: {
    flex: 1,
    margin: 0,
    padding: 0,
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imgWrap: {
    flex: 1,
    height: 200,
  },
  productsWrap: {
    height: 250,
  },
  productsImgWrap: {
    height: 250,
  },
  img: {
    flex: 1,
  },
  imgFilter: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
   // backgroundColor: '#000',
    padding: 0,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  listView: {
    paddingTop: 0,
    paddingBottom: 40,
  },
  bg00: {
    backgroundColor: colors.green,
  },
  bg01: {
    backgroundColor: colors.yellow,
  },
  bg02: {
    backgroundColor: colors.purple,
  },
  bg03: {
    backgroundColor: colors.lightRed,
  },
  bg04: {
    backgroundColor: colors.lightRed,
  },
});

module.exports = RecipesFilter;