import userRepository from "../repository/userRepository.js";
import { createHash, isValidPassword } from "../utils/util.js";

class UserService { 

    async newUser(userData) {
        const userExist = await userRepository.getUserByEmail(userData.email);
        if(userExist){
            throw new Error("El usuario ya existe");
        }
        userData.password = createHash(userData.password);
        return await userRepository.createUser(userData);
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email);
        if(!user|| !isValidPassword(password, user)) 
            throw new Error("Credenciales incorrectas");
        return user;        
        }       
    
    }
    
export default new UserService();