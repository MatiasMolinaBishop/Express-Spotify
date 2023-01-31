require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/artist-search", async (req, res) => {//THIS IS THE SAME AS CREATING ASYNC FUCNTION BELOW LIKE DONE PREVIOUSLY

    const artist = req.query.artist
    //req.query.artist is the input passed by the user with the form
    //That query is declared on the <input name='artist'>
    //Watever we name the 'name' will be the key pair to the value typed in by the user.
    //This will be visible after the ?artist=Mac+Demarco for example
    //We can now use this as the parameter from the API end point

    try {
        const searchAPI = await spotifyApi.searchArtists(artist)
        //console.log(searchAPI)
        const data = {//{}we transform the array into an object
            artistInfo: searchAPI.body.artists.items
        }
        //console.log(searchAPI.body.artists.items)
        res.render("artist-search-results", data)
        //The secomd parameter in this case data is passed  on as an object
        //So that we can use that data in the artist-search-results view
        //In this case its easier than usisng DOM where we would have to create a new element etc innerHTML..

    } catch (err) {
        console.log(err)
    }
})

app.get("/albums/:artistId", async (req, res, next) => {
    //We pass in the id with router params :artistId
    try {
        const albumsInfo = await spotifyApi.getArtistAlbums(req.params.artistId)//:artistID works as the key pair for the id value
        //We use the id which we get grom the  <a class='view-albums' href="/albums/{{this.id}}">View Albums</a>
        //console.log(albumsInfo.body.items)    
        //res.render("albums")
        const data = {
            albumsKey: albumsInfo.body.items
        }
        res.render("albums", data)

    } catch (err) {
        console.log(err)
    }

})

app.get("/tracks/:albumId", async (req, res, next) => {
    try {
        const tracks = await spotifyApi.getAlbumTracks(req.params.albumId)
        console.log(tracks.body.items)
        const data = {
            tracksKey: tracks.body.items
        }
        res.render("tracks", data)

    } catch (err) {
        console.log(err)
    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
