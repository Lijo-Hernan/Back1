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
        `;
        productList.appendChild(card); 
    });
};


