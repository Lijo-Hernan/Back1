const socket = io();

socket.on("products", (data) => {
    listProducts(data);
});

const listProducts = (data) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div"); 
        card.classList.add("product");
        
        card.innerHTML = `
            <p> Producto: ${item.name} </p>
            <p>Marca: ${item.brand} </p>
            <p> Precio: ${item.price} </p>
            <input type="number" id="cantidad" placeholder="cantidad">
            <button class="btn btn-success">Agregar al carrito</button>
        `;
        productList.appendChild(card); 

        card.querySelector("button").addEventListener("click", () => {
            addProductToCart(item._id, "cantidad"); 
        })
    });
};


