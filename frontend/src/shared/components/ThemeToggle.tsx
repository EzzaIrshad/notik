import { useTheme } from "@/app/providers/ThemeProvider";
import { IoSunny as Sun } from "react-icons/io5";
import { LuMoon as Moon } from "react-icons/lu";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const handleToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }
    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label="Toggle theme"
            className="group relative size-8 sm:size-10 rounded-full glass flex items-center justify-center overflow-hidden transition-transform 
            hover:scale-110 active:scale-95 bg-gradient-soft dark:bg-muted icon-container-shadow dark:bg-linear-0 dark:border dark:border-gray-500"
        >
            {
                theme === "dark" ?
                    <Sun className="size-3.5 sm:size-4 text-white fill-white icon-shadow transition-transform group-hover:rotate-90" />
                    :
                    <Moon className="size-3.5 sm:size-4 text-primary fill-primary icon-shadow transition-transform group-hover:-rotate-12" />
            }
        </button>
    )
}

export default ThemeToggle