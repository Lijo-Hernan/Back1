const socket = io();

        
const addProdToCart = (id, quantity) => {
    const productData = { id: itemId, quantity };
    socket.emit("addProdToCart", productData);
    console.log(productData)

}

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
            <input type="number" id="quantity-${item._id}" placeholder="cantidad">
        `;
        productList.appendChild(card); 
        })

        addToCartButton.addEventListener("click", () => {
            // Recorre cada campo de cantidad y agrega el producto al carrito
            data.forEach(item => {
                const quantityInput = document.getElementById(`quantity-${item._id}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
                if (quantity > 0) {
                    addProdToCart(item._id, quantity);
                    console.log(item._id)
                }
            });
        });
};

socket.on("products", (data) => {
    listProducts(data);
});


