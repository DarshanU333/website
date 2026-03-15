import {products} from './data/products.js';
import {cart, deletebtn , delivarydate, cartquantity, placeurorder, orderedcart} from './cart.js';
import DayJs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js' ;
import {delivaryoption} from './delivary.js'

function foremptycart(){
    if (cart.length === 0){
       document.querySelector('.js-order-summary').innerHTML = `
       <div class="product-name" >Your Cart Is Empty</div>
       <a class="link-primary " href="amazon.html">Look For The Products</a>
       ` ;
       return true ;
    }
    return false;
}

function reviewpage() {
    if(foremptycart()){
        return;
    }
    let itemhtml=''; 
   
    foremptycart();
    cart.forEach((item)=>{
    
        const productId =item.productId;
        let matching;
        products.forEach((product)=>{
            if( product.id === productId) {
                matching = product;
            }
        });

        const optionId = item.delivaryoptionId;
        let delivaryoptions;
        delivaryoption.forEach((option)=>{
            if (option.id === optionId){
                delivaryoptions = option;

            }
        });
        const today =DayJs();
        const now = today.add(delivaryoptions.delivarydate , 'days' );
        const date = now.format('dddd, MMMM D');

        itemhtml += `
        <div class="cart-item-container js-cart-item-container${matching.id}">
            <div class="delivery-date">
                Delivery date: ${date}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matching.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matching.name}
                </div>
                <div class="product-price">
                    $${(Math.round(matching.priceCents)/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${item.quantity}</span>
                    </span>
                    <a class="update-quantity-link link-primary" href="amazon.html">
                    Update
                    </a>
                    <span class="delete-quantity-link link-primary js-delete" data-product-id="${productId}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${delivaryoptionhtml(productId , item)}
                </div>
            </div>
            
        </div>
        `;

    });
    function delivaryoptionhtml(productId , item){
        let delivaryhhtml =''; 
        delivaryoption.forEach((option)=>{
            const today =DayJs();
            const now = today.add(option.delivarydate , 'days' );
            const date = now.format('dddd, MMMM D');
            const Shippingprice = option.priceCents === 0 ? 'FREE' : `$${(Math.round(option.priceCents)/100).toFixed(2)} -` ;
            const checked = option.id === item.delivaryoptionId ;

            delivaryhhtml +=
            `
                <div class="delivery-option js-delivery-option" data-product-id=${productId} data-delivaryoption-id=${option.id}>
                    <input type="radio"
                    ${checked ? 'checked' :''}
                    class="delivery-option-input"
                    name="delivery-option-${productId}">
                    <div>
                    <div class="delivery-option-date">
                        ${date}
                    </div>
                    <div class="delivery-option-price">
                        ${Shippingprice} Shipping
                    </div>
                </div>
            </div>
            `;
        });
        
        return delivaryhhtml;

    }
    document.querySelector('.js-order-summary').innerHTML = itemhtml ;

    document.querySelectorAll('.js-delete').forEach((link) => {
        link.addEventListener('click', ()=>{
            const productId = link.dataset.productId ;
            deletebtn(productId);
            const container=document.querySelector(`.js-cart-item-container${productId}`);
            container.remove( );
            foremptycart();
            paymentsummary();
            item();
        });  
    });
    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
        element.addEventListener('click',()=>{
            const {productId,delivaryoptionId} = element.dataset;
            delivarydate(productId,delivaryoptionId);
            reviewpage();
            paymentsummary();
        });  
    });
}

reviewpage();



function paymentsummary() {
    let productprice = 0;
    let shippingprice = 0;
    cart.forEach((item)=>{
        const productId = item.productId ;
        let matching;
        products.forEach((product)=>{
            if( product.id === productId) {
                matching = product;
            }
        });
        productprice += matching.priceCents * item.quantity;

        const optionId = item.delivaryoptionId;
        let delivaryoptions;
        delivaryoption.forEach((option)=>{
            if (option.id === optionId){
                delivaryoptions = option;
            }else if (delivaryoptions === null){
                delivaryoptions = [0];
            }
            
        });
        shippingprice += delivaryoptions.priceCents ;
    });
    const totalquantity = cartquantity();
    const totalbeforetax = productprice + shippingprice ;
    const tax = totalbeforetax * 0.1
    const ordertotal = totalbeforetax + tax ;
    const summaryhtml = `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${totalquantity}):</div>
            <div class="payment-summary-money">$${(Math.round(productprice)/100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(Math.round(shippingprice)/100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(Math.round(totalbeforetax)/100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(Math.round(tax)/100).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(Math.round(ordertotal)/100).toFixed(2)}</div>
          </div>
          <button class="place-order-button button-primary js-place-order" >
            Place your order
          </button>
          
          
    `;

    document.querySelector('.js-payment-summary').innerHTML = summaryhtml;

    document.querySelector('.js-place-order')
    .addEventListener('click', () => {
        placeurorder();
        window.location.href = 'orders.html';
    });

    
    
}



function item(){
    let totalquantity =cartquantity();
    document.querySelector('.return-to-home-link').innerHTML = `${totalquantity} items`; 
}

item();
paymentsummary();


