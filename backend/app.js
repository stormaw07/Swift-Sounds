require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const database = require('./dbconnector.js')
app.use(express.json());
let cors = require("cors")
app.use(cors())

app.post("/songs", async (req, res) => {
    let query = `SELECT * FROM Album_songs`;
    try {
        console.log(req.body)
        let albumSongs = await database.query(query)
        const albumName = req.body.album_name
        const trackNumber = req.body.track_number
        let trackName = ''

        for (let i = 0; i < albumSongs.length; i++){
            if (albumSongs[i].album_name == albumName && albumSongs[i].track_number == trackNumber) {
                trackName = albumSongs[i].track_name
            }
        }

        res.json(trackName)
    } catch (error) {
        console.log(error)
    }
});


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});