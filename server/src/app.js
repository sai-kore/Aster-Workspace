import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import pageRoutes from './routes/pageRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import connectDB from './config/database.js'

const app = express()

app.set('trust proxy', 1)
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

const clientUrls = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim())
app.use(cors({ origin: clientUrls, credentials: true }))

app.use(express.json({ limit: '2mb' }))

// Vercel invokes this exported Express app directly, so connect per request and
// reuse the cached Mongoose connection across warm function invocations.
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }))
app.use('/api/auth', authRoutes)
app.use('/api/pages', pageRoutes)

app.use(notFound)
app.use(errorHandler)

export default app