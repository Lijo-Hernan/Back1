const socket = io();

socket.on("products", (data) => {
    listProducts(data);
});

const listProducts = (data) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div"); 
        
        card.innerHTML = `
            <p> ${item.name} </p>
            <p> ${item.brand} </p>
            <p> ${item.img} </p>
            <p> ${item.price} </p>
        `;
        productList.appendChild(card); 
    });
};


