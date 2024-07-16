import { Router } from "express";
import fs from "fs";
import path from "path";
import CartManager from "../dao/db/cartManagerDb.js";
import cartsModel from "../dao/models/carts.model.js";

const router = Router(); 

const cartsFilePath = path.resolve("./src/public/files/carts.json");
const productsFilePath = path.resolve("./src/public/files/products.json");
const cartManager = new CartManager();

router.get("/", async (req,res)=>{

    const limit = parseInt(req.query.limit, 10);

    try {
        
        const carts= await cartManager.getCarts();

        if(limit){
            res.status(200).json(carts.slice(0,limit));
        }else {
            res.status(200).json(carts);
        }

    } catch (error) {
        console.error("error al limitar la lista", error)
        res.status(500).send("error de servidor");
    }

    
})

// router.get("/", (req, res) => {
//     const {limit} = req.query;
    
//     const data = fs.readFileSync(cartsFilePath, "utf-8");
//     const carts= JSON.parse(data)

//     if(limit){
//         res.json(carts.slice(0, limit));
//     }else {
//         res.json(carts);
//     }
// })

// router.get("/:cid", (req, res) => {

//     let {cid} = req.params; 
//     const data = fs.readFileSync(cartsFilePath, "utf-8");
//     const carts= JSON.parse(data)
//     let cartFinded = carts.find(cart => cart.id === parseInt(cid)); 

//     if (cartFinded) {
//         res.send(cartFinded);
//     } else {
//         res.send("carrito no encontrado").status(404)
//     }
// })

router.get("/:cid", async (req, res) => {

    const id = req.params.cid

    try {
        const cartFinded = await cartManager.getCartById(id);
        if (!cartFinded) {
            return res.status(404).json({error: "Carrito no encontrado"}).status(404);
            }
        res.status(200).json(cartFinded);

    } catch (error) {
        console.error("Cart no encontrado", error);

        res.status(500).send("Error interno del servidor");
    }
});


// router.post("/", (req, res) => {
    
//     const products = req.body
    
//     const data = fs.readFileSync(cartsFilePath, "utf-8");
//     const carts= JSON.parse(data)

//     let id;
//     if (carts.length === 0) {
//         id = 1; } 
//     else {
//         id = carts[carts.length - 1].id + 1; 
//     }

//     const newCart = { id, products };
//     carts.push(newCart);
//     fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

//     res.status(201).json({ message: `carrito ${id} creado correctamente`});
// });

// router.post("/", async (req, res) => {

//     const products = req.body
//     const {prodId, quantity} = req.body


//     try {
//         const updateCart = await cartsModel.addProdToCart(prodId, quantity);
//         res.json(updateCart);
//     } catch (error) {
//         console.error("Error al crear un nuevo carrito", error);
//         res.status(500).json({ error: "Error interno del servidor" });
//     }
// });



// router.post("/:cid/product/:pid", (req, res) => {
    
//     let {cid} = req.params; 
//     let {pid} = req.params; 

//     const dataC = fs.readFileSync(cartsFilePath, "utf-8");
//     const carts= JSON.parse(dataC)

//     const dataP = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(dataP)

//     const cart = carts.find((c) => c.id === parseInt(cid));
//     if (!cart) {
//         res.status(404).json({
//         message: `No se eoncontro el carrito: ${cid} `,
//         });
        
//     }

//     const product = prods.find((p) => p.id === parseInt(pid));
//     if (!product) {
//         res.status(404).json({
//         message: `No se encotro el producto: ${pid}`,
//         });
//     }

//     const productIndex = cart.products.findIndex(
//         (p) => p.prodId === parseInt(pid)
//     );
//     if (productIndex === -1) {
//         cart.products.push({ prodId: parseInt(pid), quantity: 1 });
//     } else {
//         cart.products[productIndex].quantity += 1;
//     }

//     fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

//     res.status(201).json(cart);
// });

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const quantity = parseInt(req.query.quantity) || 1;

    try {
        const updateCart = await cartManager.addProdToCart(cartId, prodId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid", async (req, res) => {

    try {
        const cartFinded = await cartManager.deleteCart(req.params.cid)

        if (cartFinded) {
            return res.status(404).json({error: "Carrito no encontrado"}).status(404);
            }
        res.status(200).send("Carrito eliminado correctamente");

    } catch (error) {
        console.error("cart no encontrado", error);

        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const prodId = req.params.pid;

    try {
        const updatedCart = await cartManager.removeProdCart(cartId, prodId);
        res.json(updatedCart.products);
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product', async (req, res)=>{
    const cartId = req.params.cid;

    try {
        const emptyCart= await cartManager.emptyCart(cartId);
        res.json({message: "Carrito vacio"})
        
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})


export default router; 