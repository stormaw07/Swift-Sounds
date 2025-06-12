require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const database = require('./dbconnector.js')
app.use(express.json());
let cors = require("cors");
app.use(cors());
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

        const hashedEpost = crypto.createHash('sha256').update(newUser.epost).digest('hex');
        const hashedPassord = await bcrypt.hash(newUser.passord, 10);
        const hashedClientID = crypto.createHash('sha256').update(newUser.clientId).digest('hex');
        const hashedClientSecret = crypto.createHash('sha256').update(newUser.clientSecret).digest('hex');
        const hashedRefreshToken = crypto.createHash('sha256').update(newUser.refreshToken).digest('hex');
        const hashedDeviceId = crypto.createHash('sha256').update(newUser.deviceId).digest('hex');

        let brukerFinnes = false;
        for (let i=0; i<users.length; i++) {
            if (users[i].epost == hashedEpost) {
                console.log('Epost finnes allerede');
                brukerFinnes = true;
            }
        }
        if (!brukerFinnes) {
            console.log('Epost er gyldig');
            try {
                let query = `INSERT INTO Users (epost, passord, clientId, clientSecret, refreshToken, deviceId) VALUES ('${hashedEpost}', '${hashedPassord}', '${hashedClientID}', '${hashedClientSecret}', '${hashedRefreshToken}', '${hashedDeviceId}');`;
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

app.post("/login", async (req, res) => {
    let query = `SELECT * FROM Users;`;
    try {
        console.log(req.body);
        let users = await database.query(query);
        const epost = req.body.epost;
        const passord = req.body.passord;
        let loggetInn = false
        const hashedEpost = crypto.createHash('sha256').update(epost).digest('hex');

        for (let i=0; i<users.length; i++ ) {
            let passordMatch = await bcrypt.compare(passord, users[i].passord)
            if (users[i].epost == hashedEpost && passordMatch) {
                console.log('logget inn')
                loggetInn = true
            }
        }
        if (!loggetInn) {
            console.log('Epost eller passord er feil')
        }
        res.json(loggetInn);

    } catch (error) {
        console.log(error)
    }
})

app.get("/music", async (req, res) => {
    let query = 'SELECT * FROM Merch WHERE type="music"'; //Henter bare ut musikk produktene
    try {
        let musicMerch = await database.query(query);
        res.json(musicMerch);
    } catch (error) {
        console.log(error)
    }
});

app.get("/other", async (req, res) => {
    let query = 'SELECT * FROM Merch WHERE type="other"'; //Henter bare ut de andre produktene
    try {
        let otherMerch = await database.query(query);
        res.json(otherMerch);
    } catch (error) {
        console.log(error)
    }
});


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});