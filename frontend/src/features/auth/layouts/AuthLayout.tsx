import { Outlet } from "react-router-dom";
import AuthHero from "../components/AuthHero";
import NotikLogo from "../../../shared/components/NotikLogo";
import type { ReactElement } from "react";

const AuthLayout = (): ReactElement => {

    return (
        <div className="relative min-h-screen bg-secondary dark:bg-background 2xl:overflow-hidden">
            {/* Background glowing blobs */}
            <div
                className="pointer-events-none absolute -top-40 -left-40 h-125 w-125 animate-blob rounded-full opacity-70"
                style={{ background: "var(--gradient-blob-1)" }}
            />
            <div
                className="max-2xl:hidden pointer-events-none absolute -bottom-40 -right-40 h-150 w-150 animate-blob rounded-full opacity-70"
                style={{ background: "var(--gradient-blob-2)", animationDelay: "3s" }}
            />
            {/* layout container */}
            <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
                {/* Brand / illustration */}
                <AuthHero />

                {/* Authentication content */}
                <section className="relative flex items-center justify-center 2xl:justify-end px-7 py-10 sm:px-8 lg:py-12">
                    {/* logo visible only on mobile viewports */}
                    <div className="absolute left-6 top-6 lg:hidden">
                        <NotikLogo />
                    </div>

                    <Outlet />

                </section>
            </div>
        </div>
    );
}

export default AuthLayout