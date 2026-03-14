export let cart =  JSON.parse(localStorage.getItem('cart'));
export let orderedcart =  JSON.parse(localStorage.getItem('orderedcart')) || [{
        productId :'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity :2,
        delivaryoptionId:'1',
        orderDate: DayJs().format('YYYY-MM-DD')
    },{
        productId :'15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity :1,
        delivaryoptionId :'1',
        orderDate: DayJs().format('YYYY-MM-DD')
    }];  

//import {delivaryoption} from './delivary.js'
if(!cart){
    cart = [{
        productId :'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity :2,
        delivaryoptionId:'1'
    },{
        productId :'15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity :1,
        delivaryoptionId :'1'
    }];
}




 function savetostorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addtocart(productId, selectedvalue) {
  let matchingitem; 
      cart.forEach((item)=>{
         if( productId === item.productId){
            matchingitem = item;
         }
      });

      if(matchingitem){
        if(selectedvalue > 1){
            matchingitem.quantity += Number(selectedvalue);
        }else{
            matchingitem.quantity += 1;
        }
        
      }else{
       cart.push({
        productId :productId,
        quantity : Number(selectedvalue),
        delivaryoptionId:'1'
       });
      } 
      savetostorage(); 
} 


export function deletebtn(productId){
    const newcart=[];
    cart.forEach((item)=>{
        if(item.productId !== productId){
            newcart.push(item);
        }
    });
    
    cart = newcart;
    savetostorage();
}

export function placeurorder() {
    localStorage.setItem('orderedcart', JSON.stringify(cart));
    cart.length = 0;
    savetostorage();
}

export function delivarydate(productId, delivaryoptionId) {
    let matchingitem; 
      cart.forEach((item)=>{
         if( productId === item.productId){
            matchingitem = item;
         }
      });
      matchingitem.delivaryoptionId = delivaryoptionId ;
    savetostorage(); 
    
}

export function cartquantity(){
    let totalquantity=0;
      cart.forEach((item)=>{
        totalquantity += item.quantity; 
    });
    savetostorage();
    return totalquantity;
}
