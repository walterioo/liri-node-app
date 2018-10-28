require('dotenv').config();
var keys = require('./key.js')
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

switch (command) {
    case 'spotify-this-song':
        spotifySong(term);
        break;
    case 'concert-this':
        concert(term);
        break;
    case 'movie-this':
        movie(term);
        break;
    case 'do-what-it-says':
        doit();
        break;
    default:
        break;
}

function spotifySong(song) {
    if (!song) {
        song = 'The Sign'
    }

    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var newSong = data.tracks.items;

        console.log('--- Spotify This Song! ----- \n' +
            'Artist: ' + newSong[0].artists[0].name + '\n' +
            'Song Name: ' + newSong[0].name + '\n' +
            'Album: ' + newSong[0].album.name + '\r\n' +
            'Preview Link: ' + newSong[0].preview_url + '\n' +
            '----------------------\n');
    });
}

function concert(search) {
    if (!search) {
        search = 'Coldplay';
    }
    var queryURL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    request(queryURL, function (err, response, data) {
        if (err) {
            return console.log('Error: ' + err);
        }

        var nextConcert = JSON.parse(data);
        var date = moment(nextConcert[0].datetime).format('DD MMMM YYYY');

        console.log('----- Concert This! ----- \n' +
            'Artist/Band: ' + search + '\n' +
            'Venue: ' + nextConcert[0].venue.name + '\n' +
            'Location: ' + nextConcert[0].venue.city + ', ' + nextConcert[0].venue.region + '\n' +
            'Date of event: ' + date + '\n' +
            '-----------------------\n');
    })
}

function movie(search) {
    if (!search) {
        search = 'Mr. Nobody'
    }
    var queryURL = 'http://www.omdbapi.com/?apikey=trilogy&type=movie&plot=short&t=' + search;

    request(queryURL, function (err, response, data) {
        if (err) {
            console.log('Error: ' + err);
        }

        var newMovie = JSON.parse(data);

        console.log('----- Movie This! ----- \n' +
            'Title: ' + newMovie.Title +
            '\nYear: ' + newMovie.Year +
            '\nIMDB Rating: ' + newMovie.imdbRating +
            '\nRotten Tomatoe: ' + newMovie.Ratings[1].Value +
            '\nCountry: ' + newMovie.Country +
            '\nLanguage: ' + newMovie.Language +
            '\nPlot: ' + newMovie.Plot +
            '\nActors: ' + newMovie.Actors +
            '\n-----------------------\n'
        );

    })
}

function doit() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        newSearchArray = data.split(',');

        if (err) {
            console.log('Error: ' + err);
        }

        switch (newSearchArray[0]) {
            case 'spotify-this-song':
                spotifySong(newSearchArray[1]);
                break;
            case 'concert-this':
                concert(newSearchArray[1]);
                break;
            case 'movie-this':
                movie(newSearchArray[1]);
                break;
            default:
                break;
        }
    })
}