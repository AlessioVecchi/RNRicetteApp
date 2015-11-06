'use strict';

var React = require('react-native');
var CACHE_DURATION =  60 * 60 * 1000; // millisenconds 
var REQUEST_URL = 'http://mondosnello.staging.extra.it/api/';
var LAST_UPDATE = 'last-update';

var {
  AsyncStorage
} = React;

class DataService {

	getResourceUrl(resourceKey) {
		var url = REQUEST_URL + resourceKey;
		return url;
	}

	getResourceLastUpdateKey(resourceKey) {
		return resourceKey + '_' + LAST_UPDATE;
	}
	
	async getRemoteLastUpdateData(resourceKey) {
		var requestUrl = this.getResourceUrl(resourceKey) + '/' + LAST_UPDATE;
		try {
			var response = await fetch(requestUrl);
			var dateString = await response.json();
			var date = new Date(dateString);
			return date;
			console.log('getLastUpdateData', date);
		} catch (err) { 
			console.log("error in calling server: ", requestUrl, err);
		}
		return null;
	}

	async getLocalLastUpdateData(resourceKey) {
		var cacheLastUpdateKey = this.getResourceLastUpdateKey(resourceKey);
		var localLastUpdateString = await AsyncStorage.getItem(cacheLastUpdateKey);
		if(localLastUpdateString) {
			return new Date(JSON.parse(localLastUpdateString));	
		}
		return null;
	}

	async checkForUpdate(resourceKey) { 
		var result = {local: null, remote: null, updateAvailable: false};
		try	{		
			var local = await this.getLocalLastUpdateData(resourceKey);
			var remote = await this.getRemoteLastUpdateData(resourceKey);
			
			if(!local) {
				//never sync
				result = { local: null, remote: remote, updateAvailable: true };
			} else {
				result = { local: local, remote: remote, updateAvailable: (local < remote) };
			}
		} catch (err) {
			//somethings goes wrong
			console.log('checkForUpdate', err);		
		}
		console.log('checkForUpdate', result);	
		return result;
	}

	async getData(resourceKey, forceReset) {
		forceReset = true;
		//var lastUpdate = await this.getRemoteLastUpdateData(resourceKey);
		//var updateAvailable = await this.checkForUpdate(resourceKey);

		if(forceReset) { 
			await AsyncStorage.removeItem(resourceKey);
		}

		var value = await AsyncStorage.getItem(resourceKey);
		var cachebleObj = null;
    	var requestUrl = this.getResourceUrl(resourceKey);
  
		if(value !== null) {
			cachebleObj = JSON.parse(value);
			var currentDateTime = new Date();
			if(cachebleObj.expiration < currentDateTime.getTime()) {
				cachebleObj = null;
				await AsyncStorage.removeItem(resourceKey);
			}
		}

		if (cachebleObj === null) { 
			console.log('retrieve from server: ' + requestUrl);
			var response = null;
			try {
				response = await fetch(requestUrl);
				var body = await response.json();
  				cachebleObj = new CachebleObject(body);
  				//save the last update date
  				var cacheLastUpdateKey = this.getResourceLastUpdateKey(resourceKey);
  				//await AsyncStorage.setItem(cacheLastUpdateKey, JSON.stringify(updateAvailable.remote)); 
			} catch (err) { 
				console.log("getData: error in calling server: ", err);
				//error in call server -> restore the original value
				if(value !== null) {
					cachebleObj = JSON.parse(value);
				}
			}
  			await AsyncStorage.setItem(resourceKey, JSON.stringify(cachebleObj));
		} else {
			console.log('retrieve from disk:', resourceKey);
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
