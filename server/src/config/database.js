import mongoose from 'mongoose'

// Reuse the same Mongoose connection across warm serverless invocations.
let cached = globalThis.__asterMongoose || { conn: null, promise: null }
globalThis.__asterMongoose = cached

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI environment variable is required')

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI.replace(/\/(?=\?|$)/, ''), {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null
        throw error
      })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
