import { Schema, model } from "mongoose"

const userCollection = 'users'

const userSchema = new Schema(
    {
    first_name: {
        type: String,
        index: true
    },
    last_name: String,
    email: {
        type: String,
        required: true, 
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['user', 'user_premium', 'admin'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Carts' // Referencia al modelo de Carts
    }
})
// odm 
export const userModel = model(userCollection, userSchema)

