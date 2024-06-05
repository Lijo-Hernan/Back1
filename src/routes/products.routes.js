import { Router } from "express";
const router = Router(); 


const products = [];


router.get("/", (req, res) => {
    res.json(products);
})

router.post("/", (req, res) => {
    const newProduct = req.body;
    users.push(newProduct);
    res.send("Producto agregado correctamente correctamente");
})



export default router; 