import { Router } from "express";
import fs from "fs"
import path from "path"
import ProductManager from "../manager/productManager.js";

const router = Router(); 

const productManager = new ProductManager("./src/public/files/products.json");

const productsFilePath = path.resolve("./src/public/files/products.json");


router.get("/", (req,res)=>{
    const data = fs.readFileSync(productsFilePath, "utf-8");
    const prods= JSON.parse(data)

    const {limit} = req.query;

    if(limit){
        res.json(prods.slice(0, limit));
    }else {
        res.json(prods)
    }
})


// router.get("/:pid", (req, res) => {

//     let {pid} = req.params; 
//     const data = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(data)
//     let productFinded = prods.find(product => product.id === parseInt(pid)); 

//     if (productFinded) {
//         res.send(productFinded);
//     } else {
//         res.send("Producto no encontrado")
//     }
// })

router.get("/:pid", async (req, res) => {
    
    let id = req.params.pid;

    try {
        const productFinded = await productManager.getProductById(parseInt(id));
        if (!productFinded) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(productFinded);

    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


// router.post("/", (req, res)=> {
    
//     const newProduct = req.body

//     const data = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(data)

//     if(!newProduct.name || !newProduct.brand || !newProduct.description || !newProduct.price || !newProduct.img || !newProduct.categorie || !newProduct.code || !newProduct.stock || !newProduct.status ) {
//         res.status(400).json({ error: "Complete todos los campos"}).send("Complete todos los campos");
//         return
//     }

//     if (prods.some(item=>item.code === newProduct.code )){
//         res.status(400).send("El codigo debe ser unico");
//         return; 
//     }
    
//     let id = prods[prods.length - 1].id + 1
//     prods.push({id, ...newProduct })
//     fs.writeFileSync(productsFilePath, JSON.stringify(prods, null, 2));
//     res.status(201).json({ id })
//     })

router.post("/", async (req, res) => {
    const newProduct = req.body;
    
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: `Producto agregado exitosamente`
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// router.delete("/:pid", (req, res) => {
//     const id = parseInt(req.params.pid);

//     const data = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(data)

//     const productFound = prods.find(p => p.id === id);

//     if(productFound) {
//         const index = prods.findIndex(u => u.id === id);
//         prods.splice(index, 1)
//         fs.writeFileSync(productsFilePath, JSON.stringify(prods, null, 2));
//         res.send("Producto con id " + id + " eliminado con exito")
//         } else {
//         res.status(404).json({ error: "PRODUCTO NO ENCONTRADO"})
//         }
// })

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({
            message: "Producto eliminado exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});


// router.put("/:pid", (req,res)=>{
//     const id=parseInt(req.params.pid);
//     const { name, brand, description, price, img, categorie, code, stock, status } = req.body;

//     const data = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(data)

//     const productFound = prods.find(p => p.id === id);

//     if(productFound){
//         const index = prods.findIndex(p => p.id === id);

//         prods[index] = { ...prods[index], name, brand, description, price, img, categorie, code, stock, status }
//             res.json({
//             message: "Producto actualizado con exito!",
//             response: prods[index]
//             })
//         fs.writeFileSync(productsFilePath, JSON.stringify(prods, null, 2));

//     } else {
//         res.status(404).json({ error: "PRODUCTO NO ENCONTRADO"})
//     }

// })

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



export default router; 