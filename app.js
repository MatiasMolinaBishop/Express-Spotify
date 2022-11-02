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

app.get("/", (req, res) =>{
    res.render("index")
})

app.get("/artist-search",async (req, res) =>{//THIS IS THE SAME AS CREATING ASYNC FUCNTION BELOW LIKE DONE PREVIOUSLY
    
    const artist = req.query.artist

        try{
            const searchAPI = await spotifyApi.searchArtists(artist)
            //console.log(searchAPI) 
            const data = {
                artistInfo: searchAPI.body.artists.items
            }
            //console.log(searchAPI.body.artists.items)
            res.render("artist-search-results",data)//{}we transform the array into an object

        }catch(err){
            console.log(err)
        }
})

app.get("/albums/:artistId", async(req,res, next) => {
    try{
        const albumsInfo = await spotifyApi.getArtistAlbums(req.params.artistId)//HOW TO SPECIFY NAME?
        //console.log(albumsInfo.body.items)    
        //res.render("albums")
        const data = {
            albumsKey:albumsInfo.body.items
        }
        res.render("albums", data)

    }catch(err){
        console.log(err)
    }
    
})

app.get("/tracks/:albumId", async(req,res,next)=>{
    try{
        const tracks = await spotifyApi.getAlbumTracks(req.params.albumId)
        console.log(tracks.body.items)
        const data = {
            tracksKey: tracks.body.items
        }
        res.render("tracks", data)

    }catch(err){
        console.log(err)
    }
})




















app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
