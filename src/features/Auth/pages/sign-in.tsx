import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setTokens } from "@/lib/axios";
import { authActions } from "@/stores/auth.store";
import type { User } from "@/types/auth";

import { useLogin } from "../api";
import { type SignInFormData, signInSchema } from "../schemas";
import type { AccountType } from "../types";

type SignInFormProps = {
  accountType?: AccountType;
};

export function SignInPage({ accountType }: SignInFormProps) {
  const { mutateAsync, isPending } = useLogin({
    onSuccessMessage: "Login successful",
    onErrorMessage: "Login failed",
  });
  const navigate = useNavigate();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (data: SignInFormData) =>
    mutateAsync({
      email: data.email,
      password: data.password,
      remember: data.remember,
    });

  const handleUseDemo = () => {
    const demoUser: User = {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      phone: "000",
      email_verified_at: null,
      is_active: true,
      company: {
        id: 10,
        name: "Demo Hospital",
        slug: "demo-hospital",
        type: "hospital",
        type_label: "Hospital",
        logo_url: null,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTokens("dev-access-token", "dev-refresh-token");
    authActions.setUser(demoUser);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:gap-[40px] md:flex-row">
      {/* Left side */}
      <div className="md:h-screen bg-gray-100 relative w-full md:w-1/2 flex flex-col items-start justify-between p-8 md:p-12">
        <img
          src={"/images/backgrounds/login.jpg"}
          width={100000}
          height={100000}
          alt="login"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />

        <div className="absolute inset-0 bg-black/20 z-1"></div>

        <div className="relative z-10">
          <Link to={"/"} className="cursor-pointer">
            <img
              src="/logo.svg"
              alt="HalalHolidayCheck"
              width={240}
              height={40}
              className="mb-8"
            />
          </Link>
        </div>

        <div className="relative z-10 text-white max-w-md">
          <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4">
            &quot;HalalHolidayCheck makes finding halal-friendly stays easy and
            reliable. A must-use for Muslim travelers!&quot;
          </h3>
          <p className="font-semibold">Amina Khalid</p>
          <p className="text-white">
            Travel Blogger & Halal Tourism Consultant
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {accountType === "company"
                ? "Welcome Back, Company"
                : accountType === "user"
                  ? "Welcome Back, User"
                  : "Welcome Back"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accountType === "company"
                ? "Sign in to manage your company account and services"
                : accountType === "user"
                  ? "Sign in to access your bookings and travel experiences"
                  : "Welcome back! Please enter your details"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-error-500">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Password <span className="text-error-500">*</span>
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    loading={isPending}
                    disabled={isPending}
                  >
                    Log in
                  </Button>
                </div>
                {import.meta.env.DEV ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={handleUseDemo}
                  >
                    Use demo account
                  </Button>
                ) : null}

                {/* Footer */}
                <div className="w-full text-center mt-6">
                  <p className="text-[#5A5A5A]">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/account-type"
                      className="text-[#EEC470] font-medium hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
