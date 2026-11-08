import { useState } from "react";
import { LuSparkles } from "react-icons/lu";
import { FaUser } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { BiSolidLock } from "react-icons/bi";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useRegister";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: ""
        },
    });

    // Custom React Query mutation hook for API execution
    const registerMutation = useRegister();

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data, {
            onSuccess: () => {
                reset(); // clear input fields
                navigate("/dashboard");
            }
        });

    }

    return (
        <div className="w-full max-w-100 2xl:max-w-115 min-h-2/3 flex">
            {/* Card wrapper */}
            <div className="max-sm:w-full rounded-lg border border-border/60 bg-background dark:bg-secondary p-7 pb-5 2xl:p-12 self-center shadow-card">
                {/* Header title section */}
                <div className="mb-7 md:mx-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/15 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                        <LuSparkles className="h-3 w-3" /> Start free
                    </span>
                    <h2 className="mt-4 font-nunito text-2xl sm:text-3xl 2xl:text-4xl font-extrabold tracking-tight text-secondary-foreground">
                        Create your account
                    </h2>
                    <p className="mt-1 ml-1 text-xs sm:text-sm 2xl:text-base text-secondary-foreground font-nunito">
                        Join Notik and start collecting your best ideas.
                    </p>
                </div>

                {/* Registration Form */}
                <form
                    className="space-y-4 2xl:space-y-6 md:mx-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* FullName input field */}
                    <Input
                        id="fullName"
                        {...register("fullName")}
                        icon={<FaUser color="white" size={16} className="icon-shadow" />}
                        iconBg="linear-gradient(135deg, var(--lavender), oklch(0.72 0.14 300))"
                        type="text"
                        placeholder="Full Name"
                        autoComplete="name"
                        aria-label="Full Name"
                        error={errors.fullName?.message}
                    />

                    {/* Email input field */}
                    <Input
                        id="email"
                        {...register("email")}
                        icon={<IoMdMail color="white" size={18} className="icon-shadow" />}
                        iconBg="linear-gradient(135deg, var(--sky), oklch(0.7 0.13 230))"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        aria-label="Email"
                        error={errors.email?.message}
                    />

                    {/* Password input field */}
                    <Input
                        id="password"
                        {...register("password")}
                        icon={<BiSolidLock color="white" size={20} className="icon-shadow" />}
                        iconBg="linear-gradient(135deg, var(--pink), oklch(0.72 0.14 350))"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="new-password"
                        aria-label="Password"
                        error={errors.password?.message}
                        trailing={
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="mr-2 rounded-full text-muted-foreground transition hover:bg-background hover:text-foreground"
                            >
                                {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                        }
                    />

                    {/* FOrm Submit Button */}
                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-5 py-3.5 text-sm 2xl:text-base font-semibold text-white button-shadow transition-all duration-300 hover:-translate-y-0.5  active:translate-y-0 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-white/70">
                        <span>
                            {
                                registerMutation.isPending ? "Creating..." : "Create Account"
                            }
                        </span>
                        {
                            !registerMutation.isPending && <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        }
                    </button>

                </form>

                {/* link to switch to login page */}
                <p className="mt-4 text-center text-sm 2xl:text-base text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-foreground hover:text-secondary-foreground hover:underline transition-all">
                        Login
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default RegisterPage