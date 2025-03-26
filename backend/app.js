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

app.post("/newUser", async (req, res) => {
    let query = `SELECT * FROM Users;`;
    let newUser = req.body;
    console.log('Ny bruker:', newUser);
    try {
        let users = await database.query(query);
        const epost = req.body.epost;
        let brukerFinnes = false;
        for (let i=0; i<users.length; i++) {
            if (users[i].epost == epost) {
                console.log('Epost finnes allerede');
                brukerFinnes = true;
            }
        }
        if (!brukerFinnes) {
            console.log('Epost er gyldig');
            try {
                let query = `INSERT INTO Users (epost, passord, clientId, clientSecret, refreshToken, deviceId) VALUES ('${newUser.epost}', '${newUser.passord}', '${newUser.clientId}', '${newUser.clientSecret}', '${newUser.refreshToken}', '${newUser.deviceId}');`;
                const dbResponse = await database.query(query);
                console.log(`Ny bruker lagt til i databasen: ${newUser.epost}`)
            } catch (error) {
                console.log(error)
            }
        }
        res.json(brukerFinnes)
    } catch (error) {
        console.log(error)
    }
})


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});