'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  Component,
} = React;

var BasketActions = require('../actions/BasketActions');
var BasketStore = require('./../stores/BasketStore');

class BasketList extends Component { 
  constructor(props) {
    super(props);
    this.changeListener = null;
    this.state = {
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

  removeAll() {
    console.log('BasketList.removeAll');
    BasketActions.removeAll();    
  }

  remove(index) {
    console.log('BasketList.remove', index);
    BasketActions.remove(index);    
  }

  renderIngredient(ingredient,index) {
    return (
       <View key={index} style={styles.ingredient}>
            <Text style={styles.ingredientElement}><Text style={styles.ingredientQty}>{ingredient.Quantity}</Text> {ingredient.Element}</Text>
            <TouchableHighlight style={styles.ingredientActions} onPress={this.remove.bind(this, index)}>
              <Text style={{fontSize:25, fontWeight: '600'}}>&times;</Text>
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
          (<View style={styles.container}>
            <TouchableHighlight style={{padding: 10}} onPress={this.removeAll.bind(this)}>
              <Text style={styles.cleanButton}>rimuovi tutto</Text>
            </TouchableHighlight>
            <View>
              {ingredientsContent}
            </View>
          </View>);
    } else {
      //empty basket list
      content = 
          (<View style={styles.container}>
            <Text style={styles.title}>Nessun ingrediente nel carrello</Text>
          </View>);
    }   
 
    return (
      <ScrollView>  
        {content}
      </ScrollView>
    );
  }
}

var colors = {
  red: '#930c10',
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  cleanButton: {
    alignSelf: 'center',
    fontSize:20
  },
  title: {
    fontSize:25,
    alignSelf: 'center'
  },
  ingredient: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 0,
  },
  ingredientQty: {
    color: colors.red,
    marginRight: 0,
  },
  ingredientElement: {
    flex: 9,
  },
  ingredientActions: {
    flex:1,
  }

});


module.exports = BasketList;
