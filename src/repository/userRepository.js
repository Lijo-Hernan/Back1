import UserDAo from "../dao/user.dao.js";


class UserRepository {
    async createUser(userData) {
        return await UserDAo.save(userData);
        
    }

    async findById(id) {
        return await UserDAo.findById(id);
    }

    async getUserByEmail(email) {
        return await UserDAo.findOne({ email });
    }
}

export default new UserRepository();


