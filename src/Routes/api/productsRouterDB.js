import express from 'express';
import productController from '../../controllers/product.controller.js';

const productsRouterDB = express.Router();
const {
    getAllProducts,
    getAllProductsPaginated,
    getProductsByCategory,
    getProductsAvailability,
    getProductsByPrice,
    getProductById,
    post,
    put,
    deleteProduct
}= new productController()

// Rutas para productos de MongoDB
productsRouterDB.get('/', getAllProducts);

// Consulta para traer los productos con paginación
productsRouterDB.get('/products', getAllProductsPaginated);

// Consulta para traer productos filtrados por categoría:
productsRouterDB.get('/products/category/:category', getProductsByCategory);

// Consulta para traer productos filtrados por disponibilidad
productsRouterDB.get('/products/status/:availability', getProductsAvailability);

//Consulta para traer productos ordenados por precio
productsRouterDB.get('/products/sort/:sortByPrice/:order', getProductsByPrice);

// Ruta para traer un producto por su id
productsRouterDB.get('/:pid', getProductById);

// Ruta para agregar un nuevo producto
productsRouterDB.post('/', post);

// Ruta para actualizar un producto por su ID
productsRouterDB.put('/:pid', put);

// Ruta para eliminar un producto por su ID
productsRouterDB.delete('/:pid', deleteProduct);

export default productsRouterDB;