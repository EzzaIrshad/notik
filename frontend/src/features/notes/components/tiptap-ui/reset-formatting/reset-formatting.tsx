import { forwardRef, useCallback } from "react"
import type { Editor } from "@tiptap/react"

// --- Icons ---
import { Eraser } from "lucide-react"

// --- UI Primitives ---
import type { ButtonProps } from "@/features/notes/components/tiptap-ui-primitive/button"
import { Button } from "@/features/notes/components/tiptap-ui-primitive/button"

export interface ResetFormattingButtonProps extends Omit<ButtonProps, "type"> {
    editor: Editor | null
}

/**
 * Button component for resetting all formatting in a Tiptap editor.
 * Clears marks and nodes, returning text to plain format.
 */
export const ResetFormattingButton = forwardRef<
    HTMLButtonElement,
    ResetFormattingButtonProps
>(({ editor, onClick, ...buttonProps }, ref) => {
    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (event.defaultPrevented || !editor) return
            editor.chain().focus().unsetAllMarks().clearNodes().run()
        },
        [editor, onClick]
    )

    if (!editor) {
        return null
    }

    return (
        <Button
            type="button"
            variant="ghost"
            tooltip="Clear formatting"
            aria-label="Clear formatting"
            onClick={handleClick}
            {...buttonProps}
            ref={ref}
        >
            <Eraser className="tiptap-button-icon" />
        </Button>
    )
})

ResetFormattingButton.displayName = "ResetFormattingButton"

export default ResetFormattingButton