let productList = document.getElementById('productList');
let summaryList = document.getElementById('allItems');
let total = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('cart'));

function loadCart() {

    if (cart.length == 0) {
        productList.innerHTML = 'Your cart is empty'
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
            <div class="quantity-controls">
            <button title="Decrease Quantity">-</button>
            <span>${cart[i].quantity}</span>
            <button title="Increase Quantity">+</button>
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