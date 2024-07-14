import mongoose from "mongoose";


const colection = "carts";

const cartSchema = new mongoose.Schema ({

    products: [

        {
            productId: {
                // type:String,
                type: mongoose.Schema.Types.ObjectId,
                ref:"products",
                required: true
            },
            quantity: { 
                type: Number, 
                required: true 
            }
        
    }]
    
})

// Método para añadir un producto al carrito
cartSchema.statics.addProdToCart = async function(cartId, prodId, quantity) {
    console.log(cartId,prodId, quantity)
    let cart;
    // Si el cartId es válido, intenta encontrar el carrito por ID
    if (mongoose.Types.ObjectId.isValid(cartId)) {
        cart = await this.findById(cartId).populate("products.productId");
    }

    // Si no existe el carrito, crea uno nuevo
    if (!cart) {
        cart = new this({ products: [] });
    }

    // Busca el producto en el carrito
    const productIndex = cart.products.findIndex(p => {
        if (typeof p.productId === 'object') {
            return p.productId._id.toString() === prodId.toString();
        } else {
            return p.productId.toString() === prodId.toString();
        }
    });

    if (productIndex !== -1) {
        // Si el producto ya está en el carrito, actualiza la cantidad
        cart.products[productIndex].quantity += quantity;
    } else {
        // Si el producto no está en el carrito, añádelo
        cart.products.push({ productId: prodId, quantity: quantity});
    }

    // Guarda los cambios en el carrito
    await cart.save();

    return cart;
};

// Método para eliminar un producto del carrito
cartSchema.statics.removeProdFromCart = async function(cartId, prodId) {
    // Encuentra el carrito por ID
    const cart = await this.findById(cartId);

    if (!cart) {
        throw new Error('Carrito no encontrado');
    }

    // Filtra el array de productos para eliminar el producto con el productId dado
    cart.products = cart.products.filter(p => p.productId !== prodId._id);

    // Guarda los cambios en el carrito
    await cart.save();

    return cart;
};

//creo nuevo carrito desde la pagina
cartSchema.statics.addProdToCartPage = async function(products) {
    
    let cart = new this({products: [] });

    for (let { productId, quantity } of products) {
        // Busca el producto en el carrito
        const productIndex = cart.products.findIndex(p => {
            if (typeof p.productId === 'object') {
                return p.productId._id.toString() === productId.toString();
            } else {
                return p.productId.toString() === productId.toString();
            }
        });

        cart.products.push({ productId: mongoose.Types.ObjectId(productId), quantity: quantity });
    }
    await cart.save();

    return cart;
};


cartSchema.pre("findOne", function(next) {
    this.populate("products.productId");
    next(); 
})


const cartsModel = mongoose.model(colection, cartSchema)

export default cartsModel;