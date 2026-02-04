"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Check, Uncheck } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { buildRegisterRequest } from "@/features/Auth/api/buildRegisterRequest";
import { useRegister } from "@/features/Auth/api/useRegister";
import {
  type PasswordFormData,
  passwordRules,
  passwordSchema,
} from "@/features/Auth/schemas/password.schema";
import { useRegistrationStore } from "@/features/Auth/stores/registration-store";

export function CompanyPasswordPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    },
  });

  const { serviceType, password, setPassword, nextStep, companyInfo } =
    useRegistrationStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      password: password || "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const currentPassword = watch("password") ?? "";

  useEffect(() => {
    if (!serviceType) {
      toast.error("Please select a service type");
      navigate("/sign-up/company/services", { replace: true });
    }
  }, [serviceType, navigate]);

  const onSubmit = (formData: PasswordFormData) => {
    setPassword(formData.password);
    nextStep();

    const payload = buildRegisterRequest(
      {
        name: companyInfo.name,
        email: companyInfo.businessEmail,
        password: formData.password,
        serviceType,
        companyInfo,
      },
      formData.confirmPassword
    );

    registerMutation.mutate(payload);
  };

  return (
    <div className="md:h-screen flex flex-col md:flex-row">
      <div className="md:h-screen bg-[#1D4B4A] relative w-full md:w-2/7 flex flex-col items-center justify-between pt-[10px] pb-[35px] pl-[20px] pr-[20px] md:pt-6 md:pr-5 md:pb-[30px] md:pl-5">
        <img
          src={"/images/backgrounds/left-side-background-carusel.svg"}
          alt="login"
          className="w-full h-full object-bottom object-contain absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/20 z-1"></div>
        <div className="relative z-10">
          <Link to={"/"} className="cursor-pointer">
            <img
              src="/logo.svg"
              alt="HalalHolidayCheck"
              width={240}
              height={40}
              className="mb-4"
            />
          </Link>
          <h2 className="text-white font-semibold text-left lg:text-[45px] text-[30px] mr-[10px] lg:mr-[20px]">
            Your Journey Begins Here
          </h2>
          <h3 className="text-[12px] text-white font-medium mt-2">
            Complete your registration and start welcoming travelers to your
            services — from hotels to car rentals and everything in between.
          </h3>
        </div>
      </div>

      <div className="w-full md:w-5/7 h-screen md:overflow-y-auto flex justify-center px-[20px]">
        <div className="w-[550px] md:w-[650px] flex flex-col pt-[50px] md:pt-[50px] pb-[40px]">
          <div className="w-full mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#222]">Create Password</h1>
            <p className="text-[12px] w-full mt-[10px] text-[#5A5A5A] font-medium">
              Set a secure password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full space-y-6 rounded-xl border-1 border-[#E4ECEC] p-[20px]">
              <div>
                <label className="text-[14px] font-semibold">Password</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.password.message}
                  </p>
                )}
                <div className="mt-3 space-y-1 text-sm">
                  {passwordRules.map((rule) => {
                    const valid = rule.test(currentPassword);
                    return (
                      <div key={rule.id} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center">
                          {valid ? <Check /> : <Uncheck />}
                        </span>
                        <span
                          className={valid ? "text-black" : "text-gray-400"}
                        >
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-[14px] font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    {...register("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2 mt-[10px]">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-[3px]"
                />
                <p className="text-[12px] text-[#222222]">
                  By signing up, you confirm that you have read and agree to the{" "}
                  <Link to="/terms" className="text-[#EEC470] hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-[#EEC470] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-[12px]">
                  {errors.acceptTerms.message}
                </p>
              )}

              <div className="flex justify-end items-center gap-3 mt-[20px] pb-[20px]">
                <Link to="/sign-up/company">
                  <button
                    type="button"
                    className="cursor-pointer px-8 py-3 bg-[#F9F9F9] text-[#222222] font-medium rounded-lg hover:bg-[#F2F2F2] transition-colors"
                  >
                    Back
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={!isValid || registerMutation.isPending}
                  className={`cursor-pointer px-8 py-3 text-white font-medium rounded-lg transition-colors
                    ${
                      isValid && !registerMutation.isPending
                        ? "bg-[#266462] hover:bg-[#1D4B4A]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  {registerMutation.isPending ? "Submitting..." : "Next"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
