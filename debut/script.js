let accessToken = '';
const clientId = '06a4f77d92e745f29d2687d2700fa83e';
const clientSecret = '8761d61fc4b2425cb90d4cc3daae0094'; 
const redirectUri = 'http://127.0.0.1:5500';
const tokenUrl = 'https://accounts.spotify.com/api/token';
const deviceId = 'e112199fd21344deb7e9d4d3a02d966969ee8e38';
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
  const refreshToken = 'AQC3R1a3o6sL0hEIOAG_PtqZ3VdDmdfRTGqE1pQtShZzgNM2pV9CRi0_Jjm7uo2KVc0-Jt_Q0Kixwjhdd1W1YU-s4UiyrvDfMGDRXjCeNmyfehcylF9lj6nCnKIbMyXD6Lk'; // Get the refresh token from local storage

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
async function getAlbumData() {
  // Sjekker om accessToken eksisterer, hvis ikke venter på at den gjør det
  if (!accessToken) {
    await refreshAccessToken();
  }

  fetch(`https://api.spotify.com/v1/albums/${albumUri[0]}`, {
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
      track.append(trackNumber,trackName,trackDuration) // Legger til alt til raden den raden som ble opprttet
      document.getElementById('tracklist').append(track) // Legger raden med track-info til under den forrige
    }

  })
  .catch(error => console.error("Error:", error));
}

// Kall på denne funksjonen for album-data
getAlbumData();


// Spiller av albumet fra starten av
async function startPlaybackOnDevice() {
  const trackNr = 0
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
        context_uri: "spotify:album:" + albumUri[0],
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
async function playAlbumShuffled() {
  if (!accessToken) await refreshAccessToken();

  try {
    // Henter alle sangene på albumet
    const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumUri[0]}/tracks`, {
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
