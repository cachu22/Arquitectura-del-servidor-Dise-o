import express from 'express';
import productController from '../../controllers/product.controller.js';

const mgProducts = express.Router();
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
mgProducts.get('/', getAllProducts);

// Consulta para traer los productos con paginación
mgProducts.get('/products', getAllProductsPaginated);

// Consulta para traer productos filtrados por categoría:
mgProducts.get('/products/category/:category', getProductsByCategory);

// Consulta para traer productos filtrados por disponibilidad
mgProducts.get('/products/status/:availability', getProductsAvailability);

//Consulta para traer productos ordenados por precio
mgProducts.get('/products/sort/:sortByPrice/:order', getProductsByPrice);

// Ruta para traer un producto por su id
mgProducts.get('/:pid', getProductById);

// Ruta para agregar un nuevo producto
mgProducts.post('/', post);

// Ruta para actualizar un producto por su ID
mgProducts.put('/:pid', put);

// Ruta para eliminar un producto por su ID
mgProducts.delete('/:pid', deleteProduct);

export default mgProducts;