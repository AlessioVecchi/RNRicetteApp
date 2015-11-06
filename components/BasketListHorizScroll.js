'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');

var BasketActions = require('../actions/BasketActions');
var BasketStore = require('./../stores/BasketStore');

var {
  width,
  height
} = Dimensions.get('window');

var {
  AppRegistry,
  StyleSheet,
  ScrollView,
  ListView,
  View,
  Text,
  Animated
} = React;


var GREY = 0;
var GREEN = 1;
var RED = 2;

var values = [];

var AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

var BasketListHorizScroll = React.createClass({
  getInitialState: function() {
    return {
        values: [], //values
        colors: [], //values.map( () => new Animated.Value(GREY) )
    };
  },
  componentWillUnmount: function() {
    BasketStore.removeChangeListener(this.changeListener);
  },
  componentDidMount: function() {
    this.changeListener = this.loadBasket.bind(this);
    BasketStore.addChangeListener(this.changeListener);
    this.loadBasket();
  },
  loadBasket: function() {
    console.log('load basket');
     BasketStore.getAll().then((ingredients) => { 
      this.setState({
        values: ingredients,
        colors: ingredients.map(() => new Animated.Value(GREY)),
        heights: ingredients.map(() => new Animated.Value(40)),
      });
    });
  },
  _animateScroll: function(index, e) {
    var threshold = width / 5;
    var x = e.nativeEvent.contentOffset.x;
    var target = null;

    x = x * -1;

    if (x > -50 && this._target != GREY) {
      target = GREY;
    } else if (x < -50 && x > -threshold && this._target != GREEN) {
      target = GREEN;
    } else if (x < -threshold && this._target != RED) {
      target = RED;
    }

    if (target !== null) {
      this._target = target;
      this._targetIndex = index;

      Animated.timing(this.state.colors[index], {
        toValue: target,
        duration: 250,
      }).start();
    }

  },
  takeAction: function() {
    // this.setState({
    //   action: true
    // });
    if (this._target == RED) {
      //animate row deleting
      Animated.timing(this.state.heights[this._targetIndex], {
        toValue: 0,
        duration: 250,
      }).start();
      BasketActions.remove(this._targetIndex);
    }
  },
  getActionText: function() {
    var actionText = '';

    if (this.state.action) {
      if (this._target == GREEN) {
        //actionText = 'Save Action';
        //actionText = 'No Action';
      } else if (this._target == RED) {
        //actionText = 'Delete Action'  
        actionText = "ingrediente rimosso dalla lista";
      } else {
        //actionText = 'No Action';
      }
      //return 'You took "' + actionText + '" on the ' + this._targetIndex + ' row';
    }
    //return 'You have not taken an action yet';
    return actionText;
  },
  _renderRow: function(value, index) {

    var bgColor = this.state.colors[index].interpolate({
      inputRange: [
        GREY,
        GREEN,
        RED
      ],
      outputRange: [
        'rgb(255, 255, 255)',  //white
        'rgb(201, 135, 135)',  // orange ?
        'rgb(147, 12, 16)',    //red
      ],
    });

    var height = this.state.heights[index];

    return (
        <View 
          style={styles.row}
          key={index}
        >
          <AnimatedScrollView
            horizontal={true}
            directionalLockEnabled={true}
            style={[
                {flex: 1, height: height}, 
                {backgroundColor: bgColor}]}
            onScroll={this._animateScroll.bind(this, index)}
            scrollEventThrottle={16}
            onMomentumScrollBegin={this.takeAction}
          >
            <View style={{flex: 1}}>
              <Text style={styles.ingredientElement}><Text style={styles.ingredientQty}>{value.Quantity}</Text> {value.Element}</Text>
            </View>
          </AnimatedScrollView>
        </View>
    )
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.outerScroll}>
          {this.state.values.map(this._renderRow, this)}
        </ScrollView>      
        <Text>{this.getActionText()}</Text>
      </View>
    );
  }
});

var colors = {
  red: '#930c10',
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
  },
  outerScroll: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    flex: 1
  },
  ingredientElement: {
    paddingLeft: 20,
    flex: 9,
  },
  ingredientQty: {
    color: colors.red,
  },
  ingredientActions: {
    flex:1,
  }
 });

module.exports = BasketListHorizScroll;

