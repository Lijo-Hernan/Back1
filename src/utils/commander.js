import { Command } from "commander";

const program = new Command();

// comando, descripcion, valor
program 
    .option("-p <port>", "Puerto del servidor", 8080)
    .option("--mode", "modo de trabajo", "desarrollo")
program.parse;

//para verificar opciones
//console.log("Options: ", program.opts())

export default program;