import { connect } from 'mongoose';

export class MongoSingleton {
    static #instance
    constructor(){
        //connect('mongodb+srv://ladrianfer87:u7p7QfTyYPoBhL9j@cluster0.8itfk8g.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
        connect('mongodb://localhost:27017/ecommerce')
    }

    static getInstance(){
        if(this.#instance){
            console.log('La base de datos ya se encuentra conectada');
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('base de datos conectada')
        return this.#instance;
    }
}
