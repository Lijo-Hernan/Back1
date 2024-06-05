import { Router } from "express";
const router = Router(); 


const cart = [
    {
        "id":1,
        "prodId":1,
        "quantity": 3
    }
];


router.get("/", (req, res) => {
    res.json(cart);
})

router.post("/addProduct", (req, res)=> {

    const newIdProduct = req.body;

    if(!newIdProduct.prodId ) {
        res.status(400).json({ error: "No se pudo agregar al carrito"}).send("No se pudo agregar al carrito");
        return
    }

    if (cart.some(item=>item.prodId === newIdProduct.prodId )){
        res.status(400).send("El producto ya esta en el carrito");
        return; 
    }

    
    let id = cart[cart.length - 1].id + 1
    cart.push({id, ...newIdProduct })
    
    res.status(201).json({ id })
    })



export default router; 