'use strict';

var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var DataService = require('../services/DataService');
var ResourceKeys = require('../constants/ResourceKeys');
var FavoriteStore = require('./FavoriteStore')

var { find } = require('lodash');

// var _ = require('lodash');
var CHANGE_EVENT = 'change';
// var BASKET_KEY =  'basket';

var RecipeStore = Object.assign({}, EventEmitter.prototype, {
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
		var recipes = await DataService.getData(ResourceKeys.recipes);
		return recipes;
	},

	getById: async function(recipeId) {
		var recipes = await RecipeStore.getAll();
		var recipe = find(recipes, (item) => {
			return item.ID == recipeId;
		});
		return recipe;
	}, 

	getByFilter: async function(filter) {
		var recipes = await RecipeStore.getAll();
		var recipesFiltered = recipes;
		if(filter) {
          //console.log(this.props.route.data.Key);
          recipesFiltered = filter(responseData, (item) => {
            return item[dataFilter.Key] == dataFilter.Value;
          });
        } 
		return recipesFiltered;
	},

	getFavorites: async function() {
		var recipes = await RecipeStore.getAll();
		var favorites = await FavoriteStore.getAll();
		var favRecipes = [];
		favorites.forEach((item, index) => {    
				favRecipes.push(find(recipes, { ID: item.id }));
		});
		return favRecipes;
		// DataService.getData(ResourceKeys.recipes).then((responseData) => {
		// 	FavoriteStore.getAll().then((favorites) => {
		// 		var favoritesRecipes = [];
		// 		favorites.forEach((item, index) => {    
		// 			favoritesRecipes.push(find(responseData, { ID: item.id }));
		// 		});
		// 		this.setState({
		// 			dataSource: favoritesRecipes,
		// 		});
		// 	});
		// });
	},

});

module.exports = RecipeStore;
