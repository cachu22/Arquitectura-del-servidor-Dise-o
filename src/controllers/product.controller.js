import { productService } from "../service/index.js";

class productController {
    constructor(){
        this.productService = productService
    }

    getAllProducts = async (req, res) => {
        try {
          const limit = parseInt(req.query.limit) || 0;
          const result = await this.productService.getProducts()
          console.log(result);
          res.send({ status: 'success', payload: result });
        } catch (error) {
          console.error(error);
          res.status(500).send({ status: 'error', message: 'Error al obtener todos los productos' });
        }
      }

    getAllProductsPaginated = async (req, res) => {
        try {
            const result = await this.productService.getAllProducts
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos' });
        }
    }

    getProductsByCategory = async (req, res) => {
        const category = req.params.category;
        try {
            const result = await manager.getProducts({ category });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por categoría' });
        }
    }

    getProductsAvailability = async (req, res) => {
        const availability = req.params.availability === 'true';
        try {
            const result = await manager.getProducts({ availability });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por disponibilidad:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por disponibilidad' });
        }
    }

    getProductsByPrice = async (req, res) => {
        const sortByPrice = req.params.sortByPrice === 'price' ? 'price' : null;
        const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : null;
    
        // Imprimir los valores recibidos en la consola para depurar
        console.log('sortByPrice:', sortByPrice);
        console.log('order:', order);
    
        if (!sortByPrice || order === null) {
            return res.status(400).send({ status: 'error', message: 'Parámetros de ordenamiento no válidos' });
        }
    
        try {
            const result = await manager.getProducts({ sortByPrice, order });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos ordenados por precio:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos ordenados por precio' });
        }
    }

    getProductById = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await this.productService.getProductById
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
            const newProduct = await this.productService.addProduct()
            console.log('producto enviado Router', productData);
            res.status(201).json({ status: 'true', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al agregar un nuevo producto', error: error.message });
        }
    }

    put = async (req, res) => {
        const { pid } = req.params;
        const updatedProductData = req.body;
        try {
            const result = await manager.productController.updateProduct()
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

export default productController