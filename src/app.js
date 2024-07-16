import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import productsModel from "./dao/models/products.model.js"
import CartManager from "./dao/db/cartManagerDb.js"
import ProductManager from "./dao/db/productManagerDb.js"
import "./database.js"


const PUERTO = 8080;
const app = express();
const cartManager = new CartManager();
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");


const httpServer = app.listen(PUERTO, ()=>{
    displayRoutes(app)
});

const stats = async ()=> {
    const resp= await productsModel.find({status:true}).explain("executionStats");

    console.log(resp)
}

// stats()


app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const io = new Server(httpServer);

io.on("connection", async (socket) => {

    //Enviamos el array de productos: 
    socket.emit("products",  await productManager.getProducts());

    //Recibimos el evento "eliminarProducto" desde el cliente: 
    socket.on("deleteProduct", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de producto no proporcionado");
                return;
            }

            const deletedProduct = await productManager.deleteProduct(id); // Eliminar el producto por su ID

            if (!deletedProduct) {
                socket.emit("error", "Producto no encontrado");
                return;
            }

            // Le voy a enviar la lista actualizada al cliente
            io.sockets.emit("products", await productManager.getProducts());
            
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("error", "Error al eliminar el producto"); // Enviar un mensaje de error al cliente si ocurre un problema
        }
    })

    //Agregamos productos por medio de un formulario: 
    socket.on("addProduct", async (product) => {
        try {
        
            const newProduct = await productManager.addProduct(product);

            io.sockets.emit("products", await productManager.getProducts());

        } catch (error) {
            console.error("Error al agregar el producto:", error);
            socket.emit("error", "Error al agregar el producto");
        }
    })

    //Enviamos el array de carritos: 
    socket.emit("carts", await cartManager.getCarts());

    //Borrado de carrito 
    socket.on("deleteCart", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de carrito no proporcionado");
                return;
            }

            const deletedCart = await cartManager.deleteCart(id);

            if (!deletedCart) {
                socket.emit("error", "Carrito no encontrado");
                return;
            }
            // Le voy a enviar la lista actualizada al cliente
            io.sockets.emit(cartManager.getCarts());
            
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito");
        }
    })

    //Borrado de producto dentro de  carrito
    socket.on("deleteProdCart", async (prodId, id) => {

        try {
            if (!id) {
                socket.emit("error", "ID de carrito no proporcionado");
                return;
            }

            const deletedProd = await cartManager.removeProdCart(id, prodId); // Eliminar el producto por su ID
            
            if (!deletedProd) {
                socket.emit("error", "Carrito no encontrado");
                return;
            }
            // Le voy a enviar la lista actualizada al cliente
            io.sockets.emit(cartManager.getCarts());
            
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito"); // Enviar un mensaje de error al cliente si ocurre un problema
        }
        
    })

    //Armado de carrito desde el Home
    socket.on("addProdToCart", async (products) => {
        try {
            let cart = await cartManager.createCart();

            if (!cart) {
                throw new Error('Error al crear o encontrar el carrito');
            }

            for (const { id, quantity } of products) {
                await cartManager.addProdToCart(cart._id, id, quantity);
            }
            socket.emit('redirect', { url: `/realtimecarts` });
        }

        catch (error) {
            console.error('Error generando carrito:', error);
            // Emite un evento de error si es necesario
            socket.emit('error', { message: 'Error agregando productos' });
        }

    })
})
