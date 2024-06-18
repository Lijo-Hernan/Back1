import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async readFile() {
        try {
            const resp = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(resp);
            return products;
        } catch (error) {
            console.log("Error al leer un archivo", error);
            throw error;
        }
    }

    async writeFile(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }


    async addProduct({ name, brand, description, price, img, code, stock, category, status}) {
        try {
            const products = await this.readFile();

            if (!name || !brand || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            if (products.some(item => item.code === code)) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = {
                name,
                brand,
                description,
                price,
                img,
                code,
                stock,
                category,
                status, 
            };

            if (products.length > 0) {
                ProductManager.ultId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            newProduct.id = ++ProductManager.ultId;
            
            products.push(newProduct);
            await this.writeFile(products);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }
    async getProducts() {
        try {
            const products = await this.readFile();
            return products;
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.readFile();
            const buscado = products.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }



    async updateProduct(id, productUpdate) {
        try {
            const products = await this.readFile();

            const index = products.findIndex(item => item.id === id);

            if (index !== -1) {
                products[index] = { ...products[index], ...productUpdate };
                await this.writeFile(products);
                console.log("Producto actualizado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.readFile();

            const index = products.findIndex(item => item.id === id);

            if (index !== -1) {
                products.splice(index, 1);
                await this.writeFile(products);
                console.log("Producto eliminado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;