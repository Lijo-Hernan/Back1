const socket = io();

        
const listProducts = (data) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ``;

    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("btn__carrito","btn", "btn-success");
    addToCartButton.textContent = "Agregar al carrito";

    productList.appendChild(addToCartButton);
    
    data.products.forEach(item => {
        const card = document.createElement("div"); 
        card.classList.add("product");
        
        card.innerHTML = `
            <p> Producto: ${item.name} </p>
            <p>Marca: ${item.brand} </p>
            <p> Precio: ${item.price} </p>
            <input type="number" id="quantity-${item._id}" placeholder="cantidad" min="0" max="${item.stock}" class="input">
        `;
        productList.appendChild(card); 
        })

        addToCartButton.addEventListener("click", () => {
            const productsToAdd = [];

            data.products.forEach(item => {
                const quantityInput = document.getElementById(`quantity-${item._id}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) : 0;
                if (quantity > 0) {
                    productsToAdd.push({ id: item._id, quantity: quantity });
                }
            });
            socket.emit("addProdToCart", productsToAdd);
        });

        const pageControls = document.createElement("div");
        pageControls.classList.add("pagination-controls");
    
        if (data.hasPrevPage) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Anterior";
            prevButton.classList.add("btn", "btn-primary");
            prevButton.addEventListener("click", () => {
                socket.emit("getProducts", { page: data.prevPage, limit: 5 });
            });
            pageControls.appendChild(prevButton);
        }
    
        const pageInfo = document.createElement("p");
        pageInfo.textContent = `Página ${data.currentPage} de ${data.totalPages}`;
        pageInfo.classList.add("pageInfo");
        pageControls.appendChild(pageInfo);
    
        if (data.hasNextPage) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Siguiente";
            nextButton.classList.add("btn", "btn-primary");
            nextButton.addEventListener("click", () => {
                socket.emit("getProducts", { page: data.nextPage, limit: 5 });
            });
            pageControls.appendChild(nextButton);
        }

        const existingPageControls = document.querySelector(".pagination-controls");
        if (existingPageControls) {
            existingPageControls.remove();
        }
    
        productList.appendChild(pageControls);

};

socket.on("products", (data) => {
    listProducts(data);
});

socket.on('redirect', (data) => {
    window.location.href = data.url;
});



