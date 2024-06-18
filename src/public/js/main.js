const socket = io(); 

socket.on("products", (data) => {
    renderProducts(data);
})


const renderProducts = (data) => {
    const productCont = document.getElementById("productCont");
    productCont.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div"); 
        
        card.innerHTML = `
                            <p> ${item.name} </p>
                            <p> ${item.brand} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                        `
        productCont.appendChild(card); 
        
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id); 
        })
    })
}

const deleteProduct = (id) => {
    socket.emit ("deleteProduct", id)

}


document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
})


const addProduct = () => {
    const product = {
        name: document.getElementById("name").value,
        brand: document.getElementById("brand").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value,
    }

    socket.emit("addProduct", product);
}