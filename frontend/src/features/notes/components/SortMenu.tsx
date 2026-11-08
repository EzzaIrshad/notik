import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
    DropdownMenuRadioGroup,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

interface SortMenuProps {
    sort: "createdAt" | "updatedAt";
    setSort: (value: "createdAt" | "updatedAt") => void;
}

const SortMenu = ({ sort, setSort }: SortMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <button
                    type="button"
                    className="flex w-40 shrink-0 items-center justify-between rounded-[9px] px-2 py-1 md:px-3 md:py-1.5 bg-white dark:bg-white/90 cursor-pointer focus-within:shadow-focus"
                    style={{
                        boxShadow: "-2px 2px 5px rgba(0, 0, 0, 0.3), rgba(9, 30, 66, 0.25) 0px 1px 2px, inset -2px 2px 3px 0px rgba(255, 255, 255, 0.5), inset 2px -2px 3px rgba(0, 0, 0, 0.2)",
                    }}>
                    Sort
                    <ChevronsUpDown className="size-4 text-muted-foreground " />
                </button>
            } />
            <DropdownMenuContent className="bg-gradient-soft dark:bg-linear-0 icon-container-shadow rounded-[9px] text-xs md:text-sm">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sort notes</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={sort}
                        onValueChange={(value) =>
                            setSort(value as "createdAt" | "updatedAt")
                        }>
                        <DropdownMenuRadioItem value="createdAt" className="hover:bg-primary/20! hover:rounded-[6px]">
                            Newest
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="updatedAt" className="hover:bg-primary/20! hover:rounded-[6px]">
                            Recently updated
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SortMenu