const socket = io(); 

socket.on("products", (data) => {
    renderProductos(data);
})


const renderProductos = (data) => {
    const productCont = document.getElementById("productCont");
    productCont.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div"); 
        
        card.innerHTML = `  <p> ${item.name} </p>
                            <p> ${item.brand} </p>
                            <p> ${item.price} </p>
                            <button> Eliminar </button>
                        `
        productCont.appendChild(card); 
        //Agregamos un evento al boton de eliminar: 
        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id); 
        })
    })
}