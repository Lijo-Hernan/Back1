import mongoose from "mongoose";

const colection = "products";

const productSchema = new mongoose.Schema ({

    name: String,
    brand: String,
    description: String,
    price: Number,
    img: String,
    category: String,
    code: String,
    stock: Number,
    status: Boolean
})

const productsModel = mongoose.model(colection, productSchema)

export default productsModel;