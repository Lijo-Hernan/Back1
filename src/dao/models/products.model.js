import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const colection = "products";

const productSchema = new mongoose.Schema ({

    name:{ 
        type:String,
        required:true,
        index: true
    },
    brand: { 
        type:String,
        required:true
    },
    fullname: { 
        type:String,
        required:true
    },
    description: { 
        type:String,
        required:true
    },
    price: { 
        type:Number,
        required:true,
        index:true
    },
    img: { 
        type:String,
        required:true
    },
    category: { 
        type:String,
        required:true,
        index: true
    },
    code: { 
        type:String,
        required:true,
        unique: true
    },
    stock: { 
        type:Number,
        required:true
    },
    status: { 
        type:Boolean,
        required:true
    },
    thumbnails :{
        type: [String]
    }

})

productSchema.plugin(paginate)

const productsModel = mongoose.model(colection, productSchema)

export default productsModel;