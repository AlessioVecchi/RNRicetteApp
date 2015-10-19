"use strict";

var Dispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventEmitter = require('events').EventEmitter;
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');
var CHANGE_EVENT = 'change';
var FAVORITES_KEY =  'favorites';

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

	getAll: async function() {
		var favorites = [];
		var value = await AsyncStorage.getItem(FAVORITES_KEY);
		if(value != null) {
			favorites = JSON.parse(value);
		}
		return favorites;
	},

	getById: async function(id) {
		var favorites = await FavoriteStore.getAll();
		var favorite = _.find(favorites, {id: id});
		return favorite
	}, 

	add: async function(recipeId){
		var favorites = await FavoriteStore.getAll();
		favorites.push({ id: recipeId });
		await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
	},

	remove: async function(recipeId) {
		var favorites = await FavoriteStore.getAll();
		if(favorites) {
			var index = _.findIndex(favorites, function(item) { return item.id == recipeId });
			favorites.splice(index, 1);
			await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
		}
	}
});

Dispatcher.register(function(action) {
	var recipeId = action.recipeId;
	FavoriteStore.getById(recipeId).then((isFavorite) => {
		switch(action.actionType) {
			case ActionTypes.FAVORITE_ADD:
				if(!isFavorite) {
					FavoriteStore.add(recipeId).then( () => {
						FavoriteStore.emitChange();
					});
				}
			break;
			case ActionTypes.FAVORITE_REMOVE:
				if(isFavorite) {
					FavoriteStore.remove(recipeId).then( () => {
						FavoriteStore.emitChange();
					});
				}
			break;
		}
	});
});

module.exports = FavoriteStore;
