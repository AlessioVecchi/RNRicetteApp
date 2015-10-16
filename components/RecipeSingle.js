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
  ListView
} = React;

var ResourceKeys = require('../services/Constants');
var { getData } = require('../services/DataService');
var TabNavigation = require('./TabNavigation');
var { find } = require('lodash');

class RecipeSingle extends Component {
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.state = {
      recipe: {},
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      tabs: [
        {
          id: 0,
          text: 'Ingredienti',
          selected: true,
        },
        {
          id: 1,
          text: 'Preparazione',
          selected: false,
        }
      ],
    };
  }

  componentDidMount() {
    this.fetchData(ResourceKeys.recipes);
  }
  
  fetchData(resourceKey) {
    getData(resourceKey).then((responseData)=> {
      var filter = this.props.route.data.Value;
      var recipeData = find(responseData, (item) => {
        return item.ID == filter;
      });
      this.setState({
        recipe: recipeData,
        dataSource: this.state.dataSource.cloneWithRows(recipeData.Steps),
        loaded: true,
      });
    });
  }

  selectTab(tabId) {
    var tabArray = this.state.tabs
    tabArray.forEach((el) => {
      if(el.id === tabId) {
        el.selected = true;
      } else {
        el.selected = false;
      }
    });
    this.setState({
      tabs: tabArray,
    });
  }

  renderStep(step) {
    var image;
    if(step.ImageUrl) {
      image = <Image source={{uri: step.ImageUrl}} style={styles.stepImage} />;
    }
    return (
       <View key={step.Index+1} style={styles.stepContainer}>
        <View style={styles.step}>
          <View style={styles.stepIndex}>
            <Text style={styles.stepIndexText}>{step.Index+1}</Text>
          </View>
          <Text style={styles.stepText}>{step.Text}</Text>  
        </View>
        {image}
        </View>
    );
  }

 renderIngredient(ingredient) {
   
    return (
       <View key={ingredient.Index+1} style={styles.ingredient}>
            <Text style={styles.ingredientElement}>
              <Text style={styles.ingredientQty}>{ingredient.Quantity}</Text> {ingredient.Element}</Text>  
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

  render() {
   
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    var content;
    if(this.state.tabs[0].selected) {
      content = this.state.recipe.IngredientItems.map((step, index) => {
          return this.renderIngredient(step);
        });
    } else {
       content = this.state.recipe.Steps.map((step, index) => {
        return this.renderStep(step);
      });
    }
    

    return (
        <ScrollView>
          <View style={styles.recipe}>
            <Image source={{uri: this.state.recipe.ImageUrl}}
              style={styles.imgFull} />
           
            <Text style={styles.title}>{this.state.recipe.Title}</Text>
            <TabNavigation tabs={this.state.tabs} selectTab={this.selectTab.bind(this)} />
            <View>
              {content}
            </View>
          </View>
        </ScrollView>
    );    
  }
  //Brutto;
  // <ListView
  //               dataSource={this.state.dataSource}
  //               renderRow={this.renderStep.bind(this)}
  //               style={styles.listView} /> 
  // <TouchableHighlight style={this.state.isFavorite && {backgroundColor:colors.red}} onPress={this.addFavorite.bind(this)}>
  //             <Image source={require('image!ico_heart')}></Image>
  //           </TouchableHighlight>
};
var colors = {
  red: '#930c10',
}
var styles = StyleSheet.create({
  recipe: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  title: {
    padding: 20,
    fontSize: 20,
    textAlign: 'center',
  },
  imgFull: {
    height: 300,
  },
  tabs: {
    padding: 20,
    backgroundColor: colors.red,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    opacity: .30,
  },
  selectedButton: {
    opacity: 1,
  },
  stepContainer: {

  },
  step: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
  },
  stepIndex: {
    borderColor: colors.red,
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  stepIndexText: {
    // backgroundColor: colors.red,
    color: colors.red,
    height: 15,
    lineHeight: 15,
    alignSelf: 'center',
  },
  stepText: {
    paddingLeft: 15,
    flexWrap: 'wrap',
    flex: 1, 
  },
  stepImage: {
    resizeMode: 'contain',
    height: 200,
    marginLeft:20,
    marginRight: 20,
  },
  ingredient: {
    padding:20,
  },
  ingredientQty: {
    color: colors.red,
    marginRight:0,
  },
  ingredientElement: {

  }

});
module.exports = RecipeSingle;