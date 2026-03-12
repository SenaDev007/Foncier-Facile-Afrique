'use client'

import { useCallback, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  RemoveFormatting,
} from 'lucide-react'

export interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
}

const btnClass =
  'p-2 rounded-lg border border-[#3A3A3C] bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#D4A843] hover:text-[#1C1C1E] hover:border-[#D4A843] transition-colors disabled:opacity-50'

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Rédigez votre article…',
  minHeight = '320px',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#D4A843] underline hover:text-[#B8912E]' },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none min-h-[200px] p-4 text-[#EFEFEF] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL du lien', previousUrl || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  useEffect(() => {
    if (!editor) return
    if (value === editor.getHTML()) return
    editor.commands.setContent(value || '', false)
  }, [value, editor])

  if (!editor) {
    return (
      <div
        className={`rounded-b-xl border border-[#3A3A3C] bg-[#1C1C1E] ${className}`}
        style={{ minHeight }}
      >
        <div className="flex items-center gap-1 p-2 border-b border-[#3A3A3C]">
          <span className="text-[#8E8E93] text-sm">Chargement de l’éditeur…</span>
        </div>
        <div className="p-4 text-[#8E8E93]">...</div>
      </div>
    )
  }

  return (
    <div
      className={`tiptap-admin rounded-b-xl border border-[#3A3A3C] bg-[#1C1C1E] ${className}`}
      style={{ minHeight }}
    >
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#3A3A3C]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass}
          title="Gras"
          aria-pressed={editor.isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass}
          title="Italique"
          aria-pressed={editor.isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass}
          title="Souligné"
          aria-pressed={editor.isActive('underline')}
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>
        <span className="w-px h-6 bg-[#3A3A3C] mx-1" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass}
          title="Titre 2"
          aria-pressed={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass}
          title="Titre 3"
          aria-pressed={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <span className="w-px h-6 bg-[#3A3A3C] mx-1" aria-hidden />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass}
          title="Liste à puces"
          aria-pressed={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass}
          title="Liste numérotée"
          aria-pressed={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <span className="w-px h-6 bg-[#3A3A3C] mx-1" aria-hidden />
        <button
          type="button"
          onClick={setLink}
          className={btnClass}
          title="Lien"
          aria-pressed={editor.isActive('link')}
        >
          <Link2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className={btnClass}
          title="Effacer le formatage"
        >
          <RemoveFormatting className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
