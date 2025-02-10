import mongoose, { Schema, Document } from "mongoose";


export interface IUser extends Document {
    name: string
    email: string
    password: string
    handle: string
    description: string
    image: string
    links: string
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },


    description: {
        type: String,
        default: ''
    },

    handle: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },

    image: {
        type: String,
        default: ''
    },

    links: {
        type: String,
        default: '[]'
    }
})


const User = mongoose.model<IUser>('User', userSchema)
export default User