var pg = require('pg');
promise = require('promise');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

function getDB(){
    var pass;
    fs = require('fs')
     fs.readFile('/home/pi/node_apps/postgres_pass.txt', 'utf8', function (err,data) {
    //    fs.readFile('/Users/Filip/postgres_pass.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      pass = data;
    });
    var cn = {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'filip',
        password: pass
    };
    return pgp(cn);
}

function runQuery(query,db, callback) {
    console.log('inne i qunQuery')
	//var db = pgp(cn);
	db.any(query, [true])
    .then(function (data) {
        response = {
            db_success: true,
            data: data
        }
        console.log("detta skickas till servern")
        console.log("length: " + response.data.length)
        callback(response)
    })
    .catch(function (error) {
        response = {
            db_success: false,
            data: error
        }
        console.log(error)

        callback(response)
        // error;
    });
}

function insertMultiSLgeo(dataIn, db, callback) {
    dataQueries = []; 
    //var db = pgp(cn);

    db.tx(function(t) {
        for (i in dataIn){
            query = getInsertQueryForSLGeo(dataIn[i])
            dataQueries.push(t.none(query[0], query[1]))
        }
        // this.ctx = transaction config + state context;
        //console.log("------ just before sending batch querie to db ------")
        //console.log(dataQueries)
        return t.batch(dataQueries);
    })
    .then(function (data) {
        console.log("------ message from db ------")
        //console.log(data)
        console.log("---------------------------------------")
        console.log("-- Db finished with Success ..." );
        console.log("---------------------------------------")
        // success;
    })
    .catch(function (error) {
        console.log("ERROR:", error.message || error);
    });
}


function getInsertQueryForSLGeo(slObject){
    queryString = "insert into geo_data_sl(lon, lat, avg_time_to_central, min_time_to_central, max_time_to_central, avg_commuting_walk_distance, min_commuting_walk_distance, max_commuting_walk_distance, avg_commuting_departures_per_hour) values($1,$2,$3,$4,$5,$6,$7,$8,$9)";

    //queryString = "insert into apartments(booli_id,sold_date,address,areas,lon,lat,room,floor,sqm,listprice,price_up,sold_price,rent,distance_to_ocean,construction_year,object_type,broker,broker_id,broker_type) select $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19 where not exists (select 1 from apartments a where a.booli_id = $1::text)";
    data = [
    slObject[0].lon,
    slObject[0].lat,
    slObject[0].avg_time,
    slObject[0].min_time,
    slObject[0].max_time,
    slObject[0].avg_walk_distance,
    slObject[0].min_walk,
    slObject[0].max_walk,
    slObject[0].departures_per_hour
    ]
    //console.log("------ get insert query ------")
    //console.log(data)

    return [queryString, data];
}

module.exports = {
  runQuery: runQuery,
  insertMultiSLgeo: insertMultiSLgeo,
  getDB:getDB
};
