import ProductRepository from "../repository/productRepository.js";
import MongoDBProductDAO from "../dao/mongoDBProductDAO.js";

class ProductService {

    constructor(ProductRepository){
        this.ProductRepository= ProductRepository;

    }
    
    async getProducts(){
        return await this.ProductRepository.getProducts();
    }

    async addProduct(data){
        return await this.ProductRepository.addProduct(data);
    }

}

const dao = new MongoDBProductDAO(); 
console.log(dao); 
export const productService = new ProductService(new ProductRepository(dao)); 
