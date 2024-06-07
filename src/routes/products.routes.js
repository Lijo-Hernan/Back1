import { Router } from "express";
const router = Router(); 


const products = [
    {
        "id": 1,
        "name":"Temistac contraste oral",
        "brand":"Temistac",
        "description":"Contraste oral hidrosoluble en frasco de 125 ml ",
        "price":"47658.80",
        "img":"imagen",
        "categorie":"contrastes",
        "code": "abc123",
        "stock":80,
        "status": true
    },
    {
        "id": 2,
        "name":"Contraste Endovenoso ",
        "brand":"Xenetix",
        "description":"Contraste endovenoso en frascos de 500ml ",
        "price":"769017.58",
        "img":"imagen",
        "categorie":"contrastes",
        "code": "abc124",
        "stock":0,
        "status": true
    },
];


router.get("/", (req, res) => {
    res.json(products);
})

router.get("/:pid", (req, res) => {

    let {id} = req.params; 
    let productFinded = products.find(product => product.id === parseInt(id)); 

    if (productFinded) {
        res.send(productFinded);
    } else {
        res.send("Producto no encontrado")
    }
})

router.post("/newProduct", (req, res)=> {
    
    const newProduct = req.body

    if(!newProduct.name || !newProduct.brand || !newProduct.description || !newProduct.price || !newProduct.img || !newProduct.categorie || !newProduct.code || !newProduct.stock || !newProduct.status ) {
        res.status(400).json({ error: "Complete todos los campos"}).send("Complete todos los campos");
        return
    }

    if (products.some(item=>item.code === newProduct.code )){
        res.status(400).send("El codigo debe ser unico");
        return; 
    }

    
    let id = products[products.length - 1].id + 1
    products.push({id, ...newProduct })
    
    res.status(201).json({ id })
    })

router.delete("/deleteProduct/:pid", (req, res) => {
    const id = parseInt(req.params.id);

    const productFound = products.find(p => p.id === id);

    if(productFound) {
        const index = products.findIndex(u => u.id === id);
        products.splice(index, 1)
        res.send("Usuario con id " + id + " eliminado con exito")
        } else {
        res.status(404).json({ error: "PRODUCTO NO ENCONTRADO"})
        }
})

router.put("/editProduct/:pid", (req,res)=>{
    const id=parseInt(req.params.id);
    const { name, brand, description, price, img, categorie, code, stock, status } = req.body;

    const productFound = products.find(p => p.id === id);

    if(productFound){
        const index = products.findIndex(p => p.id === id);

        products[index] = { ...products[index], name, brand, description, price, img, categorie, code, stock, status }
        res.json({
        message: "Producto actualizado con exito!",
        response: products[index]
    })

    } else {
        res.status(404).json({ error: "PRODUCTO NO ENCONTRADO"})
    }

})


export default router; 