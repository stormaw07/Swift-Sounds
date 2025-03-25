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
    console.log(newUser)
}
brukerEpost.addEventListener('input', checkStep1);
brukerPassord1.addEventListener('input', checkStep1);
brukerPassord2.addEventListener('input', checkStep1);

// Step 2: