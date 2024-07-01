import { productService } from "../service/index.js";

class ProductController {
    constructor() {
        this.productService = productService;
    }

    getAllProducts = async (req, res) => {
        try {
            const {
                limit,
                numPage,
                category,
                status,
                sortByPrice,
                order,
                explain,
                availability
            } = req.query;

            const parsedLimit = parseInt(limit, 10);
            const parsedNumPage = parseInt(numPage, 10);
            const parsedExplain = explain === 'true';
            const parsedAvailability = availability === 'true';

            const result = await this.productService.getProducts({
                limit,
                numPage,
                category,
                status,
                sortByPrice,
                order,
                explain,
                availability
            });

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener todos los productos' });
        }
    }

    getAllProductsPaginated = async (req, res) => {
        const { limit = 10, numPage = 1, category, status, sortByPrice, order = 'asc', explain = 'false', availability = 'false' } = req.query;
        
        try {
            const parsedLimit = parseInt(limit, 10);
            const parsedNumPage = parseInt(numPage, 10);
    
            if (isNaN(parsedLimit) || isNaN(parsedNumPage)) {
                return res.status(400).send({ status: 'error', message: 'Limit or numPage is not a number' });
            }
    
            const result = await this.productService.getProducts({ 
                limit: parsedLimit, 
                numPage: parsedNumPage, 
                category, 
                status, 
                sortByPrice, 
                order: order === 'asc' ? 1 : -1, 
                explain: explain === 'true', 
                availability: availability === 'true' 
            });
    
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos paginados:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
        }
    };

    getProductsByCategory = async (req, res) => {
        const category = req.params.category;
        try {
            const result = await this.productService.getProducts({ category });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por categoría' });
        }
    }

    getProductsAvailability = async (req, res) => {
        const availability = req.params.availability === 'true';
        try {
            const result = await this.productService.getProducts({ availability });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por disponibilidad:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por disponibilidad' });
        }
    }

    getProductsByPrice = async (req, res) => {
        const sortByPrice = req.params.sortByPrice === 'price' ? 'price' : null;
        const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : null;
    
        if (!sortByPrice || order === null) {
            return res.status(400).send({ status: 'error', message: 'Parámetros de ordenamiento no válidos' });
        }
    
        try {
            const result = await this.productService.getProducts({ sortByPrice, order });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos ordenados por precio:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos ordenados por precio' });
        }
    }

    getProductById = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await this.productService.getProductById(pid);
            if (!result) {
                res.status(404).send({ status: 'error', message: 'No se encontró el ID especificado' });
            } else {
                res.send({ status: 'success', payload: result });
            }
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al buscar el producto por ID' });
        }
    }

    post = async (req, res) => {
        try {
            const productData = req.body;
            const newProduct = await this.productService.addProduct(productData);
            res.status(201).json({ status: 'true', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al agregar un nuevo producto', error: error.message });
        }
    }

    put = async (req, res) => {
        const { pid } = req.params;
        const updatedProductData = req.body;
        try {
            const result = await this.productService.updateProduct(pid, updatedProductData);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al actualizar el producto', error: error.message });
        }
    }

    deleteProduct = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await this.productService.deleteProduct(pid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
        }
    }
}

export default ProductController;