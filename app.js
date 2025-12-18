import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './routes/userRoutes.js'
import ItemRoutes from './routes/ItemRoutes.js'

dotenv.config()

const app = express()

/* =======================
   CORS (MUST BE FIRST)
======================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-vite-phi.vercel.app'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('CORS not allowed'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 🔥 IMPORTANT: explicitly allow OPTIONS
app.options('*', cors())

/* =======================
   Middlewares
======================= */
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

/* =======================
   MongoDB (serverless safe)
======================= */
let isConnected = false
const connectDB = async () => {
  if (isConnected) return
  await mongoose.connect(process.env.DB)
  isConnected = true
}

app.use(async (_req, _res, next) => {
  await connectDB()
  next()
})

/* =======================
   Routes
======================= */
app.use('/users', userRoutes)
app.use('/items', ItemRoutes)

export default app
