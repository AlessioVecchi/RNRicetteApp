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
} = React;


class TabNavigationButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      <TouchableHighlight style={styles.btnWrap}
        underlayColor={colors.red}
        onPress={()=> this.props.selectTab(this.props.tabContent.id)}>
        <View style={styles.btnWrap}>
          <Text style={styles.btnText}>{this.props.tabContent.text}</Text>
          <View style={[styles.underline, this.props.tabContent.selected && styles.selectedButton]}></View>
        </View>
      </TouchableHighlight>
    );
  }
}


class TabNavigation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.tabs}>
        { this.props.tabs.map((el, i)=> <TabNavigationButton key={i} tabContent={el} selectTab={this.props.selectTab} /> ) } 
      </View>
    );
  }
  
};
var colors = {
  red: '#930c10',
  yellow: '#EBAE1B',
}
var styles = StyleSheet.create({
  tabs: {
    backgroundColor: colors.red,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btnWrap: {
    height: 70,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
  },
  underline: {
    position: 'absolute',
    bottom: 15,
    left: -15,
    right: -15,
    height: 2,
    backgroundColor: colors.yellow,
    opacity: 0,
  },
  selectedButton: {
    opacity: 1,
  },
});
module.exports = TabNavigation;