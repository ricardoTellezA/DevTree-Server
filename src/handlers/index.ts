import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import slug from "slug"
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import { generateJWT } from "../utils/jwt"
import { verify } from "jsonwebtoken"
import cloudinary from "../config/cloudinary"


export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userExist = await User.findOne({ email })
    if (userExist) {
        const error = new Error('El usuario ya esta registrado con este correo')
        res.status(409).json({ error: error.message })
        return
    }

    const handle = slug(req.body.handle, '')

    const handleExist = await User.findOne({ handle })
    if (handleExist) {
        const error = new Error('Nombre de usuario no disponible')
        res.status(409).json({ error: error.message })
        return
    }


    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    user.save()
    res.status(201).send("Registro creado con exito")
}


export const login = async (req: Request, res: Response) => {


    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')
        res.status(401).json({ error: error.message })
        return
    }

    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password incorrecto')
        res.status(401).json({ error: error.message })
        return
    }

    const token = generateJWT({ id: user.id })
    res.send(token)
}


export const getUser = async (req: Request, res: Response) => {

    const bearer = req.headers.authorization
    const [, token] = bearer!.split(' ')
    if (!token) {
        const error = new Error('Usuario no autorizado')
        res.status(401).json({ error: error.message })
        return
    }

    try {
        const result = verify(token, process.env.JWT_SECRET!)
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            res.send(user)
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' })
    }
}


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body
        const handle = slug(req.body.handle, '')

        const handleExist = await User.findOne({ handle })
        if (handleExist && handleExist.email !== req.user?.email) {
            const error = new Error('Nombre de usuario no disponible')
            res.status(409).json({ error: error.message })
            return
        }

        if (!req.user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.user.description = description
        req.user.links = links
        req.user.handle = handle
        await req.user?.save()
        res.send('Usuario editado correctamente')


    } catch (error) {
        const errorMessage = new Error('Hubo un error')
        res.status(500).json({ error: errorMessage.message })
        return
    }



}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })

    try {
        form.parse(req, (error, fields, files) => {
            if (files.file) {
                cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                    if (error) {
                        const error = new Error('Hubo un error al subir la imagen')
                        res.status(500).json({ error: error.message })
                        return
                    }

                    if (result) {
                        req.user!.image = result.secure_url
                        await req.user!.save()
                        res.json({ image: result.secure_url })
                    }
                })
            }

        })


    } catch (error) {
        const errorMessage = new Error('Hubo un error')
        res.status(500).json({ error: errorMessage.message })
        return
    }
}



export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-_id -__v -password -email')
        if (!user) {
            const error = new Error('El Usuario no existe')
            res.status(404).json({ error: error.message })
            return
        }

        res.json(user)

    } catch (error) {
        const errorMessage = new Error('Hubo un error')
        res.status(500).json({ error: errorMessage.message })
        return
    }
}



export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExist = await User.findOne({ handle })
        if (userExist) {
            const error = new Error(`${handle} ya esta registrado`)
            res.status(404).json({ error: error.message })
            return
        }

        res.send(`${handle} esta disponible`)
    } catch (error) {
        const errorMessage = new Error('Hubo un error')
        res.status(500).json({ error: errorMessage.message })
        return
    }
}