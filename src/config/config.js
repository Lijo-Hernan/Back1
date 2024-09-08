import dotenv from "dotenv";

dotenv.config();

const configObject= {
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    MONGO_URL: process.env.MONGO_URL
}

export default configObject