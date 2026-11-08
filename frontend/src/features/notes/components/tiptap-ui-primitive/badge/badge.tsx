"use client"

import { forwardRef } from "react"
import "@/features/notes/components/tiptap-ui-primitive/badge/badge-colors.scss"
import "@/features/notes/components/tiptap-ui-primitive/badge/badge.scss"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    | "default"
    | "ghost"
    | "gray"
    | "green"
    | "yellow"
    | "red"
    | "brand"
  size?: "default" | "small" | "large"
  appearance?: "default" | "subdued" | "emphasized"
  trimText?: boolean
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant,
      size = "default",
      appearance = "default",
      trimText = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`tiptap-badge ${className || ""}`}
        data-style={variant}
        data-size={size}
        data-appearance={appearance}
        data-text-trim={trimText ? "on" : "off"}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export default Badge
