let newUser = {
    epost: '',
    passord: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    deviceId: ''
}

let step1 = document.getElementById("step1");
let step2 = document.getElementById("step2");
let step3 = document.getElementById("step3");
let step4 = document.getElementById("step4");

// Step 1:
let brukerEpost = document.getElementById("epost");
let brukerPassord1 = document.getElementById("passord1");
let brukerPassord2 = document.getElementById("passord2");
let epostFeil = document.getElementById("epostFeil");
let passordFeil = document.getElementById("passordFeil");
let next1 = document.getElementById("next1");

function checkStep1() {
    if (!brukerEpost.value.includes('@') || !brukerEpost.value.includes('.')) {
        next1.disabled = true;
        epostFeil.style.display = 'block';
    } else if (brukerPassord1.value != brukerPassord2.value || brukerPassord1.value.length<1) {
        next1.disabled = true;
        epostFeil.style.display = 'none';
        passordFeil.style.display = 'block';
    } else {
        passordFeil.style.display = 'none';
        epostFeil.style.display = 'none';
        next1.disabled = false;
    }
}
function completeStep1() {
    newUser.epost = brukerEpost.value;
    newUser.passord = brukerPassord1.value;
    step1.style.display = 'none';
    step2.style.display = 'block';
}
brukerEpost.addEventListener('input', checkStep1);
brukerPassord1.addEventListener('input', checkStep1);
brukerPassord2.addEventListener('input', checkStep1);

// Step 2:
let brukerClientID = document.getElementById('clientID');
let brukerClientSecret = document.getElementById('clientSecret');
let next2 = document.getElementById('next2');

function checkStep2() {
    if (brukerClientID.value.length<1 || brukerClientSecret.value.length<1) {
        next2.disabled = true;
    } else {
        next2.disabled = false;
    }
}
function completeStep2() {
    newUser.clientId = brukerClientID.value;
    newUser.clientSecret = brukerClientSecret.value;
    step2.style.display = 'none';
    step3.style.display = 'block';
}
brukerClientID.addEventListener('input', checkStep2);
brukerClientSecret.addEventListener('input', checkStep2);

// Step 3:
let brukerRefreshToken = document.getElementById('refreshToken');
let next3 = document.getElementById('next3');

function checkStep3() {
    if (brukerRefreshToken.value.length<1) {
        next3.disabled = true;
    } else {
        next3.disabled = false;
    }
}
function completeStep3() {
    newUser.refreshToken = brukerRefreshToken.value;
    step3.style.display = 'none';
    step4.style.display = 'block';
}
brukerRefreshToken.addEventListener('input', checkStep3);

// Step 4:
let brukerDeviceID = document.getElementById('deviceID');
let submit = document.getElementById('submit');

function checkStep4() {
    if (brukerDeviceID.value.length<1) {
        submit.disabled = true;
    } else {
        submit.disabled = false;
    }
}
function completeStep4() {
    newUser.deviceId = brukerDeviceID.value;
    sendInn()
}
brukerDeviceID.addEventListener('input', checkStep4)

// Database connection:
const API_URL = 'http://localhost:3000/'

function sendInn() {
    console.log(JSON.stringify(newUser))
    fetch(API_URL + 'newUser', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(data => {
        if (data) {
            alert('This email already has an account');
            window.location.href = '../log-in';
        } else {
            alert('User successfully created')
            window.location.href = '../../'
        }
    })
    .catch((error)=> console.error("Error:", error));
}