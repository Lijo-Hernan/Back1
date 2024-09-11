import fs from "fs";

class FileSystemPorductDAO {
    
    async createProduct(data) {
        try { 
            const products = await this.readFile(); 
            products.push(data);
            await this.writeFile(products);
            return data; 
            
        } catch (error) {
            throw new Error("Error al crear producto en archivo"); 
        }
    }

    async getProducs() {
        try {
            const products = await this.readFile(); 
            return products; 
        } catch (error) {
            throw new Error("Error al obtener productos del archivo"); 
        }
    }

    async readFile() {
        try {
            const data = await fs.promises.readFile("./src/public/files/products.json");
            return JSON.parse(data); 
        } catch (error) {
            throw new Error("Error al leer el archivo de productos"); 
        }
    }

    async writeFile(data) {
        try {
            await fs.promises.writeFile("./src/public/files/products.json", JSON.stringify(data, null, 2));
        } catch (error) {
            throw new Error("Error al escribir el archivo de productos"); 
        }
    }
}

export default FileSystemPorductDAO;