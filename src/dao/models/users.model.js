import mongoose from "mongoose";

const colection = "users";

const usersSchema = new mongoose.Schema ({

    usuario: String,
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    edad:Number,
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        default: null
    }
})

const UsersModel = mongoose.model(colection, usersSchema)

export default UsersModel;
