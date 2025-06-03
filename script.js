// Dropdown menu:

let body = document.getElementById('body')
let musicMenu = document.getElementById('dropdownMusic')
let accountMenu = document.getElementById('dropDownAccount')
let merchMenu = document.getElementById('dropDownMerch')


function dropDownMenuMusic() {
  musicMenu.classList.toggle("show")
  accountMenu.classList.remove("show")
  merchMenu.classList.remove("show")
}

function dropDownMenuAccount() {
  accountMenu.classList.toggle("show")
  musicMenu.classList.remove("show")
  merchMenu.classList.remove("show")
}

function dropDownMenuMerch() {
  merchMenu.classList.toggle("show")
  musicMenu.classList.remove("show")
  accountMenu.classList.remove("show")
}

document.addEventListener('click', function (event) {
  const isClickInsideMusic = musicMenu.contains(event.target) || document.getElementById('headerMusic').contains(event.target)
  const isClickInsideAccount = accountMenu.contains(event.target) || document.getElementById('headerAccount').contains(event.target)
  const isClickInsideMerch = merchMenu.contains(event.target) || document.getElementById('headerMerch').contains(event.target)

  if (!isClickInsideMusic) {
    musicMenu.classList.remove("show")
  }
  if (!isClickInsideAccount) {
    accountMenu.classList.remove("show")
  }
  if (!isClickInsideMerch) {
    merchMenu.classList.remove("show")
  }
})