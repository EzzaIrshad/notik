import type { InputHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { MdError } from "react-icons/md";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    icon: ReactNode;
    iconBg: string;
    error?: string;
    trailing?: ReactNode;
}

/**
 * Renders the custom text input component with error messaging.
 */

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ icon, iconBg, error, trailing, className, ...props }, ref) => {
        const errorId = error ? `${props.id}-error` : undefined;
        return (
            <div>
                <div
                    className="group relative flex items-center gap-3 rounded-xl bg-background dark:bg-muted px-3 py-3 transition input-shadow focus-within:shadow-focus">
                    <span
                        className="absolute -left-2 -top-1 grid size-11 2xl:size-12 place-items-center rounded-full icon-container-shadow"
                        style={{ background: iconBg }}
                        aria-hidden
                    >
                        {icon}
                    </span>
                    <input
                        ref={ref}
                        {...props}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className={`ml-9 min-w-0 flex-1 bg-transparent text-xs 2xl:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none  ${className ?? ""}`}
                    />
                    {trailing}
                </div>
                {error && (
                    <div className="flex items-center gap-2 mt-1.5 text-destructive">
                        <MdError size={16} />
                        <p id={errorId} className="text-xs">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        );
    });

Input.displayName = "Input";

export default Input