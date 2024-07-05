import mongoose from "mongoose";
import { cartService } from "../service/index.js";

class CartController {
    constructor() {
        this.cartService = cartService;
    }

    // Método para obtener todos los carritos
    getAllCarts = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts();
            res.send({ status: 'success', payload: carts });
        } catch (error) {
            console.error('Error al obtener todos los carritos:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener todos los carritos' });
        }
    };

    // Método para obtener un carrito por ID
    getCartById = async (req, res) => {
        const { cid } = req.params;
        try {
            const result = await this.cartService.getCartById(cid);
            if (!result) {
                res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
            } else {
                res.send({ status: 'success', payload: { cart: result, products: result.products || [] } });
            }
        } catch (error) {
            console.error('Error al buscar el carrito por ID:', error);
            res.status(500).send({ status: 'error', message: 'Error al buscar el carrito por ID' });
        }
    };

    // Método para crear un carrito
    createCart = async (req, res) => {
        try {
            const newCart = await this.cartService.createCart(); // Usa el servicio para crear el carrito
            res.status(201).json({ status: 'success', payload: newCart });
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
        }
    }

    // Método para agregar un producto al carrito
    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!mongoose.Types.ObjectId.isValid(cid)) {
                return res.status(400).json({ status: 'error', message: 'El ID del carrito no es válido' });
            }

            if (!mongoose.Types.ObjectId.isValid(pid)) {
                return res.status(400).json({ status: 'error', message: 'El ID del producto no es válido' });
            }

            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ status: 'error', message: 'La cantidad del producto no es válida' });
            }

            const result = await this.cartService.addProductToCart(cid, pid, quantity);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito' });
        }
    };

    // Método para actualizar el carrito con productos
    updateCartWithProducts = async (req, res) => {
        try {
            const { cid } = req.params;
            const { productId, quantity } = req.body;

            if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ status: 'error', message: 'Se requiere un productId y una cantidad válida' });
            }

            const result = await this.cartService.addProductToCart(cid, productId, quantity);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
        }
    };

    // Método para actualizar la cantidad de un producto en el carrito
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;

            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ status: 'error', message: 'Se requiere una cantidad válida' });
            }

            const updatedCart = await this.cartService.updateProductQuantity(cid, pid, quantity);
            res.send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
        }
    };

    // Método para eliminar un producto del carrito
    removeProductFromCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const result = await this.cartService.removeProductFromCart(cid, pid);
            if (result) {
                res.send({ status: 'success', message: 'Producto eliminado del carrito' });
            } else {
                res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
            }
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
        }
    };

    // Método para vaciar el carrito
    emptyCart = async (req, res) => {
        try {
            const { cid } = req.params;

            const updatedCart = await this.cartService.emptyCart(cid);
            res.send({ status: 'success', payload: updatedCart });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito' });
        }
    };
}

export default CartController;