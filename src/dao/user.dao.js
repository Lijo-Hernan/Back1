import userModel from "../dao/models/users.model.js";

class UserDAo {
    async findByID(id) {
        return await userModel.findById(id);
    }
    async findOne(query) {
        return await userModel.findOne(query);
    }
    async save(userData) {
        const user = new userModel(userData);
        return await user.save();
    }
}
    export default UserDAo