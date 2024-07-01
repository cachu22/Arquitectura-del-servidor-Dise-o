import { productModel } from "./models/products.models.js";

export class ProductDaosMongo {
    constructor() {
        this.productModel = productModel;
    }

    // Traer todos los productos con filtrado y ordenamiento
    async getProducts({ limit = 9, numPage = 1, category, status, sortByPrice, order, explain = false, availability }) {
        //console.log('Log de productsDao.mongo.js - Parámetros recibidos:', { limit, numPage, category, status, sortByPrice, order, explain, availability });
        try {
            let filter = {};
            if (category) filter.category = category;
            
            if (availability !== undefined) {
                filter.availability = availability;
            }

            console.log('Log de productsDao.mongo.js - Filtros aplicados:', filter);
    
            let sort = {};
            if (sortByPrice && order) {
                sort.price = order;
            }

            console.log('Log de productsDao.mongo.js - Ordenamiento aplicado:', sort);
    
            let query = await this.productModel.paginate(
                filter,
                { 
                    limit, 
                    page: numPage, 
                    sort,
                    lean: true 
                }
            );

            //console.log('Log de productsDao.mongo.js - Resultado de la consulta:', query);
    
            if (explain) {
                return await query.explain('executionStats');
            }
    
            return query;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    // Buscar producto por su ID
    async getProductById(_id) {
        return await this.productModel.findById(_id);
    }

    async addProduct(productData) {
        try {
            // Verificar si ya existe un producto con el mismo código
            const existingProduct = await this.productModel.findOne({ code: productData.code });
            if (existingProduct) {
                console.log('En manager', productData);
                throw new Error('El código ' + productData.code + ' ya está siendo utilizado por otro producto. Por favor, elija otro código.');
            }

            // Si el código no está en uso, crear el nuevo producto
            const newProduct = await this.productModel.create(productData);
            return newProduct;
        } catch (error) {
            throw new Error('Error al agregar un nuevo producto: ' + error.message);
        }
    }

    async updateProduct(productId, updatedFields) {
        return await this.productModel.updateOne({_id: productId}, updatedFields);
    }

    async deleteProduct(productId) {
        return await this.productModel.deleteOne({_id: productId});
    }
}