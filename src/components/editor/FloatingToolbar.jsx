'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bold, Check, Code, Highlighter, Italic, Link2, Palette, Strikethrough, Underline, X,
} from 'lucide-react'

const TEXT_COLORS = [
  { name: 'Default', value: null },
  { name: 'Gray', value: '#78716c' },
  { name: 'Brown', value: '#9f6b53' },
  { name: 'Orange', value: '#d9730d' },
  { name: 'Yellow', value: '#cb912f' },
  { name: 'Green', value: '#448361' },
  { name: 'Blue', value: '#337ea9' },
  { name: 'Purple', value: '#9065b0' },
  { name: 'Red', value: '#d44c47' },
]

export default function FloatingToolbar({ editor }) {
  const [coords, setCoords] = useState(null)
  const [panel, setPanel] = useState(null) // 'link' | 'color' | null
  const [linkUrl, setLinkUrl] = useState('')
  const toolbarRef = useRef(null)

  useEffect(() => {
    const reposition = () => {
      const { from, to, empty } = editor.state.selection
      if (empty || !editor.view.hasFocus()) {
        setCoords(null)
        return
      }
      try {
        const start = editor.view.coordsAtPos(from)
        const end = editor.view.coordsAtPos(to)
        setCoords({
          top: Math.min(start.top, end.top),
          left: (Math.min(start.left, end.left) + Math.max(start.right, end.right)) / 2,
        })
      } catch {
        setCoords(null)
      }
    }

    const hide = () => {
      setCoords(null)
      setPanel(null)
      setLinkUrl('')
    }

    const onBlur = () => {
      // Keep the toolbar alive while its own inputs hold focus (link editor)
      requestAnimationFrame(() => {
        if (toolbarRef.current && toolbarRef.current.contains(document.activeElement)) return
        hide()
      })
    }

    editor.on('transaction', reposition)
    editor.on('focus', reposition)
    editor.on('blur', onBlur)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      editor.off('transaction', reposition)
      editor.off('focus', reposition)
      editor.off('blur', onBlur)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [editor])

  if (!coords) return null

  const btn = (active) =>
    `flex h-7 w-7 items-center justify-center rounded ${
      active
        ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-600 dark:text-white'
        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100'
    }`

  const handleLinkClick = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      setLinkUrl(editor.getAttributes('link').href || '')
      setPanel('link')
    }
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      const href = /^https?:\/\//i.test(url) || url.startsWith('mailto:') ? url : `https://${url}`
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    }
    setPanel(null)
    setLinkUrl('')
  }

  const closePanel = () => {
    setPanel(null)
    setLinkUrl('')
    editor.commands.focus()
  }

  const left = Math.min(Math.max(coords.left, 140), window.innerWidth - 140)

  return (
    <div
      ref={toolbarRef}
      style={{ top: Math.max(8, coords.top - 52), left }}
      className="fixed z-40 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
      // Prevent the editor from losing focus when toolbar controls are clicked
      onMouseDown={(e) => { if (e.target.tagName !== 'INPUT') e.preventDefault() }}
    >
      <div className="flex items-center gap-0.5">
        <button className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="h-3.5 w-3.5" /></button>
        <button className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="h-3.5 w-3.5" /></button>
        <button className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><Underline className="h-3.5 w-3.5" /></button>
        <button className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></button>
        <button className={btn(editor.isActive('code'))} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code"><Code className="h-3.5 w-3.5" /></button>
        <div className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-600" />
        <button className={btn(editor.isActive('link'))} onClick={handleLinkClick} title="Link"><Link2 className="h-3.5 w-3.5" /></button>
        <button className={btn(editor.isActive('highlight'))} onClick={() => editor.chain().focus().toggleHighlight().run()} title="Highlight"><Highlighter className="h-3.5 w-3.5" /></button>
        <div className="relative">
          <button className={btn(panel === 'color')} onClick={() => setPanel(panel === 'color' ? null : 'color')} title="Text color">
            <Palette className="h-3.5 w-3.5" />
          </button>
          {panel === 'color' && (
            <div className="absolute right-0 top-full mt-1 flex gap-1 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.name}
                  title={color.name}
                  onClick={() => {
                    if (color.value) editor.chain().focus().setColor(color.value).run()
                    else editor.chain().focus().unsetColor().run()
                    setPanel(null)
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 hover:scale-110 dark:border-zinc-600"
                  style={{ backgroundColor: color.value || undefined }}
                >
                  {!color.value && <X className="h-3 w-3 text-zinc-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {panel === 'link' && (
        <div className="mt-1 flex items-center gap-1 border-t border-zinc-100 pt-1 dark:border-zinc-700">
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink() }
              if (e.key === 'Escape') closePanel()
            }}
            placeholder="Paste a link…"
            autoFocus
            className="h-7 w-56 rounded border border-zinc-200 bg-white px-2 text-xs outline-none focus:border-accent dark:border-zinc-600 dark:bg-zinc-900"
          />
          <button onClick={applyLink} className="btn h-7 bg-accent px-2 text-xs text-white hover:bg-accent-hover" title="Apply link">
            <Check className="h-3.5 w-3.5" />
          </button>
          <button onClick={closePanel} className="btn-ghost h-7 px-2" title="Cancel">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}