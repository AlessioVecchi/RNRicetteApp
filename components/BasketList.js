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
  Image
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
      opacity: new Animated.Value(0),
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
    //console.log('load basket');
    BasketStore.getAll().then((ingredients) => { 
      this.setState({
        ingredients: ingredients
      });
    });
  }

  confirmRemoveAll() {
    Animated.sequence([
     Animated.timing(this.state.offset, {
        duration: 250,
        toValue: 0
      }), 
      Animated.timing(this.state.opacity, {
        duration: 250,
        toValue: 1
     }) 
    ]).start();
  }

  remove(index) {
    BasketActions.remove(index);
  }

  closeModal(remove) {
    Animated.sequence([
      Animated.timing(this.state.opacity, {
        duration: 250,
        toValue: 0
      }),
      Animated.timing(this.state.offset, {
          duration: 250,
          toValue: -deviceHeight
      }),
    ]).start( () => {
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

   renderEmptyList() {
     return (
      <View style={
          { 
            flex: 1, 
            justifyContent: 'center', 
            marginLeft: 20, 
            marginRight: 20, 
          }
        }>
        <View style={
          { 
            padding:20, 
            borderRadius: 20, 
            backgroundColor:'#c0c0c0'
          }
        }>
          <View style={{marginBottom: 15}}>
            <Text style={{fontSize: 18, color: colors.red }}>Non hai ancora aggiunto alcuna ricetta alla lista della spesa</Text>
          </View>
          <View style={{alignItems: 'flex-end', backgroundColor: colors.red }}>
            <Image source={ require('image!ico_basket') } style={[styles.icon]}></Image>
          </View>
          <View style={{marginTop: 15}}> 
            <Text style={{fontSize: 14}}>Nota: puoi aggiungere gli ingredienti premendo il carrello in alto nella scheda dalla ricetta</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {

    if(this.state.ingredients.length == 0) {
      return this.renderEmptyList();
    }

    var ingredientsContent = this.state.ingredients.map((step, index) => {
      return this.renderIngredient(step,index);
    });

    var content = 
        (<View style={[styles.container, {marginTop:-10}]}>
          <View style={{borderTopWidth:1, borderStyle: 'dotted', borderTopColor: '#e0e0e0'}}>
            {ingredientsContent}
          </View>
        </View>);
    return (
      <View style={[{ flex: 1 }, this.props.baseStyles.baseContainer]}>
          <TouchableHighlight style={{padding: 5, marginTop: 25}} onPress={this.confirmRemoveAll.bind(this)}>
            <Text style={styles.cleanButton}>svuota lista</Text>
          </TouchableHighlight>
        <ScrollView>  
          {content}
        </ScrollView>
        <Animated.View style={[styles.modal, styles.flexCenter, { transform: [{translateY: this.state.offset}], opacity: this.state.opacity } ]}>
          <View style={styles.modalContent}>
            <Text style={{color:'white'}}>Vuoi cancellare la lista?</Text>
            <View style={{flexDirection:'row', justifyContent:'center',  marginTop:30}}> 
              <TouchableHighlight onPress={this.closeModal.bind(this, true)} style={styles.modalButton}><Text style={{color:'white'}}>Si</Text></TouchableHighlight>
              <TouchableHighlight onPress={this.closeModal.bind(this, false)} style={styles.modalButton}><Text style={{color:'white'}}>No</Text></TouchableHighlight>
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
  bgred: '#c8201f',
  white: 'white',
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
    borderColor: colors.red, 
    padding:20, 
    width: 250, 
    height:130,
    backgroundColor: colors.red,
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
    borderColor:colors.white,
  },
  container: {
    flex: 1,
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
  },
  icon: {
    width: 30,
    height: 30,
    margin: 5,
    resizeMode: 'contain',
  },
});


module.exports = BasketList;
