import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
} from "@/shared/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { User, MonitorIcon, LogOutIcon, PinIcon } from "lucide-react"
import { IoSunny as Sun } from "react-icons/io5";
import { LuMoon as Moon } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { useTheme } from "@/app/providers/ThemeProvider"
import { useGetUser } from "@/features/auth/hooks/useGetUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import type { DashboardTab } from "../layouts/DashboardLayout";
import UserProfile from "./UserProfile";
import { useState } from "react";

interface AccountDropdownProps {
    setTab: (tab: DashboardTab) => void;
}

const AccountDropdown = ({ setTab }: AccountDropdownProps) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const { theme, setTheme } = useTheme();

    const { data, isLoading } = useGetUser();

    const user = data?.data;

    const logoutMutation = useLogout();

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            }
        })
    };

    const getInitials = (name: string | undefined) => {
        return name?.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <span
                        aria-label="User Account"
                        className="grid size-8 sm:size-10 place-items-center rounded-full border border-border/60 icon-container-shadow"
                        style={{ background: "linear-gradient(135deg, var(--lavender), oklch(0.72 0.14 300))" }}
                    >
                        <FaUser className="size-3.5 sm:size-4 text-white fill-white icon-shadow" />
                    </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-60 bg-gradient-soft dark:bg-linear-0 icon-container-shadow rounded-sm" align="start" sideOffset={8}>
                    <div className="flex items-center gap-3 px-1 pt-1.5">
                        {/* Avatar */}
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/80 shadow">
                            <span className="text-white text-sm">
                                {getInitials(user?.fullName)}
                            </span>
                        </div>
                        {/* user info */}
                        <div className="flex flex-col">
                            <span className="text-foreground text-sm font-medium">
                                {isLoading ? "Loading..." : user?.fullName}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <div className="py-2.5">
                        <Tabs value={theme} onValueChange={setTheme}>
                            <TabsList className="w-full bg-background dark:bg-muted border">
                                <TabsTrigger value="light" aria-label="Light theme" className="h-6 flex-1 data-active:bg-[#fff7f6] data-active:shadow-[-2px_2px_2px_rgba(9,30,66,0.13)]">
                                    <Sun className="size-4" aria-hidden="true" />
                                </TabsTrigger>
                                <TabsTrigger value="dark" aria-label="Dark theme" className="h-6 flex-1 data-active:bg-[#fff7f6] data-active:shadow-[-2px_2px_2px_rgba(9,30,66,0.13)]">
                                    <Moon className="size-4" aria-hidden="true" />
                                </TabsTrigger>
                                <TabsTrigger value="system" aria-label="System theme" className="h-6 flex-1 data-active:bg-[#fff7f6] data-active:shadow-[-2px_2px_2px_rgba(9,30,66,0.13)]">
                                    <MonitorIcon className="size-4" aria-hidden="true" />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setProfileOpen(true)} className="gap-3 hover:bg-primary/20! hover:rounded-[6px]">
                            <User aria-hidden="true" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setTab("pinned")}
                            className="gap-3 hover:bg-primary/20! hover:rounded-[6px]">
                            <PinIcon aria-hidden="true" />
                            Pinned Notes
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        variant="destructive"
                        className="gap-3 hover:rounded-[6px] cursor-pointer"
                    >
                        <LogOutIcon aria-hidden="true" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="w-80 sm:w-96">
                    <UserProfile onOpenChange={setProfileOpen} />
                </DialogContent>
            </Dialog>
        </>)
}

export default AccountDropdown