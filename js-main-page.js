import {products} from '../data/products.js';
import {cart, addtocart, cartquantity} from './cart.js';

let html ='';

products.forEach((product) => {
html +=`
    <div class="product-container">
    <div class="product-image-container">
        <img class="product-image"
        src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
        ${product.name}
    </div>

    <div class="product-rating-container">
        <img class="product-rating-stars"
        src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
            ${product.rating.count}
        </div>
    </div>

    <div class="product-price">
        $${(Math.round(product.priceCents)/100).toFixed(2)}
    </div>

    <div class="product-quantity-container">
        <select class="select-numbers" >
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
    </div>

    <button class="add-to-cart-button button-primary" data-product-id=${product.id}>
        Add to Cart
    </button>
    </div>`;
    
});
document.querySelector('.js-products-grid').innerHTML = html;





document.querySelectorAll('.add-to-cart-button').forEach((button) => {
    button.addEventListener('click', ()=>{
    const productId =button.dataset.productId;
    const productContainer = button.closest('.product-container');
    const selectedValue = productContainer.querySelector('.select-numbers').value;
    addtocart(productId, selectedValue);
    const totalquantity = cartquantity();
    const added = productContainer.querySelector('.added-to-cart');
    added.style.opacity = 1;
    setTimeout(() => {
        added.style.opacity = 0;
    },1000);
    cartnumber();
    });  
});

function cartnumber(){
    const totalquantity = cartquantity();
    let carthtml=`
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png">
          <div class="cart-quantity">${totalquantity}</div>
          <div class="cart-text">Cart</div>
        </a>
    `;
    document.querySelector('.amazon-header-right-section').innerHTML = carthtml;
}

cartnumber();








        
   