import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"

const PUERTO = 8080;
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));


//handlebars
app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");


//servidor escuchando
const httpServer = app.listen(PUERTO, ()=>{
    displayRoutes(app)
});

//Rutas
app.get("/", (req, res) => {
    res.send(`Bienvenido a mi primer servidor!`)
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

import ProductManager from "./manager/productManager.js";
const productManager = new ProductManager("./src/public/files/products.json");


const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un cliente se conecto"); 

    //Enviamos el array de productos: 
    socket.emit("products", await productManager.getProducts());

    //Recibimos el evento "eliminarProducto" desde el cliente: 
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);

        //Le voy a enviar la lista actualizada al cliente: 
        io.sockets.emit("products", await productManager.getProducts());
    })

    //Agregamos productos por medio de un formulario: 
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product); 
        //Le voy a enviar la lista actualizada al cliente: 
        io.sockets.emit("products", await productManager.getProducts());
    })
})