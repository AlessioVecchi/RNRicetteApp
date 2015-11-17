'use strict';

var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');
var DataService = require('../services/DataService');
var ResourceKeys = require('../constants/ResourceKeys');
var FavoriteStore = require('./FavoriteStore')

var { find, filter } = require('lodash');
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
		console.log('getAll');
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

	getObjectValueForKeyPath: function(obj, path) {
	  var paths = path.split('.');
	  var current = obj;
	  for (var i = 0; i < paths.length; ++i) {
	    if (current[paths[i]] == undefined) {
	      return undefined;
	    } else {
	      current = current[paths[i]];
	    }
	  }
	  return current;
	},
	
	getByFilter: async function(filterData) {
		var recipes = await RecipeStore.getAll();
		var recipesFiltered = recipes;
		if(filterData) {
          recipesFiltered = filter(recipes, (item) => {
            //return item[filterData.Key] == filterData.Value;
            var objValue = RecipeStore.getObjectValueForKeyPath(item, filterData.Key);
            //console.log('getByFilter', value, filterData.Value);
            return objValue == filterData.Value
          });
        } 
		return recipesFiltered;
	},

	getFavorites: async function() {
		console.log('getFavorites');
		var recipes = await RecipeStore.getAll();
		var favorites = await FavoriteStore.getAll();
		var favRecipes = [];
		favorites.forEach((item, index) => {    
			favRecipes.push(find(recipes, { ID: item.id }));
		});
		return favRecipes;
	},

	getRecipeTypes: async function() {
		console.log('getRecipeTypes');
		var recipeTypes = await DataService.getData(ResourceKeys.recipestypes);
		return recipeTypes;
	},

	getProducts: async function() {
		console.log('getProducts');
		var products = await DataService.getData(ResourceKeys.products);
		return products;
	},

	getCategories: async function() {
		console.log('getCategories');
		var categories = await DataService.getData(ResourceKeys.categories);
		return categories;
	},
});

module.exports = RecipeStore;
