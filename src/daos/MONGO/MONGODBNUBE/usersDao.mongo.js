import mongoose from "mongoose";
import { userModel } from "../../models/users.models.js";

class usersDaoMongo {
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

  async getUsers() {
    return userModel.find();
  }

  async createUser(newUser) {
    return userModel.create(newUser);
  }

  async updateUser(id, userData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.updateOne({ _id: id }, { $set: userData });
  }

  async deleteUser(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.deleteOne({ _id: id });
  }
}

export default usersDaoMongo