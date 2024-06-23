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