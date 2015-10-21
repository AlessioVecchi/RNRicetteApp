'use strict';

var React = require('react-native');
var CACHE_DURATION =  60 * 1000; // millisenconds 
var REQUEST_URL = 'http://mondosnello.staging.extra.it/api/';

var {
  AsyncStorage
} = React;

class DataService {
	async getData(resourceKey, forceReset) {
		//forceReset = true;
		if(forceReset) { 
			await AsyncStorage.removeItem(resourceKey);
		}

		var value = await AsyncStorage.getItem(resourceKey);
		var cachebleObj = null;
    	var requestUrl = REQUEST_URL + resourceKey;
		
		if(value !== null) {
			cachebleObj = JSON.parse(value);
			var currentDateTime = new Date();
			if(cachebleObj.expiration < currentDateTime.getTime()) {
				cachebleObj = null;
				await AsyncStorage.removeItem(resourceKey);
			}
		}

		if (cachebleObj === null) { 
			//console.log('retrieve from server: ' + requestUrl);
			var response = null;
			try {
				response = await fetch(requestUrl);
				var body = await response.json();
  				var cachebleObj = new CachebleObject(body);
			} catch (err) { 
				//console.log("error in calling server: ",err);
				//error in call server -> restore the original value
				if(value !== null) {
					cachebleObj = JSON.parse(value);
				}
			}
  			await AsyncStorage.setItem(resourceKey, JSON.stringify(cachebleObj));
		} else {
			//console.log('retrieve from disk');
		}
		return cachebleObj.data; 
	}
}

class CachebleObject {
	constructor(obj) {
		var currentDateTime = new Date();
		this.expiration = currentDateTime.getTime() + CACHE_DURATION;
    	this.data = obj;
  	}
}

module.exports = new DataService();
