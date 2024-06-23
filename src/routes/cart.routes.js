import { Router } from "express";
import fs from "fs";
import path from "path";
import CartManager from "../manager/cartsManager.js";

const router = Router(); 

const cartsFilePath = path.resolve("./src/public/files/carts.json");
const productsFilePath = path.resolve("./src/public/files/products.json");
const cartManager = new CartManager("./src/public/files/carts.json");

router.get("/", (req, res) => {
    const {limit} = req.query;
    
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    const carts= JSON.parse(data)

    if(limit){
        res.json(carts.slice(0, limit));
    }else {
        res.json(carts);
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);

    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (req, res) => {

    const products = req.body

    try {
        const newCart = await cartManager.createCart(products);
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity) || 1;

    try {
        const updateCart = await cartManager.addProdToCart(cartId, prodId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router; 