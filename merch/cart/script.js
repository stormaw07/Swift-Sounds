let productList = document.getElementById('productList');
let summaryList = document.getElementById('allItems');
let total = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('cart'));

function loadCart() {

    if (cart.length == 0) {
        productList.innerHTML = 'Your cart is empty'
        summaryList.innerHTML = '';
        total.innerHTML = 0;
    } else {
        productHTML = '';
        summaryHTML = '';
        sum = 0;

        for (let i=0; i<cart.length; i++) {
            productHTML += `<div class="product-card">
            <button class="remove-btn" title="Remove Item" onclick="removeItem(${cart[i].id})">&times;</button>
            <img src="${cart[i].url}" alt="${cart[i].name}">
            <div class="product-details">
            <h3>${cart[i].name}</h3>
            <p>Price: ${cart[i].price} kr</p>
            <div class="quantity-controls">`
            if (cart[i].quantity == 1) {
                productHTML += `<button title="Decrease Quantity" onclick="decreaseAmount(${cart[i].id})" disabled>-</button>`
            } else {
                productHTML += `<button title="Decrease Quantity" onclick="decreaseAmount(${cart[i].id})">-</button>`
            }
            productHTML +=`<span>${cart[i].quantity}</span>
            <button title="Increase Quantity" onclick="increaseAmount(${cart[i].id})">+</button>
            </div></div></div>`;
            summaryHTML += `<div class="summary-item">${cart[i].name} (${cart[i].quantity}x)<span class="price">${cart[i].price} kr</span>`;
            sum += (cart[i].price * cart[i].quantity);
        }
        productList.innerHTML = productHTML;
        summaryList.innerHTML = summaryHTML;
        total.innerHTML = sum;
    }
};
loadCart();

function removeItem(itemID) {
    for (let i=0; i<cart.length; i++) {
        if (cart[i].id == itemID) {
            cart.splice(i, 1);
            console.log(cart);
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    loadCart();
};
function decreaseAmount(itemID) {
    for (let i=0; i<cart.length; i++){
        if (cart[i].id == itemID) {
            cart[i].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    loadCart();
};
function increaseAmount(itemID) {
    for (let i=0; i<cart.length; i++){
        if (cart[i].id == itemID) {
            cart[i].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    loadCart();
};
function completeOrder() {
    localStorage.removeItem('cart');
    window.location.href = '/merch/thanks/'
}