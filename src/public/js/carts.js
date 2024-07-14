
const socket = io(); 

socket.on("carts", (data) => {
    renderCarts(data);
})


const renderCarts = (data) => {
    
    const cartsCont = document.getElementById("cartsCont");
    cartsCont.innerHTML = "";
    
    data.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("productCartCont");
        let productsCart = '';
        item.products.forEach(product => {
        
        productsCart += `
            <div class="productCont">
                <p>Producto ID: ${product.productId}</p>
                <p>Cantidad: ${product.quantity}</p>
                <button class="btn btn-warning" data-prodid="${product.productId}">Eliminar producto</button>
            </div>
                `;
    });
        
        card.innerHTML = `
                    <span class="cart__unit">
                            <p class= "cart__id">Cart Id: ${item._id} </p>
                            <button class="btn btn-warning">Eliminar carrito</button>
                    </span>
                        ${productsCart}
                        `
        cartsCont.appendChild(card); 

        card.querySelectorAll('.productCont button').forEach(button => {
            button.addEventListener("click", (event) => {
                const prodId = event.currentTarget.getAttribute('data-prodid');
                deleteProdCart(prodId, item._id); 
            });
        });
        
        card.querySelector("button").addEventListener("click", () => {
            deleteCart(item._id); 
        })
    })
}

const deleteCart = (id) => {
    socket.emit ("deleteCart", id)
}

const deleteProdCart = (prodId, id) => {
    socket.emit ("deleteProdCart", prodId, id)
    console.log(prodId, id)
}