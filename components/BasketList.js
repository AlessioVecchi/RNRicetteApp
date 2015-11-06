'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Component,
  Animated,
  Dimensions,
} = React;

var {
  height: deviceHeight
} = Dimensions.get('window');

var BasketActions = require('../actions/BasketActions');
var BasketStore = require('./../stores/BasketStore');

class BasketList extends Component { 
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.state = {
      offset: new Animated.Value(-deviceHeight),
      ingredients: []
    };
  }

 componentWillUnmount() {
    BasketStore.removeChangeListener(this.changeListener);
  }

  componentDidMount() {
    this.changeListener = this.loadBasket.bind(this);
    BasketStore.addChangeListener(this.changeListener);
    this.loadBasket();
  }

  loadBasket() {
    console.log('load basket');
     BasketStore.getAll().then((ingredients) => { 
      this.setState({
        ingredients: ingredients
      });
    });
  }

  confirmRemoveAll() {
    Animated.timing(this.state.offset, {
      duration: 250,
      toValue: 0
    }).start();
  }

  remove(index) {
    BasketActions.remove(index);
  }

  closeModal(remove) {
    Animated.timing(this.state.offset, {
        duration: 250,
        toValue: -deviceHeight
      }).start( () => {
        if(remove) {
          BasketActions.removeAll();    
        }
      });
  }

  renderIngredient(ingredient,index) {
    return (
       <View key={index} style={styles.ingredient}>
            <Text style={styles.ingredientElement}>
              <Text style={styles.ingredientQty}>{ingredient.Quantity} </Text>
              {ingredient.Element}
            </Text>
            <TouchableHighlight style={styles.ingredientActions} onPress={this.remove.bind(this, index)}>
              <Text style={{fontSize:55, color: '#c0c0c0', fontWeight: '100'}}>&times;</Text>
            </TouchableHighlight>
        </View>
    );
  }

  render() {
    var content;
  
    if(this.state.ingredients.length>0) {
      var ingredientsContent = this.state.ingredients.map((step, index) => {
        return this.renderIngredient(step,index);
      });
      content = 
          (<View style={styles.container, this.props.baseStyles.baseContainer}>
            <TouchableHighlight style={{padding: 10}} onPress={this.confirmRemoveAll.bind(this)}>
              <Text style={styles.cleanButton}>svuota lista</Text>
            </TouchableHighlight>
            <View style={{borderTopWidth:1, borderStyle: 'dotted', borderTopColor: '#e0e0e0'}}>
              {ingredientsContent}
            </View>

          </View>);
    } else {
      //empty basket list
      content = 
          (<View style={styles.container}>
            <Text style={styles.title}>Non sono presenti articoli in questo momento</Text>
          </View>);
    }   
 
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>  
          {content}
        </ScrollView>
        <Animated.View style={[styles.modal, styles.flexCenter, { transform: [{translateY: this.state.offset}] } ]}>
          <View style={styles.modalContent}>
            <Text>Vuoi cancellare la lista?</Text>
            <View style={{flexDirection:'row', justifyContent:'center',  marginTop:20}}> 
              <TouchableHighlight onPress={this.closeModal.bind(this, true)} style={styles.modalButton}><Text>Si</Text></TouchableHighlight>
              <TouchableHighlight onPress={this.closeModal.bind(this, false)} style={styles.modalButton}><Text>No</Text></TouchableHighlight>
            </View>
          </View>
        </Animated.View> 
      </View>
    );
  }
}

var colors = {
  red: '#930c10',
  gray: '#808080',
}
var styles = StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(127,127,127,.5)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 10,
    borderWidth:1, 
    borderColor: colors.gray, 
    padding:20, 
    width: 250, 
    height:120,
    backgroundColor: 'white',
  },
  modalButton: {
    paddingLeft:25, 
    paddingRight:25,
    paddingTop:7,
    paddingBottom:7, 
    marginLeft:20, 
    marginRight:20, 
    borderWidth:2,
    borderRadius: 3, 
    borderColor:colors.gray,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  cleanButton: {
    alignSelf: 'center',
    fontSize:25
  },
  title: {
    fontSize:25,
    alignSelf: 'center'
  },
  ingredient: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderStyle: 'dotted',
  },
  ingredientQty: {
    fontSize: 18,
    color: colors.red,
  },
  ingredientElement: {
    fontSize: 18,
    flex: 8,
    alignSelf:'center',
  },
  ingredientActions: {
    flex:1,
    alignSelf:'center',
  }

});


module.exports = BasketList;
