import mongoose from "mongoose"


mongoose.connect("mongodb+srv://lijohernanpablo:1468gpasrl@cluster0.2ijqoo0.mongodb.net/Ecomerce2024")
    .then(()=> console.log("conectado a mongo"))
    .catch((error)=>console.log("error de coneccion:", error))
