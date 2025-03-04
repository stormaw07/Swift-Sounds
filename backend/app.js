require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const database = require('./dbconnector.js')
app.use(express.json());
let cors = require("cors")
app.use(cors())

app.get("/home", async (req, res) => {
    let query = "SELECT * FROM Album_songs;";
    try {
        let albumSongs = await database.query(query)
        res.send(albumSongs)
    } catch (error) {
        console.log(error)
    }
});


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});