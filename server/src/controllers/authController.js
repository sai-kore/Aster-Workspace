import User from '../models/User.js'
import Page from '../models/Page.js'
import ApiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { signToken, sendTokenCookie, clearTokenCookie } from '../utils/token.js'
import { welcomePage } from '../services/welcomePage.js'
import { extractText } from '../utils/tiptapText.js'

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email })

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email }).lean()
  if (existing) throw new ApiError(409, 'An account with this email already exists')

  const user = await User.create({ name, email, password })

  const page = await Page.create({
    ...welcomePage,
    contentText: extractText(welcomePage.content),
    owner: user._id,
  })

  sendTokenCookie(res, signToken(user._id))
  res.status(201).json({ success: true, data: { user: publicUser(user), pageId: page._id } })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, 'Invalid email or password')

  sendTokenCookie(res, signToken(user._id))
  res.json({ success: true, data: { user: publicUser(user) } })
})

export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res)
  res.json({ success: true, data: { message: 'Logged out' } })
})

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } })
})