import mongoose from "mongoose";
import { userModel } from "./models/users.models.js";

class usersManagerDB {
  async getUser(query) {
    if (typeof query === 'string') {
      if (!mongoose.Types.ObjectId.isValid(query)) {
        throw new Error('Invalid user ID');
      }
      return userModel.findOne({ _id: query });
    }
    return userModel.findOne(query);
  }

  async getUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

  async createUser(newUser) {
    return userModel.create(newUser); // Utiliza userModel.create para crear un nuevo usuario
  }
}

export default usersManagerDB