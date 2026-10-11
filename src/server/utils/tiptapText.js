// Flattens a Tiptap JSON document into plain text (used for search + snippets)
export const extractText = (node) => {
  if (!node || typeof node !== 'object') return ''
  if (typeof node.text === 'string') return node.text
  if (!Array.isArray(node.content)) return ''
  if (node.type === 'doc') return node.content.map(extractText).filter(Boolean).join('\n')
  return node.content.map(extractText).filter(Boolean).join(' ').slice(0, 100000)
}

export const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const buildSnippet = (text, query) => {
  if (!text) return ''
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) {
    const short = text.slice(0, 140).trim()
    return short.length < text.length ? `${short}…` : short
  }
  const start = Math.max(0, idx - 40)
  const end = Math.min(text.length, idx + query.length + 90)
  const snippet = text.slice(start, end).trim()
  return `${start > 0 ? '…' : ''}${snippet}${end < text.length ? '…' : ''}`
}