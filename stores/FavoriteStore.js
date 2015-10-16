"use strict";

var Dispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes')
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var CHANGE_EVENT = 'change';

var _favorites = [];

var FavoriteStore = Object.assign({}, EventEmitter.prototype, {
	addChangeListener : function(callback) {		
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function() {		
		this.emit(CHANGE_EVENT);
	},

	getAll: function() {
		return _favorites;
	},

	getById: function(id) {
		return _.find(_favorites, {id: id});
	}
});

Dispatcher.register(function(action) {
	var recipeId = action.recipeId;
	var isFavorite = FavoriteStore.getById(recipeId);

	switch(action.actionType) {
		case ActionTypes.FAVORITE_ADD:
			if(!isFavorite) {
				_favorites.push( { id: action.recipeId });
				FavoriteStore.emitChange();
			}
		break;
		case ActionTypes.FAVORITE_REMOVE:
			if(isFavorite) {
				var index = _.findIndex(_favorites, function(item) { return item.id == recipeId });
				_favorites.splice(index, 1);
				FavoriteStore.emitChange();
			}
			
		break;
	}
});

module.exports = FavoriteStore;
