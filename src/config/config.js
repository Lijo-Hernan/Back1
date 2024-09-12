import dotenv from "dotenv";
import program from "../utils/commander.js";

const {mode} = program.opts(); 

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion":"./.env.desarrollo"
});


const configObject= {
        PORT: process.env.PORT,
        MODE: process.env.MODE,
        MONGO_URL: process.env.MONGO_URL,
        persistence: process.env.PERSISTENCE || "file"
}

export default configObject
