// models/carts.models.js
import { Schema, model } from 'mongoose';

const CartSchema = new Schema({
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product' // Asegúrate de que este nombre coincida con el nombre del modelo de producto en Mongoose
        },
        quantity: {
            type: Number,
            default: 1 // Añadido un valor por defecto para evitar campos vacíos
        }
    }]
});

export const cartsModel = model('Cart', CartSchema);