import {products} from '../data/products.js';
import {cart, deletebtn , delivarydate, cartquantity,orderedcart,addtocart} from './cart.js';
import DayJs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js' ;
import {delivaryoption} from './delivary.js'


function reviewpage() {
    
    let detailshtml='';
    let headerhtml='';
    const today =DayJs();
    const date = today.format('MMMM D');
    let productprice = 0;
    let shippingprice = 0;
    orderedcart.forEach((item)=>{
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
   
    const totalbeforetax = productprice + shippingprice ;
    const tax = totalbeforetax * 0.1;
    const ordertotal = totalbeforetax + tax ;
    const orderid = crypto.randomUUID();

    orderedcart.forEach((item)=>{
    
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
        
       const now = today.add(delivaryoptions.delivarydate , 'days' );
       const delivarydate = now.format('MMMM D'); 
        
        detailshtml += `
          
            <div class="product-image-container">
              <img src="${matching.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matching.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${delivarydate}
              </div>
              <div class="product-quantity">
                Quantity: ${item.quantity}
              </div>
              <button class="buy-again-button button-primary" data-product-id="${matching.id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="amazon.html">
                <button class="track-package-button button-secondary">
                  Look For More Products
                </button>
              </a>
            </div> 
          
        `;
       
      });
         headerhtml += `
              <div class="order-container" >
                <div class="order-header">
                  <div class="order-header-left-section">
                    <div class="order-date">
                      <div class="order-header-label">Order Placed:</div>
                      <div>${date}</div>
                    </div>
                    <div class="order-total">
                      <div class="order-header-label">Total:</div>
                      <div>$${(Math.round(ordertotal)/100).toFixed(2)}</div>
                    </div>
                  </div>

                  <div class="order-header-right-section">
                    <div class="order-header-label">Order ID:</div>
                    <div>${orderid}</div>
                  </div>
                </div>

                <div class="order-details-grid" >
                  ${detailshtml}
                </div>
              </div>
              `;

              


              
    document.querySelector('.js-orders-grid').innerHTML = headerhtml ; 
   
    document.querySelectorAll('.buy-again-button').forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        addtocart(productId, 1);
        cartnumber();
        const message = button.querySelector('.buy-again-message');
        message.textContent = "Added!";
        setTimeout(() => {
          message.textContent = "Buy it again";
        }, 1000);
      });
    });
      
  
}
reviewpage();
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