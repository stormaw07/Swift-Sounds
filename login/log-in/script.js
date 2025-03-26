const API_URL = 'http://localhost:3000/';

function loggInn() {
    let feilFelt = document.getElementById('feil');
    let brukerEpost = document.getElementById('epost').value;
    let brukerPassord = document.getElementById('passord').value;
    let loginBundle = {
        epost: brukerEpost,
        passord: brukerPassord
    }
    console.log(JSON.stringify(loginBundle))
    fetch (API_URL + 'login',{
        method: 'POST',
        body: JSON.stringify(loginBundle),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then (function (response) {
        return response.json();
    })
    .then (data => {
        if (data) {
            alert('Logged in successfully');
            window.location.href = '../../';
        } else {
            feilFelt.style.display = 'block';
        }
    })
    .catch((error)=> console.error("Error:", error));
}