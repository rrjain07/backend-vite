import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from '../server/routes/ItemRoutes.js'
import ItemRoutes from '../server/routes/userRoutes.js'

dotenv.config()

const app = express()

// Middlewares
app.use(express.json())
app.use(cors({
  origin: '*',
  credentials: true
}))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// Routes
app.use('/users', userRoutes)
app.use('/items', ItemRoutes)

// MongoDB connection (important for serverless)
let isConnected = false

const connectDB = async () => {
  if (isConnected) return
  try {
    await mongoose.connect(`mongodb+srv://kaushikvihu:ru2004@cluster0.tucxfzs.mongodb.net/lostandfound`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    isConnected = true
    console.log('MongoDB connected')
  } catch (err) {
    console.error(err.message)
  }
}

// Connect DB on each request
app.use(async (_req, _res, next) => {
  await connectDB()
  next()
})

// Export app (DO NOT use app.listen)
export default app
