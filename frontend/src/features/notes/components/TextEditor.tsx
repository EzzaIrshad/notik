import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Highlight } from '@tiptap/extension-highlight'
import { TextEditorToolbar } from './TextEditorToolbar'
import { useEffect } from 'react'

interface TextEditorProps {
    value?: string
    onChange?: (html: string) => void
}

export default function TextEditor({ value, onChange }: Readonly<TextEditorProps>) {
    const editor = useEditor({
        extensions: [StarterKit, Superscript, Subscript, TextAlign.configure({ types: ['heading', 'paragraph'] }), Highlight.configure({ multicolor: true })],
        content: value || "",
        editorProps: {
            attributes: {
                class:
                    'prose max-w-none p-4 min-h-[160px] focus:outline-none focus:ring-0',
            },


        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML())
            }
        },
    })

    useEffect(() => {
        if(!editor) return
        if(value !== editor.getHTML()) {
            editor.commands.setContent(value || "", {
                emitUpdate: false,
            })
        }
    }, [value, editor])

    return (
        <div className="w-full overflow-hidden bg-card ">
            <TextEditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}