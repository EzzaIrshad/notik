export type CardTone = {
    bg: string
    pinColor: string
    chip: string
    pillBg: string
}
export const cardTones: CardTone[] = [
    {
        bg: "var(--note-lavender)",
        pinColor: "text-[#714da7]",
        chip: "linear-gradient(135deg, var(--lavender), oklch(0.72 0.14 300))",
        pillBg: "bg-lavender",
    },
    {
        bg: "var(--note-pink)",
        pinColor: "text-[oklch(0.72_0.14_350)]",
        chip: "linear-gradient(135deg, var(--pink), oklch(0.72 0.14 350))",
        pillBg: "bg-pink",
    },
    {
        bg: "var(--note-amber)",
        pinColor: "text-[#e3ad61]",
        chip: "linear-gradient(135deg, #f7dfa6, #ebc56b)",
        pillBg: "bg-[#f4d386]",
    },
    {
        bg: "var(--note-sky)",
        pinColor: "text-[oklch(0.7_0.13_230)]",
        chip: "linear-gradient(135deg, var(--sky), oklch(0.7 0.13 230))",
        pillBg: "bg-sky",
    },
    {
        bg: "var(--note-mint)",
        pinColor: "text-[#1e986f]",
        chip: "linear-gradient(135deg, var(--mint), #56c499)",
        pillBg: "bg-mint",
    },
    {
        bg: "var(--note-peach)",
        pinColor: "text-[#d5986f]",
        chip: "linear-gradient(135deg, var(--peach), #eeaf85)",
        pillBg: "bg-peach",
    },
];