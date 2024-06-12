import { userModel } from "./models/users.models.js";

export class usersManagerDB {
  constructor(){
    this.model = userModel;
    }

    // async getUser(filter) {
    //     if (!this.model) {
    //         throw new Error('Model is not defined');
    //     }
    //     return await this.model.findOne(filter);
    // }

    // async createUser(newUser) {
    //     if (!this.model) {
    //         throw new Error('Model is not defined');
    //     }
    //     return await this.model.create(newUser);
    // }
    getUser = async filter => await this.model.findOne(filter)
    createUser = async newUser => await this.model.create(newUser)
}