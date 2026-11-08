import { useState } from "react";

type TagProps = {
    value: string[]
    onChange: (tags: string[]) => void
}

const TagInput = ({ value, onChange }: TagProps) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");

    const addTag = () => {
        const tag = input.trim();

        if (!tag) return;

        if (tag.length > 30) {
            setError("Tag cannot exceed 30 characters.");
            return;
        }

        if (value.length >= 20) {
            setError("Maximum 20 tags are allowed.");
            return;
        }

        if (value.includes(tag)) {
            setError("This tag already exists.");
            return;
        }

        onChange([...value, tag]);
        setInput("");
        setError("");
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove))
        setError("");
    };

    return (
        <div className="w-full px-3">

            <div className="flex flex-wrap items-center gap-2 p-2 rounded-xs bg-gradient-soft input-shadow focus-within:border-ring border min-h-11">

                {value.map(tag => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 bg-primary/40 text-foreground text-sm font-medium px-2.5 py-1 rounded-md border border-primary"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove ${tag}`}
                            className="text-secondary-foreground cursor-pointer hover:text-red-500 transition-colors duration-150 focus:outline-none text-base font-bold leading-none pl-1"
                        >
                            &times;
                        </button>
                    </span>
                ))}

                <input
                    value={input}
                    placeholder="Add a Tag"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addTag()
                        }
                    }}
                    aria-label="Add a Tag"
                    className="flex-1 bg-transparent border-0 outline-none p-1 text-sm text-foreground placeholder-muted-foreground focus:ring-0 min-w-30"
                />
            </div>
            {error && (
                <p className="mt-2 text-xs text-destructive">
                    {error}
                </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
                Press <kbd className="bg-muted px-1 border rounded text-foreground font-sans text-[10px]">Enter</kbd> to add tag.
            </p>
        </div>
    );
};

export default TagInput;