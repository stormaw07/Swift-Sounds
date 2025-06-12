let shop = document.getElementById('shopItems');
let merch = '';

function getMerchItems(type) {
    const API_URL = 'http://localhost:3000/'+type //Henter ut enten merch eller other gjennm en onload i bodyen, basert på hvilken side du er på 

    fetch(API_URL)
    .then (response => response.json())
    .then (data => {
        merch = data; //Setter den globale variabelen merch til å være data, sånn at den kan bli brukt utenfor blokken
        console.log(data);

        for (let i=0; i<data.length; i++) {
            product = `<div class="product-card"> 
            <div class="image-container"><img src=${data[i].url} alt=${data[i].name}></div>
            <h2>${data[i].name}</h2>
            <p class="price">${data[i].price} kr</p>
            <button class='add-to-cart' onclick="addToCart(${i})">Add to Cart</button>`; //Oppretter html koden for itemene
            shop.innerHTML += product; //Legger til ett og ett item på nettsiden
        };
    })
    .catch (error => {
        console.log(error)
    })
};

function addToCart(item){
    console.log(merch[item]) //Sjekker om den returnerer det itemet man trykker på

    let newItem = {
        id: merch[item].id,
        name: merch[item].name,
        url: merch[item].url,
        price: merch[item].price,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let existingItem = cart.find(cartItem => cartItem.id === newItem.id)

    if (existingItem){
        existingItem.quantity += 1;
    } else{
        cart.push(newItem);
    };

    console.log(cart);

    localStorage.setItem('cart', JSON.stringify(cart));
};

//localStorage.removeItem('cart'); //For å tømem carten
