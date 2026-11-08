import NotikLogo from '../../../shared/components/NotikLogo'
import heroImage from "../../../assets/auth-hero.svg";

const AuthHero = () => {
    return (
        <section className="relative hidden overflow-hidden px-10 py-[3vh] lg:flex lg:flex-col 2xl:px-16">
            <NotikLogo />
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="relative mt-[8vh] font-nunito">
                    {/* Brand introduction heading */}
                    <h1 className=" text-[clamp(2.6rem,3.4vw,3rem)] font-black leading-tight text-foreground">
                        Welcome to{" "}
                        <span className="bg-gradient-brand bg-clip-text text-transparent">Notik</span>
                    </h1>
                    <p className="mt-3 text-[clamp(0.7rem,1vw,1.1rem)] text-muted-foreground max-w-sm">
                        Capture ideas beautifully — a calm, colorful home for your notes, thoughts, and everyday sparks.
                    </p>
                </div>

                {/* Hero illustration section */}
                <div className="relative 2xl:mt-5">
                    {/* Soft glowing background shapes */}
                    <div className="absolute left-4 top-8 h-64 w-64 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
                    <div
                        className="absolute right-2 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
                        style={{ background: "linear-gradient(135deg, var(--peach), var(--sky))" }}
                    />

                    {/* Animated hero vector graphic */}
                    <div className="relative -mt-4 w-full">
                        <img
                            src={heroImage}
                            alt="Notik hero illustration"
                            className="size-110 2xl:size-128 xl:ml-20 animate-fade-in-up"
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default AuthHero