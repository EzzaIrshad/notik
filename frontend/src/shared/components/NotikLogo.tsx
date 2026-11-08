import logo from "../../assets/logo-color.png";

export default function NotikLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <img
                src={logo}
                alt="Notik Logo"
                className="size-7" />
            <span className="max-sm:hidden text-xl 2xl:text-2xl pt-1 font-extrabold text-foreground font-nunito">
                Notik
            </span>
        </div>
    );
}