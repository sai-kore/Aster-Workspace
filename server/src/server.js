import 'dotenv/config'
import app from './app.js'
import connectDB from './config/database.js'

process.on('unhandledRejection', (err) => console.error('Unhandled rejection:', err))

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET environment variable. Copy server/.env.example to server/.env and set it.')
  process.exit(1)
}

const PORT = process.env.PORT || 5001

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
  })
  .catch(() => process.exit(1))