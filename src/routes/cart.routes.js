import { Router } from "express";
const router = Router(); 


const cart = [];


router.get("/", (req, res) => {
    res.json(cart);
})

router.post("/", (req, res) => {
    const newIdProduct = req.body;
    users.push(newIdProduct);
    res.send("Producto agregado correctamente correctamente al carrito");
})



export default router; 