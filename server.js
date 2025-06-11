// API-koden:
let accessToken = '';
const refreshToken = 'AQC3R1a3o6sL0hEIOAG_PtqZ3VdDmdfRTGqE1pQtShZzgNM2pV9CRi0_Jjm7uo2KVc0-Jt_Q0Kixwjhdd1W1YU-s4UiyrvDfMGDRXjCeNmyfehcylF9lj6nCnKIbMyXD6Lk';
const clientId = '06a4f77d92e745f29d2687d2700fa83e';
const clientSecret = '8761d61fc4b2425cb90d4cc3daae0094';
const deviceId = 'e112199fd21344deb7e9d4d3a02d966969ee8e38';
const tokenUrl = 'https://accounts.spotify.com/api/token';
let trackNr = 0;
const albumUri = [
  "5eyZZoQEFQWRHkV2xgAeBw", // Taylor Swift - 0
  "4hDok0OAJd57SGIT8xuWJH", // Fearless - 1
  "5AEDGbliTTfjOB8TSm1sxt", // Speak Now - 2
  "6kZ42qRrzov54LcAk4onW9", // Red - 3
  "1o59UpKw81iHR0HPiSkJR0", // 1989 - 4
  "6DEjYFkNZh67HP7R9PSZvv", // reputation - 5
  "1NAmidJlEaVgA3MpcPFYGq", // Lover - 6
  "1pzvBxYgT6OVwJLtHkrdQK", // folklore - 7
  "6AORtDjduMM3bupSWzbTSG", // evermore - 8
  "1fnJ7k0bllNfL1kVdNVW1A", // Midnights - 9
  "5H7ixXZfsNMGbIE5OBSpcb" // TTPD - 10
];



// Refresh accessToken funksjon:
async function refreshAccessToken() {
  if (!refreshToken) {
    console.error('No refresh token available.');
    return;
  } else{
    console.log(refreshToken)
  }

  const payload = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    // Henter ny accessToken
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload,
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token); // Ny accessToken lagres
      console.log('Access token refreshed:', data.access_token);
      accessToken = data.access_token;

      // Lagrer refreshToken
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
    } else {
      console.error('Error refreshing access token:', data);
    }
  } catch (error) {
    console.error('Failed to refresh access token:', error);
  }
}
setInterval(refreshAccessToken, 55 * 30 * 1000); // Refresher hvert 55 minutt

// Henter informasjon om albumet
async function getAlbumData(album) {
  // Sjekker om accessToken eksisterer, hvis ikke venter på at den gjør det
  if (!accessToken) {
    await refreshAccessToken();
  }

  fetch(`https://api.spotify.com/v1/albums/${albumUri[album]}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${accessToken}` },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const imageUrl = data.images[0].url
    const albumName = data.name
    const albumType = data.album_type

    document.getElementById('bilde').src = imageUrl;
    document.getElementById('album-title').innerHTML = albumName;
    document.getElementById('album-label').innerHTML = albumType;

    for (let i=0; i < data.total_tracks; i++) {
      let track = document.createElement('tr') // Oppretter raden der tracken og resten av dataet blir vist
      let trackName = document.createElement('td') // Oppretter feltet for track-navnet
      let trackNumber = document.createElement('td') // Oppretter feltet for hvilken nr. track det er
      let trackDuration = document.createElement('td') // Oppretter feltet for track-lengden
      trackName.append(data.tracks.items[i].name) // Henter navnet fra api-en
      trackNumber.append(i+1) // Legger til hvilken nr. track det er, (+1 fodi den er 0-indeksert)
      trackDuration.append(Math.floor((data.tracks.items[i].duration_ms/1000/60) <<0),':',(Math.floor((data.tracks.items[i].duration_ms/1000) % 60) < 10 ? '0' : '') + Math.floor((data.tracks.items[i].duration_ms/1000) % 60)); // Henter ut lengden på tracksene i ms fra api-en og gjør de om til minutter og sekunder
      track.append(trackNumber,trackName,trackDuration) // Legger til alt til den raden som ble opprettet
      document.getElementById('tracklist').append(track) // Legger raden med track-info til under den forrige
    }

  })
  .catch(error => console.error("Error:", error));
}

// Kall på denne funksjonen for album-data
// getAlbumData();


// Spiller av albumet fra starten av
async function startPlaybackOnDevice(album, trackNr) {
  if (!accessToken) {
    await refreshAccessToken();
  }
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: "spotify:album:" + albumUri[album],
        offset: { position: trackNr },
        position_ms: 0
      })
    });
    if (response.ok) {
      console.log("Playback started successfully.");
    } else {
      console.error("Error starting playback:", await response.json());
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}
// Spiller av albumet fra starten:
// startPlaybackOnDevice();


