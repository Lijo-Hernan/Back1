import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"

const PUERTO = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

const httpServer = app.listen(PUERTO, ()=>{
    displayRoutes(app)
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

import ProductManager from "./manager/productManager.js";
const productManager = new ProductManager("./src/public/files/products.json");


const io = new Server(httpServer);

io.on("connection", async (socket) => {

    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);

        io.sockets.emit("products", await productManager.getProducts());
    })

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product); 

        io.sockets.emit("products", await productManager.getProducts());
    })
})