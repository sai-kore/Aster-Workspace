import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import ApiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) throw new ApiError(401, 'Not authenticated')

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.')
  }

  const user = await User.findById(decoded.id).select('-password')
  if (!user) throw new ApiError(401, 'User no longer exists')

  req.user = { id: user._id, name: user.name, email: user.email }
  next()
})

export default protect