const socket = io();

        
// const addProdToCart = (id, quantity) => {
    
//     socket.emit("addProdToCart", id, quantity);
// }

const listProducts = (data) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ``;

    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("btn__carrito","btn", "btn-success");
    addToCartButton.textContent = "Agregar al carrito";

    productList.appendChild(addToCartButton);

    data.forEach(item => {
        const card = document.createElement("div"); 
        card.classList.add("product");
        
        card.innerHTML = `
            <p> Producto: ${item.name} </p>
            <p>Marca: ${item.brand} </p>
            <p> Precio: ${item.price} </p>
            <input type="number" id="quantity-${item._id}" placeholder="cantidad" min="0" max="${item.stock}">
        `;
        productList.appendChild(card); 
        })

        addToCartButton.addEventListener("click", () => {
            const productsToAdd = [];

            data.forEach(item => {
                const quantityInput = document.getElementById(`quantity-${item._id}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
                if (quantity > 0) {
                    productsToAdd.push({ id: item._id, quantity: quantity });
                }
            });
        
            socket.emit("addProdToCart", productsToAdd);
        });
};

socket.on("products", (data) => {
    listProducts(data);
});