// Spiller av albumet i tilfeldig rekkefølge
async function playAlbumShuffled(album) {
  if (!accessToken) await refreshAccessToken();

  try {
    // Henter alle sangene på albumet
    const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumUri[album]}/tracks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!tracksResponse.ok) {
      console.error("Failed to fetch album tracks:", await tracksResponse.json());
      return;
    }

    const tracksData = await tracksResponse.json();
    const trackUris = tracksData.items.map(track => track.uri);

    // Stokker alle sangene i en tilfeldig rekkefølge
    const shuffledTracks = trackUris.sort(() => Math.random() - 0.5);

    // Spiller av albumet i den rekkefølgen som ble opprettet
    const playbackResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: shuffledTracks,
      }),
    });

    if (playbackResponse.ok) {
      console.log("Playback started in shuffle mode.");
    } else {
      console.error("Error starting playback:", await playbackResponse.json());
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
// Spiller av albumet i tilfeldig rekkefølge:
// playAlbumShuffled();



// Games-siden sin javascript:

let random_int = 0 // Oppretter variablen random_int og gir den verdien 0 sånn at den er deklarert med slår av som false i løkken
let answer // Oppretter answer som en top string sånn at den er global
const removeList = [ // Oppretter en liste med strings som skal bli fjernet fra "answer" variabelen
  ` (Taylor's Version)`,` (From The Vault)`,
  ` - Radio Single Remix`,` - Pop Version`,` - bonus track`,
  ` (feat. Colbie Caillat)`,` (feat. Marren Morris)`,` (feat. Keith Urban)`,` (feat. Fall Out Boy)`,` (feat. Hayley Williams)`,` (feat. Gary Lightbody of Snow Patrol)`,` (feat. Ed Sheeran)`,` (feat. Phoebie Bridgers)`,` (feat. Chris Stapleton)`,` (feat. Kendrick Lamar)`,` (feat. The Chicks)`,` (feat. Brendon Urie of Panic! At The Disco)`,` (feat. Bon Iver)`,` (feat. HAIM)`,` (feat. The National)`,` (feat. Lana Del Rey)`,` (feat. More Lana Del Rey)`,` (feat. Ice Spice)`,` (feat. Post Malone)`,` (feat. Florence + The Machine)`
];

function pickRandomSong(){
  if (!random_int) { // Hvis random_int = False kjøres dette:
    random_int = Math.floor(Math.random() * 11);
    console.log(random_int+1)
    pickRandomTrackNr(random_int)
  } else { // Hvis random_int slår ut som True går den bare videre til neste funksjon, sånn at det ikke kommer en ny sang hver gang man trykker på knappen
    pickRandomTrackNr(random_int)
  }
}

async function pickRandomTrackNr(random_int) {
  if (!trackNr) { // Hvis trackNr ikke eksisterer enda må den finne ut av hvilken track den skal spille
    if (!accessToken) {
      await refreshAccessToken(); // Kaller på refreshtoken funksjonen sånn at den kan hente ut data fra API-en
    }
    fetch(`https://api.spotify.com/v1/albums/${albumUri[random_int]}`, { // Henter albumet basert på hvilken tall man fikk fra dne forrige funksjonen
      method: "GET",
      headers: { "Authorization": `Bearer ${accessToken}` },
    })
    .then(response => response.json())
    .then(data => {
      trackNr = Math.floor(Math.random() * data.total_tracks) // Velger et tilfeldig tall basert på hvor mange sanger det er på albumet man henter 
      console.log(trackNr+1)
      getSongsFromDatabase(data.name, trackNr+1)
      startPlaybackOnDevice(random_int, trackNr) // Sender inn random_int for albumet og trackNr for hvilken sang som skal spilles av
    })
    .catch(error => console.error("Error:", error));
  } else{
    startPlaybackOnDevice(random_int, trackNr) // Hvis trackNr allerede finnes, altså knappen har blitt trykket på før, går den videre til avspillingsfunksjonen
  }
}

// Database fetch:
function getSongsFromDatabase(album_name, track_number) {
  const API_URL = 'http://localhost:3000/songs'

  let albumbundle = {
    'album_name': album_name,
    'track_number': track_number
  }
  console.log("Sender inn:", JSON.stringify(albumbundle))
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(albumbundle),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
  }
})
  .then(function (response) {
    return response.json();
  })
  .then(data => {
    answer = data
    console.log(answer)
  })
  
}

// For å sjekke om det man skriver inn er lik svaret fra databsen
document.getElementById('guess').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    guessSong()
  }
});
const gameFeedback = document.getElementById('gameFeedback');

function guessSong() {
  let guess = document.getElementById('guess').value
  // Fjerner de stringsene i listen fra "answer"
  removeList.forEach(str => {
    answer = answer.replace(str, "");
  });
  answer = answer.trim();
  console.log(answer);

  if (guess.toLowerCase() === answer.toLowerCase()) {
    console.log('rikitg');
    gameFeedback.innerHTML = 'Riktig!';
    gameFeedback.style.display = 'block';
    document.getElementById('guess').value = "";
  } else {
    console.log('feil');
    gameFeedback.innerHTML = 'Feil :(';
    gameFeedback.style.display = 'block';
  }
}


