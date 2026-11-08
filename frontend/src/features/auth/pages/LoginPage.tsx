
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { BiSolidLock } from "react-icons/bi";
import { IoMdMail } from "react-icons/io";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    // Custom React Query mutation hook for API execution
    const loginMutation = useLogin();

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data, {
            onSuccess: () => {
                reset(); // clear input fields
                navigate("/dashboard");
            },
        });
    }

    return (
        <div className="w-full max-w-100 2xl:max-w-115 min-h-2/3 flex">
            {/* Card wrapper */}
            <div className="w-full sm:w-5/6 rounded-lg border border-border/60 bg-background dark:bg-secondary p-7 2xl:p-12 self-center shadow-card">
                {/* Header title section */}
                <div className="mb-10 text-center">
                    <h2 className="mt-4 font-nunito text-3xl 2xl:text-4xl font-extrabold tracking-tight text-secondary-foreground">
                        Welcome Back
                    </h2>
                    <p className="mt-1.5 ml-1 text-sm 2xl:text-base text-secondary-foreground font-nunito">
                        Login to continue your journey
                    </p>
                </div>

                {/* Login Form */}
                <form
                    className="space-y-5 2xl:space-y-6 mx-2"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Email input field */}
                    <Input
                        id="email"
                        icon={<IoMdMail color="white" size={18} className="icon-shadow" />}
                        iconBg="linear-gradient(135deg, var(--sky), oklch(0.7 0.13 230))"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        aria-label="Email"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    {/* Password input field */}
                    <Input
                        id="password"
                        icon={<BiSolidLock color="white" size={20} className="icon-shadow" />}
                        iconBg="linear-gradient(135deg, var(--pink), oklch(0.72 0.14 350))"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        aria-label="Password"
                        error={errors.password?.message}
                        {...register("password")}
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

                    {/* form submit button */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="group relative mt-10 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-5 py-3.5 text-sm 2xl:text-base font-semibold text-white 
                                    button-shadow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-white/70"
                        style={{ boxShadow: "-2px 7px 3px rgba(0, 0, 0, 0.1), rgba(9, 30, 66, 0.3) -2px 1px 3px 1px, inset -2px 2px 3px rgba(255, 255, 255, 0.3), inset 2px -2px 3px rgba(0, 0, 0, 0.2)" }}
                    >
                        <span>
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </span>
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>

                </form>

                {/* link to switch to registration page */}
                <p className="mt-6 text-center text-[13px] 2xl:text-[15px] text-muted-foreground">
                    Not registered?{" "}
                    <Link to="/register" className="font-semibold text-foreground hover:text-secondary-foreground hover:underline transition-all">
                        Create Account
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default LoginPage