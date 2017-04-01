//var booli = require('./booliGetter');
var SL = require('./SLGetter');
var Postgres = require('./postgres_caller');
var pg = require('pg');


var db = Postgres.getDB()

counter = 0;
var Apartments = "";
var geoLocationsToLookup = [];
var SLGeodata = [];

Postgres.runQuery("select distinct lon_short as lon,lat_short as lat from view_of_apt_sl where avg_time_to_central is null", db, function(data){


	//console.log(data.data)
	geoLocationsToLookup = data.data

	if(data.data.length > 0){
		SL.calcDistVars(geoLocationsToLookup[counter].lon, geoLocationsToLookup[counter].lat, 'apts', saveSLData);
	}
});




function getNext(){
	counter = counter + 1;
	if (counter < geoLocationsToLookup.length){
		var func = SL.calcDistVars(geoLocationsToLookup[counter].lon, geoLocationsToLookup[counter].lat, 'apts', saveSLData)
	}
	else{
		console.log("--- inserting in database ----")
		//console.log(SLGeodata)
		Postgres.insertMultiSLgeo(SLGeodata,db, function(){console.log(" ------ Everything is finished ------")})
		//Postgres.insertMultiSLgeo(geoLocationsToLookup,db, function(){console.log(" ------ Everything is finished ------")})
	}	
}

function getNextDelay(){
	setTimeout(getNext, 3000);
}



var saveSLData = function(SLdata){
	if (SLdata.isSuccess){
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
		//SLGeodata.push(SLdata.variables)
		//geoLocationsToLookup[counter].distanceVariables = SLdata.variables
	}else{
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
		console.log("NOTE: cound not get data for:");
		console.log(SLdata.lon + ", " + SLdata.lat)
	}
	getNextDelay()
}


