import ProductModel from "./models/products.model.js";

class MongoDBProductDAO {

    async addProduct(data){
        try {
            const product = new ProductModel(data); 
            return await product.save(); 
        } catch (error) {
            console.error("Error al crear el producto en MongoDB", error);
            throw new Error("Error al crear el producto en MongoDB");
        }
    }

    async getProducts(){
        try {
            return await ProductModel.find(); 
        } catch (error) {
            console.error("Error al obtener los productos desde MongoDB", error);
            throw new Error("Error al obtener los producto desde MongoDB");
        }

    }

}

export default MongoDBProductDAO;