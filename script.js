
// הרישום
document.getElementById('signupForm').addEventListener('submit', function(e){
    e.preventDefault();
    alert('תודה שהרשמת!');
});

// עגלת קניות
let cart = [];
function addToCart(name, price){
    cart.push({name, price});
    renderCart();
}

function renderCart(){
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item=>{
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}₪`;
        cartItems.appendChild(li);
        total += item.price;
    });
    document.getElementById('total').textContent = total;
}

function checkout(){
    if(cart.length === 0){
        alert('העגלה ריקה!');
        return;
    }
    alert('לשלם: ' + document.getElementById('total').textContent + '₪');
}
