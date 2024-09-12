import mongoose from "mongoose"
import configObject from "./config/config.js"

const {MONGO_URL}= configObject;

class DB {
    static #instancia; 
    
    constructor() {
        mongoose.connect(MONGO_URL);
    }

    static getInstancia() {
        if(this.#instancia) {
            console.log("Conexion previa");
            return this.#instancia;
        } 
        this.#instancia = new DB();
        console.log("Conexion exitosa"); 
        return this.#instancia; 
    }
}

export default DB.getInstancia(); 