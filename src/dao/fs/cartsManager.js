import { promises as fs } from "fs";

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;

        this.readCarts();
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //Verifico si hay por lo menos un carrito creado:
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
                //Utilizo el método map para crear un nuevo array que solo tenga los identificadores del carrito y con Math.max obtengo el mayor. 
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error);
            // Si no existe el archivo, lo voy a crear. 
            await this.writeCarts();
        }
    }

    async writeCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart(data) {
        
        const newCart = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(newCart);

        if(data.length>0){
            newCart.products.push(data);
        }

        // Guardamos el array en el archivo
        await this.writeCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProdToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const productExist = cart.products.find(p => p.product === productId);

        if (productExist) {
            productExist.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.writeCarts();
        return cart;
    }
}

export default CartManager;