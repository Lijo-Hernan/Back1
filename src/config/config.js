import dotenv from "dotenv";

dotenv.config();

import program from "../utils/commander.js";

const {mode} = program.opts(); 

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion": "./.env.desarrollo"
});


const configObject= {
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    MONGO_URL: process.env.MONGO_URL
}

export default configObject