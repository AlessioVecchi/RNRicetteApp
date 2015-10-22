'use strict';

var Dispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");

var BasketActions = {
	addIngredients: function(recipeId) {
		//dispact actions
		Dispatcher.dispatch({
			actionType: ActionTypes.INGREDIENTS_ADD,
			recipeId: recipeId
		});
	},

	remove: function(index) {
		//dispact actions
		Dispatcher.dispatch({
			actionType: ActionTypes.INGREDIENTS_REMOVE,
			index: index
		});
	},

	removeAll: function() {
		//dispact actions
		Dispatcher.dispatch({
			actionType: ActionTypes.INGREDIENTS_REMOVE_ALL,
		});
	}
}

module.exports = BasketActions;