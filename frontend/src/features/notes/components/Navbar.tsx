import NotikLogo from "@/shared/components/NotikLogo"
import { Link } from "react-router-dom"
import { FiSearch as Search } from "react-icons/fi";
import { type ReactElement } from "react";
import ThemeToggle from "@/shared/components/ThemeToggle";
import AccountDropdown from "./AccountDropdown";
import type { DashboardTab } from "../layouts/DashboardLayout";

interface NavbarProps {
    search: string;
    onSearch: (value: string) => void;
    setTab: (tab: DashboardTab) => void;
}

const Navbar = ({ search, onSearch, setTab }: NavbarProps): ReactElement => {

    return (
        <nav className="sticky top-0 z-40 border-b border-border/50 bg-background shadow">
            <div className="mx-auto flex w-full max-w-330 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:gap-6 2xl:p-5">
                {/* Logo */}
                <Link to="/dashboard" className="flex shrink-0">
                    <NotikLogo />
                </Link>

                {/* Search */}
                <div className="group w-full sm:w-1/2 lg:w-1/4 2xl:w-1/3 relative flex items-center gap-3 rounded-xl bg-gradient-soft dark:bg-muted dark:bg-linear-0 dark:border dark:border-gray-500 px-3 py-2 sm:py-2.5 transition input-shadow dark:shadow-none focus-within:shadow-focus dark:focus-within:shadow-focus">
                    <span aria-hidden>
                        <Search className="h-4 w-4 text-foreground/30 dark:text-foreground/70" strokeWidth={2.5} />
                    </span>
                    <input
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        aria-label="Search your notes"
                        placeholder="Search your notes..."
                        className="min-w-0 flex-1 bg-transparent text-xs 2xl:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                </div>

                {/* Right section */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3 2xl:gap-6">
                    <ThemeToggle />
                    <AccountDropdown setTab={setTab} />
                </div>

            </div>
        </nav>
    )
}

export default Navbar