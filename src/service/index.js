import { ProductDaosMongo } from "../daos/MONGO/MONGODBNUBE/productsDao.mongo.js";
import usersDaoMongo from "../daos/MONGO/MONGODBNUBE/usersDao.mongo.js"
import CartDaoMongo from "../daos/MONGO/MONGODBNUBE/cartsDao.mongo.js";

export const productService = new ProductDaosMongo()
export const userService = new usersDaoMongo()
export const cartService = new CartDaoMongo()