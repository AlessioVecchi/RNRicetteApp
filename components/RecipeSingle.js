'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableHighlight,
  ListView,
  Component,
  Animated,
  Dimensions,
} = React;

var {
  height: deviceHeight
} = Dimensions.get('window');

var TabNavigation = require('./TabNavigation');
var BrandTypes = require('../constants/BrandTypes');
var RecipeStore = require('../stores/RecipeStore');
var BasketStore = require('./../stores/BasketStore');

class RecipeSingle extends Component {
  
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.state = {
      fadeAnim: new Animated.Value(0),
      offset: new Animated.Value(-deviceHeight),
      recipe: { },
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

  componentWillUnmount() {
    BasketStore.removeChangeListener(this.changeListener);
  }

  componentDidMount() {
    this.changeListener = this.basketChanged.bind(this);
    BasketStore.addChangeListener(this.changeListener);
    this.fetchData();
  }

  showMessage() {
    console.log('showMessage');
    Animated.timing(this.state.offset,                
      {
        duration: 200,
        toValue: 0,                        
      }
    ).start( () => setTimeout(this.hideMessage.bind(this), 1500));
    
    // Animated.parallel([
    //     Animated.timing(                          
    //       this.state.offeset,                 
    //       {
    //         duration: 1000,
    //         toValue: 0,                        
           
    //       }),
    //     Animated.timing(this.state.fadeAnim, {
    //       duration: 1000,
    //       toValue: 1
    //     })
    // ]).start( () => {
    //        setTimeout(this.hideMessage.bind(this), 1500);
    // });

  }

  hideMessage() {
    console.log('hideMessage');
    Animated.timing(this.state.offset, {
      duration: 1000,
      toValue: -deviceHeight,
    }).start();
  }

  basketChanged() {
    console.log('basket changed!');
    this.showMessage.bind(this)();
  }

  fetchData() {
    RecipeStore.getById(this.props.route.data.Value)
      .then((recipeData) =>  {
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
      //ingredients tab
      content = this.state.recipe.IngredientItems.map((step, index) => {
          return this.renderIngredient(step);
        });
    } else {
       //preparation steps tab
      content = this.state.recipe.Steps.map((step, index) => {
        return this.renderStep(step);
      });
    }

    var iconBrand = '';
    console.log(this.state.recipe.Product.Type);
    if(this.state.recipe.Product.Type === BrandTypes.MONDOSNELLO) {
      iconBrand = require('image!snello_ico');
    } else {
      iconBrand = require('image!rovagnati_ico');
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={[styles.recipe, this.props.baseStyles.baseContainer]}>
            <View style={{position: 'relative', backgroundColor: 'transparent'}}> 
              <Image source={{uri: this.state.recipe.ImageUrl}}
                style={styles.imgFull} />
              <Image source={iconBrand} style={styles.iconBrand} />
              <View style={styles.imgFilter}>
                <Image source={require('image!img_filter_btm')} />
              </View>
              <Text style={styles.title}>{this.state.recipe.Title}</Text>
            </View>          
            <TabNavigation tabs={this.state.tabs} selectTab={this.selectTab.bind(this)} />
            <View>
              {content}
            </View>
          </View>
        </ScrollView>

        <Animated.View style={[styles.message, styles.flexCenter,
            { transform: [ { translateY: this.state.offset } ] }
            ]}>
          <View style={styles.messageContent}>
            <Text style={{fontSize: 18, color:'white'}}>Gli ingredienti sono stati aggiunti alla lista</Text>
          </View>
        </Animated.View> 

      </View>
    );    
  }
};

//  { opacity: this.state.fadeAnim }
// { transform: [{translateY: this.state.offset}] } ]
var colors = {
  red: '#930c10',
}
var styles = StyleSheet.create({

  message: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 70,
    right: 0,
    //bottom: 0,
    left: 0,
    //transform: [{translateY: -deviceHeight}],
    opacity:1,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    //marginTop: 70,
  },
  messageContent: {
    borderRadius: 10,
    borderWidth: 1, 
    borderColor: colors.red, 
    padding:20, 
    width: 300, 
    backgroundColor: colors.red,
  },

  recipe: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    //marginTop: 64,
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
  imgFilter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
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
    marginRight: 0,
  },
  stepIndexText: {
    // backgroundColor: colors.red,
    color: colors.red,
    height: 15,
    lineHeight: 15,
    alignSelf: 'center',
  },
  stepText: {
    paddingLeft: 10,
    flexWrap: 'wrap',
    flex: 1, 
    fontSize: 16,
  },
  stepImage: {
    flex:1,
    height: 200,
    marginLeft:20,
    marginRight: 20,
  },
  ingredient: {
    padding:20,
    paddingBottom: 0,
  },
  ingredientElement: {
    fontSize: 16,
  },
  ingredientQty: {
    color: colors.red,
    marginRight:0,
  },
  iconBrand: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'transparent',
  },
});
module.exports = RecipeSingle;