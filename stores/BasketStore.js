'use strict';

var Dispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var EventEmitter = require('events').EventEmitter;
var AsyncStorage = require('react-native').AsyncStorage;
var DataService = require('../services/DataService');
var ResourceKeys = require('../constants/ResourceKeys');

var _ = require('lodash');
var CHANGE_EVENT = 'change';
var BASKET_KEY =  'basket';

var BasketStore = Object.assign({}, EventEmitter.prototype, {
	addChangeListener : function(callback) {		
		this.on(CHANGE_EVENT, callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},

	emitChange: function() {		
		this.emit(CHANGE_EVENT);
	},

	saveAll: async function(ingredients) {
		await AsyncStorage.setItem(BASKET_KEY, JSON.stringify(ingredients));
	},

	getAll: async function() {
		var ingredients = [];
		var value = await AsyncStorage.getItem(BASKET_KEY);
		if(value != null) {
			ingredients = JSON.parse(value);
		}
		return ingredients;
	},

	add: async function(recipeId) {

		console.log(recipeId);
		
		var recipes = await DataService.getData(ResourceKeys.recipes);
		var recipe = _.find(recipes, {ID: recipeId});
		var ingredientsToInsert = recipe.IngredientItems;
		console.log('BasketStore.add', ingredientsToInsert);
		var ingredients = await BasketStore.getAll();
		ingredientsToInsert.forEach((item, index)=> {
			ingredients.push(item);
		});
		await BasketStore.saveAll(ingredients);
	},

	removeAll: async function() {
		console.log('BasketStore.removeAll');
		var empty = [];
		await BasketStore.saveAll(empty);
	},

	remove: async function(ingredientIndex) {
		console.log('BasketStore.remove', ingredientIndex);
		var ingredients = await BasketStore.getAll();
		ingredients.splice(ingredientIndex, 1);
		await BasketStore.saveAll(ingredients);
	}
});

Dispatcher.register(function(action) {
	console.log(action.actionType);
	switch(action.actionType) {
		case ActionTypes.INGREDIENTS_ADD:
			BasketStore.add(action.recipeId)
			.then(() => {
				BasketStore.emitChange();
			});
			break;
		case ActionTypes.INGREDIENTS_REMOVE_ALL:
			BasketStore.removeAll()
			.then(() => {
				BasketStore.emitChange();
			});
		break;
		case ActionTypes.INGREDIENTS_REMOVE:
			BasketStore.remove(action.index)
			.then(() => {
				BasketStore.emitChange();
			});
		break;
	}
});

module.exports = BasketStore;
