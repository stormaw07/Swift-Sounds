# Swift Sounds
A website where i use Spotify's API to create a music-library for every Taylor Swift album. You can also listen to the albums through the website. I am currently working on a login function and a game where you try to guess what song is being played.

## How to use 
To use the website for yourself there's a couple of things you need to replace and prepare.

### Spotify API setup
Firstly you will need to replace some variables with your own to get the API up and running. When you find the correct thing replace it in the server.js file.

#### Client ID & Client Secret
1. Go to: https://developer.spotify.com/
2. Log into a Spotify account with premium.
3. Click on your profile and select "Dashboard".
4. Click "Create App" and provide a name and description.
5. Under "Redirect URIs", add the local IP address where the website is hosted and this URL: https://alecchen.dev/spotify-refresh-token/
6. Check off "Web API" under APIs, accept the Terms of Service, and press "Save".
7. Once the project is created, go to its "Settings".
8. Your Client ID will be displayed.
9. After getting your Client ID, click on "View client secret".
10. Your Client Secret will be displayed.
---

#### Refresh Token
1. Once you have your Client ID and Client Secret, go to: https://alecchen.dev/spotify-refresh-token/
2. Enter your Client ID and Client Secret in the respective fields.
3. Click "Select All" to check all permission boxes, then press "Submit".
4. You will receive an Access Token, a Refresh Token, and an Example Output.
5. Copy your Refresh Token and save the Access Token for the next step.
---

#### Device ID
1. To retrieve the Device ID of your current device, run the following GET request in your terminal:
    - `curl -X "GET" "https://api.spotify.com/v1/me/player/devices" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
    - Replace YOUR_ACCESS_TOKEN with the Access Token you obtained in the previous step.
2. After running the command, you'll receive a response in the terminal. Look for "id" and copy the string next to it—this is your Device ID.
---

### Database setup
After the API is working, the only thing remaining for the website to work perfectly is setting up the database. First you will have to create the database in MariaDB with all the correct columns.
#### Creating the database
1. First you will have to install some things and do some setup, run these commands in your terminal:
    - `brew install mariadb`
    - `mysql.server start`
    - `brew services start mariadb`
2. Then run this command and log in with the computers root password
    - `mariadb -u root`
3. When you're in, create a database, open it and create a table called "Users" and a table called "Album_songs" with these commands:
    - `CREATE DATABASE Swiftle;`
    - `USE Swiftle;`
    - `CREATE TABLE Users (epost VARCHAR(255),passord VARCHAR (255), clientId VARCHAR(255), clientSecret VARCHAR(255), refreshToken VARCHAR(255), deviceId VARCHAR(255));`
    - `CREATE TABLE Album_songs (album_name VARCHAR(255), track_number INT(11), track_name VARCHAR(255));`
4. Download dotenv and express by running these commands in the terminal:
    - `npm install dotenv`
    - `npm install express`
4. Head back to the project and Then create a .env file in the backend folder. In this file create the variables:
    - DB_HOST = 'localhost'
    - DB_USER = 'your_username' (root if you havent made one)
    - DB_PASSWORD = 'your_password' (computer password if you havent made a custom one)
    - DB_NAME = 'Swiftle'
    - DB_CON_LIMIT = 5
5. Everything should now be set up and ready to go
