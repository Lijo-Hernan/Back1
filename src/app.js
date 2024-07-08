import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import productsModel from "./models/products.model.js"
import "./database.js"


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


app.use("/", viewsRouter);
app.use("/products", productsRouter);

const io = new Server(httpServer);

io.on("connection", async (socket) => {

    //Enviamos el array de productos: 
    socket.emit("products",  await productsModel.find());

    //Recibimos el evento "eliminarProducto" desde el cliente: 
    socket.on("deleteProduct", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de producto no proporcionado");
                return;
            }

            const deletedProduct = await productsModel.findByIdAndDelete(id); // Eliminar el producto por su ID

            if (!deletedProduct) {
                socket.emit("error", "Producto no encontrado");
                return;
            }

            // Le voy a enviar la lista actualizada al cliente
            io.sockets.emit("products", await productsModel.find());
            
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("error", "Error al eliminar el producto"); // Enviar un mensaje de error al cliente si ocurre un problema
        }
    })

    //Agregamos productos por medio de un formulario: 
    socket.on("addProduct", async (product) => {
        try {
            const newProduct = new productsModel(product); // Crear una instancia del modelo con los datos del producto
            await newProduct.save(); // Guardar la instancia en la base de datos

            // Le voy a enviar la lista actualizada al cliente
            io.sockets.emit("products", await productsModel.find());
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            socket.emit("error", "Error al agregar el producto"); // Enviar un mensaje de error al cliente si ocurre un problema
        }
    })
})
