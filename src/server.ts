import express from "express"
import cors from "cors"
import "dotenv/config"
import router from "./router"
import { connectDB } from "./config/db"
import { corsConfig } from './config/cors'
import { Request, Response, NextFunction } from "express"
connectDB()


const app = express()


// CORS
app.use(cors(corsConfig))

app.use(express.json())

app.use('/', router)


export default app