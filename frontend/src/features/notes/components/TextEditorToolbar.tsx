import { ListIcon, ListOrderedIcon } from 'lucide-react';
import { HeadingButton, type Level } from './tiptap-ui/heading-button';
import { ListButton, type ListType } from './tiptap-ui/list-button';
import { UndoRedoButton } from './tiptap-ui/undo-redo-button'
import { Editor } from '@tiptap/react'
import { MarkButton } from './tiptap-ui/mark-button';
import { ColorHighlightPopover } from './tiptap-ui/color-highlight-popover';
import { LinkPopover } from './tiptap-ui/link-popover';
import { TextAlignButton } from './tiptap-ui/text-align-button';
import ResetFormattingButton from './tiptap-ui/reset-formatting/reset-formatting';
import { Separator } from './tiptap-ui-primitive/separator/separator';


interface ToolbarProps {
    editor: Editor | null
}

export interface ListOption {
    label: string
    type: ListType
    icon: React.ElementType
}

export const listOptions: ListOption[] = [
    {
        label: "Bullet List",
        type: "bulletList",
        icon: ListIcon,
    },
    {
        label: "Ordered List",
        type: "orderedList",
        icon: ListOrderedIcon,
    },
]

export const TextEditorToolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null;
    const levels = [1, 2, 3, 4];

    return (
        <div className="w-full py-2 border-y border-y-gray-200 mt-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5 px-3 py-1  border border-gray-200 bg-background rounded-2xl ">

                <UndoRedoButton action="undo" editor={editor} />
                <UndoRedoButton action="redo" editor={editor} />

                <Separator />

                {levels.map((level) => (
                    <HeadingButton
                        key={level}
                        editor={editor}
                        level={level as Level}
                        showShortcut={false}
                    />
                ))}

                {listOptions.map((option) => (
                    <ListButton
                        key={option.label}
                        editor={editor}
                        type={option.type}
                    />
                ))}

                <ColorHighlightPopover
                    editor={editor}
                    hideWhenUnavailable={true}
                />

                <Separator />
                <MarkButton type="bold" editor={editor} />
                <MarkButton type="italic" editor={editor} />
                <MarkButton type="strike" editor={editor} />
                <MarkButton type="code" editor={editor} />
                <MarkButton type="underline" editor={editor} />



                <LinkPopover editor={editor} />
                <MarkButton type="superscript" editor={editor} />
                <MarkButton type="subscript" editor={editor} />
                <Separator />

                <TextAlignButton editor={editor} align="left" />
                <TextAlignButton editor={editor} align="center" />
                <TextAlignButton editor={editor} align="right" />
                <TextAlignButton editor={editor} align="justify" />
                <Separator />

                <ResetFormattingButton editor={editor} />
            </div>
        </div>
    )
}