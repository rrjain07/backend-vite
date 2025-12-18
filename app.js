import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/userRoutes.js'
import ItemRoutes from './routes/ItemRoutes.js'

dotenv.config()

const app = express()

/* ======================
   CORS — MUST BE FIRST
====================== */
const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-vite-phi.vercel.app'
]

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200) // 🔥 THIS FIXES IT
  }

  next()
})

/* ======================
   Middlewares
====================== */
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

/* ======================
   MongoDB (serverless-safe)
====================== */
let isConnected = false
async function connectDB() {
  if (isConnected) return
  await mongoose.connect(process.env.DB)
  isConnected = true
}

app.use(async (_req, _res, next) => {
  await connectDB()
  next()
})

/* ======================
   Routes
====================== */
app.use('/users', userRoutes)
app.use('/items', ItemRoutes)

export default app
