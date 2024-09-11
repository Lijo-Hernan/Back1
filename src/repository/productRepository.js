class ProductRepository {

    constructor(dao) {
        this.dao = dao;
    
    }

    async getProducts(){
        return this.dao.getProducts();

    }

    async addProduct(data){
        return this.dao.addProduct(data)

    }

}

export default ProductRepository