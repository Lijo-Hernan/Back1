import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import sessionRouter from "./routes/session.routes.js"
import productsModel from "./dao/models/products.model.js"
import CartManager from "./dao/db/cartManagerDb.js"
import ProductManager from "./dao/db/productManagerDb.js"
import "./database.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser"; 
import configObject from "./config/config.js";
import cors from "cors";
import contactRouter from "./routes/contacto.routes.js"
import ProductDTO from "./dto/product.dto.js"
import mongoose from "mongoose"


const {PORT}= configObject;
const PUERTO = 8080;
const app = express();
const cartManager = new CartManager();
const productManager = new ProductManager(); 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());
initializePassport();

app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");


const httpServer = app.listen(PORT,()=>{
    displayRoutes(app)
    console.log("escuchando en el puerto:" +PORT)
});

const stats = async ()=> {
    const resp= await productsModel.find({status:true}).explain("executionStats");
    console.log(resp)
}
// stats()


app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("/contacto", contactRouter)


const io = new Server(httpServer);

io.on("connection", async (socket) => {

    socket.emit("products",  await productManager.getProducts({page:1, limit:5}));

    socket.on('getProducts', async ({ page= 1, limit= 5 } = {}) => {
        try {
            const productsData = await productManager.getProducts({ page, limit });
            socket.emit('products', productsData);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            socket.emit('error', 'Error fetching products');
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de producto no proporcionado");
                return;
            }

            const deletedProduct = await productManager.deleteProduct(id);

            if (!deletedProduct) {
                socket.emit("error", "Producto no encontrado");
                return;
            }

            io.sockets.emit("products", await productManager.getProducts({ page: 1, limit: 5 }));
            
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("error", "Error al eliminar el producto"); 
        }
    })

    socket.on("addProduct", async (product) => {

        const { name, brand, description, price, img, category, code, stock, status } = product;
        try {
            const productDTO = new ProductDTO(name, brand, description, price, img, category, code, stock, status);

            const newProduct = await productManager.addProduct(productDTO);

            io.sockets.emit("products", await productManager.getProducts({ page: 1, limit: 5 }));

        } catch (error) {
            console.error("Error al agregar el producto:", error);
            socket.emit("error", "Error al agregar el producto");
        }
    })

    socket.emit("carts", await cartManager.getCarts());

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

            io.sockets.emit(cartManager.getCarts());

        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito");
        }
    })

    socket.on("deleteProdCart", async (prodId, id) => {

        try {
            if (!id) {
                socket.emit("error", "ID de carrito no proporcionado");
                return;
            }

            const deletedProd = await cartManager.removeProdCart(id, prodId);
            
            if (!deletedProd) {
                socket.emit("error", "Carrito no encontrado");
                return;
            }

            io.sockets.emit(cartManager.getCarts());
            
        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito");
        }
        
    })

    //Agregado de productos al carrito de cliente 
    socket.on('addProdToCart', async ({ cartId, products }) => {
        try {
            if (!Array.isArray(products)) {
                throw new Error('Products should be an array');
            }

            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await cartManager.getCartById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            products.forEach(product => {
                const existingProduct = cart.products.find(p => p.id.toString() === product.id);
                if (existingProduct) {
                    existingProduct.quantity += product.quantity;
                } else {
                    cart.products.push({ product: product.id, quantity: product.quantity });
                }
            });
            await cart.save();
            
            socket.emit('redirect', { url: `/cart/${cartId}` });
            
            }
        catch (error) {
            console.error('Error generando carrito:', error);
            socket.emit('error', { message: 'Error agregando productos' });
        }

    })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const categorys = async() => {
        
    const result= await productsModel.aggregate([
    {
        $match: {
            category: "contrastes"
        }
    },
    {   
        $group: {
            _id: "$name",
            total: {
                $sum:"$price"
            }
        }
    },
    {
        $sort: {
            total: 1
            // 1 asc
            //-1 desc
        }
    }
    ])
    
    console.log(result)
}
// categorys()

const pagination = async ()=> {

    const pag = await productsModel.paginate({},

    {limit:5, page: 1}
    )

    console.log(pag)

}
// pagination()
