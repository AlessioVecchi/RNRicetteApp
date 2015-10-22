"use strict";

var Dispatcher = require("../dispatcher/AppDispatcher");
var ActionTypes = require("../constants/ActionTypes");

var FavoriteActions = {
	addFavorite: function(recipeId) {
		//dispact actions
		Dispatcher.dispatch({
			actionType: ActionTypes.FAVORITE_ADD,
			recipeId: recipeId
		});
	},
	
	removeFavorite: function(recipeId) {
		//dispact actions
		Dispatcher.dispatch({
			actionType: ActionTypes.FAVORITE_REMOVE,
			recipeId: recipeId
		});
	}

}

module.exports = FavoriteActions;