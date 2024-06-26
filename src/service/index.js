import { ProductDaosMongo } from "../daos/productsDao.mongo.js";
import usersManagerDB from "../daos/usersDao.mongo.js"

export const productService = new ProductDaosMongo()
export const userService = new usersManagerDB()