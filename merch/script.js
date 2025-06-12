let shop = document.getElementById('shopItems');

function getMerchItems(type) {
    const API_URL = 'http://localhost:3000/'+type //Henter ut enten merch eller other gjennm en onload i bodyen, basert på hvilken side du er på 

    fetch(API_URL)
    .then (response => response.json())
    .then (data => {
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
