var request = require('request');
var fs = require( 'fs' );
var query = process.argv.slice( 2 );

request( "https://www.metaweather.com/api/location/search/?query=" + query , function( error , response , body ) {
		if ( error ) {
			console.log( error );
			return;
		}
		if ( response.statusCode === 200 ) {
			var data = JSON.parse( body );
			//console.log( data );

			var woeid = data[ 0 ].woeid;
			request( "https://www.metaweather.com/api/location/" + woeid + "/" , function( error , response , body ) {

				if ( error ) {
					console.log( error );
					return;
				}
				if ( response.statusCode === 200 ) {
					var weatherData = JSON.parse( body )
					console.log( "The temperature & humidity for today in " , query );
					console.log( weatherData.consolidated_weather[ 0 ].the_temp );
					console.log( weatherData.consolidated_weather[ 0 ].humidity );			

					var pathIcon = "https://www.metaweather.com/static/img/weather/ico/" + weatherData.consolidated_weather[ 0 ].weather_state_abbr + ".ico";
					console.log( "Downloading file ");
					request.get( pathIcon ).pipe( fs.createWriteStream( "./weather" + query + ".ico" ) );

				}
			});
		}
});



