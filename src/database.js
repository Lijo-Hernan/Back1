import mongoose from "mongoose"
import configObject from "./config/config.js"

const {MONGO_URL}= configObject;

// mongoose.connect(MONGO_URL)
//     .then(()=> console.log("conectado a mongo por .env"))
//     .catch((error)=>console.log("error de coneccion:", error))

// mongoose.connect("mongodb+srv://lijohernanpablo:1468gpasrl@cluster0.2ijqoo0.mongodb.net/Ecomerce2024")
//     .then(()=> console.log("conectado a mongo"))
//     .catch((error)=>console.log("error de coneccion:", error))

class BaseDatos {
    static #instancia; 
    //Se declara una variable estaticaa y privada llamada instancia. 
    constructor() {
        mongoose.connect(MONGO_URL);
    }

    static getInstancia() {
        if(this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia;
        } 
        this.#instancia = new BaseDatos();
        console.log("Conexion exitosa"); 
        return this.#instancia; 
    }
}

export default BaseDatos.getInstancia(); 