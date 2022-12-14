const socket = io.connect();
const formatterAR = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const placeForMessage = document.getElementById("messages");
const inputMessageBox = document.getElementById("messageInput");
const buttonSend = document.getElementById("send-message");
const placeForProducts = document.getElementById("product-list");

buttonSend.addEventListener('click', () =>{
    const date = new Date();
    //Calculamos la hora argentina restandole 3 a UTC
    var dateHour = date.getUTCHours() - 3;
    var dateMinutes = date.getUTCMinutes();

    const numberTwoDigits = (num, places) => String(num).padStart(places, '0');

    if (dateHour < 0) {
        var dateHour = dateHour + 24;
    } 

    const message = {
        user: document.getElementById("username").value,
        text: document.getElementById("messageInput").value,
        dateHour: numberTwoDigits(dateHour, 2),
        dateMinutes: numberTwoDigits(dateMinutes, 2)
    };

    socket.emit('new-message', message);
});



function renderMessage(data){

    const html = data.map((msg, i) =>{
        return (`<div class="message bg-dark d-flex mb-2">
            <div class="col-10">
                <span class="author fw-bold text-light">${msg.user}:</span>
                <p class="message-text mb-0 text-light">
                    ${msg.text}
                </p>
            </div>
            <div class="col-2 align-self-end">
            <p class="m-0 date text-light text-end">${msg.dateHour}:${msg.dateMinutes}</p>
            </div>
        </div>`)
    }).join(" ");
    placeForMessage.innerHTML = html;

}


socket.on('messages', function(data){
    renderMessage(data);
});

socket.on('products', function(){
    // renderProductList();
});

// function renderProductList(){
//                 <div class="w-100">
//                 <button class="btn btn-primary">Agregar al carrito</button>
//             </div>
// }

function renderCartBody(){
    const cartBody = document.getElementById("cartBody");

    const getCart = ()=> {
        /* 
            Momentaneamente hacemos un fetch a cart con ID 2 hasta que armemos una l??gica que 
            sea capaz de determinar un ID del carrito seg??n el usuario
        */
        fetch('http://localhost:8080/api/cart/2/products')
        .then(response => {
            if (!response.ok) {
                cartBody.insertAdjacentHTML('beforeend', '<p>El carrito est?? vac??o</p>')
                console.log("El carrito est?? vac??o");
            }
            return response.json();
        })
        .then(data => {
        
            console.log(data);
            
            if (data.status == 404){
                cartBody.insertAdjacentHTML('beforeend', '<p>El carrito est?? vac??o</p>')
                console.log(data);
                console.log("El carrito est?? vac??o");
            }
            
            else {

                console.log(data);
                if (data.products.length > 0){
                    console.log("El carrito tiene productos");

                    data.products.map((item, i) => {
                        const productTemplate = `<div id="" class="cart-item">
                        <div class="d-flex">
                            <div class="col-3 item-cart-col-img">
                                <img class="w-100" src=${item.thumbnail} alt=${item.title}/>
                            </div>
                            <div class='col-7 item-cart-col-info ps-2'>
                                <h3 class='item-name-cart'>${item.title}</h3>
                                <p class='item-info-cart item-price-cart'>$${new Intl.NumberFormat('es-AR').format(item.price)}</p>
                            </div>
                            <div class='col-2 item-cart-col-button text-center'>
                                <button class="trash"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg></button>
                            </div>
                        </div>
                        <hr/>
                        </div>`;
                        cartBody.insertAdjacentHTML('beforeend', productTemplate);
                    });

                }
            }
        });

    };

    if (document.querySelector(".cart-item")){
        document.querySelectorAll(".cart-item").forEach(item => {
            item.remove();
        });

        getCart();
    }

    else {
        getCart();
    }

}

function deleteCart(id){
    const deleteC = ()=> {
        fetch(`http://localhost:8080/api/cart/${id}`,{
            method: 'DELETE',
          })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });

    };

    deleteC();
    renderCartBody();
}

window.onload = renderCartBody();