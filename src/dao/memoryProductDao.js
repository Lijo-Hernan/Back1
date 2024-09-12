class MemoryProductDAO {
    constructor() {
        this.products = []
    }

    async createPorduct(data){
        try {
            this.products.push(data);
            return data; 
        } catch (error) {
            throw new Error("Error al crear en producto en Memoria"); 
        }
    }

    async getProducts(){
        try {
            return this.products; 
        } catch (error) {
            throw new Error("Error al obtener los produtos de memoria");
        }
    }

}

export default MemoryProductDAO; 