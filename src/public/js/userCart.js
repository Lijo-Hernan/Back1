const socket = io();

const cartId = window.location.pathname.split("/")[2]; 

socket.on("carts", (data) => { 

    const specificCart = data.filter(item => item._id === cartId);
    renderCart(specificCart); 
});

const renderCart = (data) => {
    const cartsCont = document.getElementById("userCart");
    cartsCont.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("productCartCont");
        let productsCart = '';
        item.products.forEach(product => {
            productsCart += `
                <div class="productCont">
                    <p>Producto ID: ${product.product}</p>
                    <p>Cantidad: ${product.quantity}</p>
                    <button class="btn btn-warning" data-prodid="${product.product}">Eliminar producto</button>
                </div>
            `;
        });

        card.innerHTML = `
            <span class="cart__unit">
                <p class="cart__id">Cart Id: ${item._id} </p>
                </span>
                ${productsCart}
                `;
                cartsCont.appendChild(card);
                
                // <button class="btn btn-warning">Eliminar carrito</button>
        card.querySelectorAll('.productCont button').forEach(button => {
            button.addEventListener("click", (event) => {
                const prodId = event.currentTarget.getAttribute('data-prodid');
                deleteProdCart(prodId, item._id);
            });
        });

        card.querySelector("button").addEventListener("click", () => {
            deleteCart(item._id);
        });
    });
};

const deleteCart = (id) => {
    socket.emit("deleteCart", id);
};

const deleteProdCart = (prodId, id) => {
    socket.emit("deleteProdCart", prodId, id);
};

socket.on('updateCarts', (carts) => {
    console.log('Carritos actualizados:', carts);
});

socket.on('error', (message) => {
    console.error('Error recibido:', message);
});
