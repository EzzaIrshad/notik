import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, type ReactElement } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";

export type DashboardTab = "all-notes" | "pinned";

const DashboardLayout = (): ReactElement => {
    const [tab, setTab] = useState<DashboardTab>("all-notes");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    
    return (
        <>
        <Navbar search={search} onSearch={setSearch} setTab={setTab}/>
        <main>
            <Outlet context={{search: debouncedSearch, tab, setTab }}/>
        </main>
        </>
    )
}

export default DashboardLayout;