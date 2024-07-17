import { Router } from "express";
import fs from "fs"
import path from "path"
import ProductManager from "../dao/db/productManagerDb.js";

const router = Router(); 

const productManager = new ProductManager();

const productsFilePath = path.resolve("./src/public/files/products.json");


router.get("/", async (req,res)=>{
    
    try {
        
        const limit = parseInt(req.query.limit, 10)|| 5;
        const page = parseInt(req.query.page, 10)|| 1;
        
        const products= await productManager.getProductsApi(page, limit);

        // if(limit){
        //     res.status(200).json(products.slice(0,limit));
        // }else {
        //     res.status(200).json(products);
        // }
        res.status(200).json(products);

    } catch (error) {
        console.error("error al limitar la lista", error)
        res.status(500).send("error de servidor");
    }

    
})

// router.get("/", async (req,res)=>{

//     const limit = parseInt(req.query.limit, 10);

//     try {
//         let products

//         if(!isNaN(limit)&& limit>0){
//             products= await productsModel.find().limit(limit)
//         }else {
//             products= await productsModel.find()
//         }

//         res.status(200).json(products)

//     } catch (error) {
//         console.error("error al limitar la lista", error)
//         res.status(500).send("error de servidor");
//     }

    
// })

// router.get("/", (req,res)=>{
//     const data = fs.readFileSync(productsFilePath, "utf-8");
//     const prods= JSON.parse(data)

//     const {limit} = req.query;

//     if(limit){
//         res.json(prods.slice(0, limit));
//     }else {
//         res.json(prods)
//     }
// })



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

// router.get("/:pid", async (req, res) => {
    
//     let id = req.params.pid;

//     try {
//         const productFinded = await productManager.getProductById(parseInt(id));
//         if (!productFinded) {
//             return res.json({
//                 error: "Producto no encontrado"
//             });
//         }

//         res.json(productFinded);

//     } catch (error) {
//         console.error("Error al obtener producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

router.get("/:pid", async (req, res) => {
    
    try {
        const productFinded = await productManager.getProductById(req.params.pid)

        if (!productFinded) {
            return res.status(404).json({error: "Producto no encontrado"}).status(404);
            }
        res.status(200).json(productFinded);

    } catch (error) {
        console.error("prod no encontrado", error);

        res.status(500).send("Error interno del servidor");
    }
});

// router.get("/:pid", async (req, res) => {
    
//     try {
//         const productFinded = await productsModel.findById(req.params.pid)
//         if (!productFinded) {
//             return res.status(404).json({error: "Producto no encontrado"}).status(404);
//             }
//         res.status(200).json(productFinded);

//     } catch (error) {
//         console.error("prod no encontrado", error);

//         res.status(500).send("Error interno del servidor");
//     }
// });


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
    
    try {
        const newProduct = await productManager.addProduct(req.body);

        
        res.status(201).send(`Producto agregado exitosamente`);

    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).send(`Error interno del servidor: ${error} `);
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

// router.delete("/:pid", async (req, res) => {
//     const id = req.params.pid;

//     try {
//         await productManager.deleteProduct(parseInt(id));
//         res.json({
//             message: "Producto eliminado exitosamente"
//         });
//     } catch (error) {
//         console.error("Error al eliminar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

// router.delete("/:pid", async (req, res) => {

//     try {
//         const product = await productModel.findByIdAndDelete(req.params.id);
//         res.json({
//             message: "Producto eliminado exitosamente"
//         });
//     } catch (error) {
//         console.error("Error al eliminar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

// router.delete("/:pid", async (req, res) => {

//     try {
//         const product = await productsModel.findByIdAndDelete(req.params._id)

//         res.status(200).send("Producto borrado exitosamente");

//     } catch (error) {
//         console.error("Error al eliminar producto", error);

//         res.status(500).send("Error interno del servidor");
//     }
// });

router.delete("/:pid", async (req, res) => {

    try {
        const productFinded = await productManager.deleteProduct(req.params.pid)
        if (!productFinded) {
            return res.status(404).json({error: "Producto no encontrado"}).status(404);
            }
        res.status(200).send("Producto eliminado correctamente");

    } catch (error) {
        console.error("prod no encontrado", error);

        res.status(500).send("Error interno del servidor");
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

// router.put("/:pid", async (req, res) => {
//     const id = req.params.pid;
//     const updatedProduct = req.body;

//     try {
//         await productManager.updateProduct(parseInt(id), updatedProduct);
//         res.json({
//             message: "Producto actualizado exitosamente"
//         });
//     } catch (error) {
//         console.error("Error al actualizar producto", error);
//         res.status(500).json({
//             error: "Error interno del servidor"
//         });
//     }
// });

router.put("/:pid", async (req, res) => {

    const id= req.params.pid;
    const productUpdate = req.body

    try {

        await productManager.updateProduct(id, productUpdate);

        res.status(200).json({message: "Product actualizado exitosamente"});

    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



export default router; 