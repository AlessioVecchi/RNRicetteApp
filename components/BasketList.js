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
  ListView
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
              <Text>[x]</Text>
            </TouchableHighlight>
        </View>
    );
  }

  render() {
    var content;
  
    content = this.state.ingredients.map((step, index) => {
        return this.renderIngredient(step,index);
    });
 
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableHighlight style={{padding: 10}} onPress={this.removeAll.bind(this)}>
            <Text>rimuovi tutto</Text>
          </TouchableHighlight>
          <View>
            {content}
          </View>
        </View>
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
    paddingTop:50,
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
