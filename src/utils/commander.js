import { Command } from "commander";

const program = new Command();

program 
    .option("-p <port>", "Puerto del servidor", 8080)
    .option("--mode", "modo de trabajo", "produccion")
program.parse;

export default program;