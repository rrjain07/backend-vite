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

/* ======================
   CORS (simple on Render)
====================== */
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://frontend-vite-phi.vercel.app'
  ],
  credentials: true
}))

/* ======================
   Middlewares
====================== */
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

/* ======================
   Routes
====================== */
app.use('/users', userRoutes)
app.use('/items', ItemRoutes)

/* ======================
   DB + Server
====================== */
const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    )
  })
  .catch(err => console.log(err.message))
