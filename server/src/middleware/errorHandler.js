export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500
  let message = err.message || 'Server error'

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    status = 404
    message = 'Page not found'
  }
  if (err.code === 11000) {
    status = 409
    message = 'An account with this email already exists'
  }
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map((e) => e.message).join('. ')
  }
  if (err.type === 'entity.parse.failed') {
    status = 400
    message = 'Invalid request body'
  }

  if (status >= 500) console.error(err)
  res.status(status).json({ success: false, message: status >= 500 ? 'Something went wrong' : message })
}