import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import connectDB from '@/src/server/config/database.js'
import User from '@/src/server/models/User.js'
import Page, { emptyDoc } from '@/src/server/models/Page.js'
import { welcomePage } from '@/src/server/services/welcomePage.js'
import { extractText, escapeRegex, buildSnippet } from '@/src/server/utils/tiptapText.js'
import collectDescendantIds from '@/src/server/utils/pageTree.js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const COOKIE = 'token', MAX_AGE = 7 * 24 * 60 * 60
const response = (data, status = 200, token) => { const r = NextResponse.json({ success: true, data }, { status }); if (token) r.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE }); return r }
const error = (message, status = 400) => NextResponse.json({ success: false, message }, { status })
const bodyOf = async (r) => { try { return await r.json() } catch { return {} } }
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
async function getUser(req) { try { const t = req.cookies.get(COOKIE)?.value; if (!t) return null; const d = jwt.verify(t, process.env.JWT_SECRET); const u = await User.findById(d.id).select('-password').lean(); return u ? { id: String(u._id), name: u.name, email: u.email } : null } catch { return null } }
const handleError = (e) => { if (e?.code === 11000) return error('An account with this email already exists', 409); if (e?.name === 'ValidationError') return error(e.message, 400); console.error('API error:', e); return error(process.env.NODE_ENV === 'production' ? 'Internal server error' : (e?.message || 'Internal server error'), 500) }
async function handler(req, context) {
 try {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required')
  await connectDB()
  const { path: rawPath = [] } = await context.params || {}, p = rawPath.map(decodeURIComponent), path = '/' + p.join('/'), method = req.method
  const b = ['POST','PUT','PATCH'].includes(method) ? await bodyOf(req) : {}
  if (path === '/health' && method === 'GET') return response({ status: 'ok' })
  if (path === '/auth/register' && method === 'POST') {
   const name = String(b.name || '').trim(), email = String(b.email || '').trim().toLowerCase(), password = String(b.password || '')
   if (name.length < 2 || name.length > 60) return error('Name must be between 2 and 60 characters')
   if (!/^\S+@\S+\.\S+$/.test(email)) return error('Enter a valid email address')
   if (password.length < 8) return error('Password must be at least 8 characters')
   if (await User.findOne({ email }).lean()) return error('An account with this email already exists', 409)
   const user = await User.create({ name, email, password })
   const page = await Page.create({ ...welcomePage, contentText: extractText(welcomePage.content), owner: user._id })
   return response({ user: { id: String(user._id), name: user.name, email: user.email }, pageId: page._id }, 201, sign(user._id))
  }
  if (path === '/auth/login' && method === 'POST') {
   const email = String(b.email || '').trim().toLowerCase(), user = await User.findOne({ email }).select('+password')
   if (!user || !(await user.matchPassword(String(b.password || '')))) return error('Invalid email or password', 401)
   return response({ user: { id: String(user._id), name: user.name, email: user.email } }, 200, sign(user._id))
  }
  if (path === '/auth/logout' && method === 'POST') { const r = response({ message: 'Logged out' }); r.cookies.set(COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 }); return r }
  if (path === '/auth/me' && method === 'GET') { const user = await getUser(req); return user ? response({ user }) : error('Not authenticated', 401) }
  const user = await getUser(req); if (!user) return error('Not authenticated', 401); const owner = user.id
  if (path === '/pages' && method === 'GET') return response({ pages: await Page.find({ owner, isDeleted: false }).select('title icon parentPage isFavorite createdAt updatedAt').sort({ createdAt: 1 }).lean() })
  if (path === '/pages/search' && method === 'GET') { const q = String(new URL(req.url).searchParams.get('q') || '').trim().slice(0, 100); if (!q) return response({ pages: [] }); const re = new RegExp(escapeRegex(q), 'i'); const pages = await Page.find({ owner, isDeleted: false, $or: [{ title: re }, { contentText: re }] }).select('title icon contentText updatedAt').sort({ updatedAt: -1 }).limit(20).lean(); return response({ pages: pages.map(({ contentText, ...page }) => ({ ...page, snippet: buildSnippet(contentText, q) })) }) }
  if (path === '/pages/trash' && method === 'GET') return response({ pages: await Page.find({ owner, isDeleted: true }).select('title icon parentPage deletedAt updatedAt').sort({ deletedAt: -1 }).lean() })
  if (path === '/pages/trash' && method === 'DELETE') { const r = await Page.deleteMany({ owner, isDeleted: true }); return response({ deletedCount: r.deletedCount }) }
  if (path === '/pages' && method === 'POST') { if (b.parentPage && !await Page.findOne({ _id: b.parentPage, owner, isDeleted: false }).select('_id').lean()) return error('Parent page not found'); const doc = { title: String(b.title || '').trim() || 'Untitled', icon: b.icon || '📄', parentPage: b.parentPage || null, owner }; if (b.content) { doc.content = b.content; doc.contentText = extractText(b.content) } return response({ page: await Page.create(doc) }, 201) }
  const id = p[1]; if (p[0] !== 'pages' || !id || !mongoose.isValidObjectId(id)) return error('Not found', 404)
  if (p.length === 2 && method === 'GET') { const page = await Page.findOne({ _id: id, owner }).lean(); return page ? response({ page }) : error('Page not found', 404) }
  if (p.length === 2 && method === 'PUT') { const update = {}; if (b.title !== undefined) update.title = String(b.title).trim() || 'Untitled'; if (b.icon !== undefined) update.icon = b.icon; if (b.content !== undefined) { update.content = b.content; update.contentText = extractText(b.content) } if (!Object.keys(update).length) return error('Nothing to update'); const page = await Page.findOneAndUpdate({ _id: id, owner, isDeleted: false }, update, { new: true, runValidators: true }).lean(); return page ? response({ page }) : error('Page not found', 404) }
  if (p.length === 3 && p[2] === 'favorite' && method === 'PATCH') { const page = await Page.findOne({ _id: id, owner, isDeleted: false }); if (!page) return error('Page not found', 404); page.isFavorite = !page.isFavorite; await page.save(); return response({ page: page.toObject() }) }
  if (p.length === 3 && p[2] === 'restore' && method === 'PATCH') { const page = await Page.findOne({ _id: id, owner, isDeleted: true }); if (!page) return error('Page not found in trash', 404); const ds = await collectDescendantIds(owner, page._id, true); await Page.updateMany({ _id: { $in: [page._id, ...ds] }, owner }, { $set: { isDeleted: false, deletedAt: null } }); if (page.parentPage && !await Page.findOne({ _id: page.parentPage, owner, isDeleted: false }).select('_id').lean()) await Page.updateOne({ _id: page._id }, { $set: { parentPage: null } }); return response({ restoredCount: 1 + ds.length }) }
  if (p.length === 3 && p[2] === 'duplicate' && method === 'POST') { const original = await Page.findOne({ _id: id, owner, isDeleted: false }).lean(); if (!original) return error('Page not found', 404); const page = await Page.create({ title: `${original.title} (copy)`, icon: original.icon, content: original.content ?? emptyDoc(), contentText: original.contentText, parentPage: original.parentPage, owner }); return response({ page }, 201) }
  if (p.length === 3 && p[2] === 'permanent' && method === 'DELETE') { const page = await Page.findOne({ _id: id, owner, isDeleted: true }); if (!page) return error('Page not found in trash', 404); const ds = await collectDescendantIds(owner, page._id, true), r = await Page.deleteMany({ _id: { $in: [page._id, ...ds] }, owner }); return response({ deletedCount: r.deletedCount }) }
  if (p.length === 2 && method === 'DELETE') { const page = await Page.findOne({ _id: id, owner, isDeleted: false }); if (!page) return error('Page not found', 404); const ds = await collectDescendantIds(owner, page._id, false), ids = [page._id, ...ds]; await Page.updateMany({ _id: { $in: ids }, owner }, { $set: { isDeleted: true, deletedAt: new Date() } }); return response({ deletedCount: ids.length }) }
  return error('Not found', 404)
 } catch (e) { return handleError(e) }
}
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE }
