import mongoose from "mongoose";

const colection = "carts";

const cartSchema = new mongoose.Schema ({
    
})

const cartsModel = mongoose.model(colection, cartSchema)

export default cartsModel;