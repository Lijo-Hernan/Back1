import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router(); 

const cartsFilePath = path.resolve("./src/public/files/carts.json");
const productsFilePath = path.resolve("./src/public/files/products.json");

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

router.get("/:cid", (req, res) => {

    let {cid} = req.params; 
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    const carts= JSON.parse(data)
    let cartFinded = carts.find(cart => cart.id === parseInt(cid)); 

    if (cartFinded) {
        res.send(cartFinded);
    } else {
        res.send("carrito no encontrado").status(404)
    }
})


router.post("/", (req, res) => {
    
    const products = req.body
    
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    const carts= JSON.parse(data)

    let id;
    if (carts.length === 0) {
        id = 1; } 
    else {
        id = carts[carts.length - 1].id + 1; 
    }

    const newCart = { id, products };
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    res.status(201).json({ message: `carrito ${id} creado correctamente`});
});



router.post("/:cid/product/:pid", (req, res) => {
    
    let {cid} = req.params; 
    let {pid} = req.params; 

    const dataC = fs.readFileSync(cartsFilePath, "utf-8");
    const carts= JSON.parse(dataC)

    const dataP = fs.readFileSync(productsFilePath, "utf-8");
    const prods= JSON.parse(dataP)

    const cart = carts.find((c) => c.id === parseInt(cid));
    if (!cart) {
        res.status(404).json({
        message: `No se eoncontro el carrito: ${cid} `,
        });
        
    }

    const product = prods.find((p) => p.id === parseInt(pid));
    if (!product) {
        res.status(404).json({
        message: `No se encotro el producto: ${pid}`,
        });
    }

    const productIndex = cart.products.findIndex(
        (p) => p.prodId === parseInt(pid)
    );
    if (productIndex === -1) {
        cart.products.push({ prodId: parseInt(pid), quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    res.status(201).json(cart);
});

export default router; 