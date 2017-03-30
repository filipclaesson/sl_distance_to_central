var booli = require('./booliGetter');
var SL = require('./SLGetter');
var Postgres = require('./postgres_caller');
var pg = require('pg');


var db = Postgres.getDB()

counter = 0;
var Apartments = "";
var geoLocationsToLookup = [];
var SLGeodata = [];




executeIn(3000);





/* 
 * FuncationName: saveSLData - gets the SL data and saves it to an array
 * 			data: the array with distanceVariables
 */
var saveSLData = function(SLdata){
	//2 resp. response from SL api with distance variables
	if (SLdata.isSuccess){
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
		geoLocationsToLookup[counter].distanceVariables = SLdata.variables
	}else{
		console.log('--- getting SL data for lookup: ' + (counter+1) + ' of ' + geoLocationsToLookup.length + ' : Success')
	}
	getNextDelay()
}

/* 
 * FuncationName: SendBooliDataToSLAPI - takes array with apartments and sends it to 
 * 			data: the array with distanceVariables
 */
var SendBooliDataToSLAPI = function(booliApartments){
	console.log("--------------------------------------------------")
	console.log("Step 2: Get response from Booli: " + booliApartments.length + " apartments ...")
	console.log("--------------------------------------------------")
	Apartments = booliApartments;
	if (Apartments.length > 0) {
		console.log("--------------------------------------------------")
		console.log("Step 3: store Booli data in DB ... count: " + Apartments.length);
		console.log("--------------------------------------------------")
		Postgres.insertMultiApartments(Apartments,db, function(){console.log(" ------ Everything is finished ------")})
		
		
		
	}
}
function execute(){
	
	console.log("--------------------------------------------------")
	console.log("Step 1: Send data to Booli ...")
	console.log("--------------------------------------------------")
	var startDate = process.argv[2].substr(0,4) + process.argv[2].substr(5,2) + process.argv[2].substr(8,2)
	var endDate = process.argv[3].substr(0,4) + process.argv[3].substr(5,2) + process.argv[3].substr(8,2)
	console.log(startDate + " " + endDate);

	booli.getApartments(process.argv[2], process.argv[3], SendBooliDataToSLAPI);

	
}

function executeIn(milli){
	setTimeout(execute, milli);
}



