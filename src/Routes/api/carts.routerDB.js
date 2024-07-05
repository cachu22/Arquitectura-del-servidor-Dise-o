import { Router } from "express";
import CartController from "../../controllers/cart.controller.js";
import { adminOrUserAuth } from "../../middlewares/Auth.middleware.js"

const cartsRouterMSG = Router();
const cartController = new CartController();

// Ruta para traer todos los carros
cartsRouterMSG.get('/', cartController.getAllCarts);

// Ruta para traer un carro por su id
cartsRouterMSG.get('/:cid', adminOrUserAuth, cartController.getCartById);

// Ruta POST para crear un nuevo carrito
cartsRouterMSG.post('/', cartController.createCart);

// Ruta para agregar productos al carrito
cartsRouterMSG.post('/:cid/product/:pid', cartController.addProductToCart);

// Ruta PUT para actualizar un carrito con un arreglo de productos
cartsRouterMSG.put('/:cid', cartController.updateCartWithProducts);

// Ruta para actualizar la cantidad de un producto en el carrito
cartsRouterMSG.put('/:cid/products/:pid', cartController.updateProductQuantity);

// Ruta para eliminar un producto de un carrito en DB
cartsRouterMSG.delete('/:cid/product/:pid', cartController.removeProductFromCart);

// Ruta para vaciar el carrito
cartsRouterMSG.delete('/:cid/products', cartController.emptyCart);

export { cartsRouterMSG };