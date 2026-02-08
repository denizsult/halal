import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { Check, Uncheck } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserRegister } from "@/features/Auth/api/useUserRegister";
import {
  type UserSignUpFormData,
  userSignUpSchema,
} from "@/features/Auth/schemas/user-sign-up.schema";

const countryCodes = ["+44", "+90", "+1", "+49", "+33", "+971", "+966"];

const PasswordRule = ({ label, valid }: { label: string; valid: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 flex items-center justify-center">
        {valid ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Uncheck className="w-4 h-4 text-gray-300" />
        )}
      </span>
      <span className={valid ? "text-black" : "text-gray-400"}>{label}</span>
    </div>
  );
};

export function UserSignUpPage() {
  const { mutateAsync, isPending } = useUserRegister();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSignUpFormData>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      countryCode: "+44",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password", "");
  const email = watch("email", "");

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    notEmailOrUsername: password !== email && password !== "",
  };

  const onSubmit = async (data: UserSignUpFormData) => {
    const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;

    const requestBody = {
      name: data.firstName,
      surname: data.lastName,
      date_of_birth: data.dateOfBirth,
      email: data.email,
      phone: fullPhoneNumber,
      password: data.password,
      password_confirmation: data.confirmPassword,
    };

    try {
      await mutateAsync(requestBody);
      toast.success("Registration successful!");
    } catch (error: any) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="md:h-screen flex flex-col md:flex-row">
      {/* Left Side - Image with Testimonial */}
      <div className="md:h-screen bg-gray-100 relative w-full md:w-1/2 flex flex-col items-start justify-between p-8 md:p-12">
        <img
          src="/images/backgrounds/login.jpg"
          alt="login"
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/20 z-1"></div>
        <div className="relative z-10">
          <Link to="/" className="cursor-pointer">
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
          <h2 className="text-xl md:text-2xl font-bold leading-tight mb-4">
            &quot;HalalHolidayCheck makes finding halal-friendly stays easy and
            reliable. A must-use for Muslim travelers!&quot;
          </h2>
          <h3 className="font-semibold">Amina Khalid</h3>
          <p className="text-white">
            Travel Blogger & Halal Tourism Consultant
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full relative md:w-1/2 h-screen md:overflow-y-auto flex justify-center px-[20px]">
        {/* Back Arrow */}
        <div className="mb-8 absolute top-10 left-10">
          <Link to="/account-type">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-6 h-6 text-[#222]" />
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-[550px] flex flex-col pt-[100px] md:pt-[130px] pb-[40px]">
          <div className="w-full mb-6 text-center md:text-left">
            <h1 className="text-2xl font-medium text-[#222]">Sign up</h1>
            <p className="text-[12px] w-full mt-[10px] text-[#5A5A5A] font-medium">
              Sign up to unlock your account and enjoy a faster, easier
              experience every time.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>First name</Label>
                    <Input
                      {...field}
                      placeholder="Enter your first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Last name</Label>
                    <Input
                      {...field}
                      placeholder="Enter your last name"
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Date of birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal rounded-xl border-gray-200 bg-gray-50 hover:bg-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(d) => field.onChange(d ?? null)}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-xs">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="space-y-2">
              <Label>Personal phone number</Label>
              <div className="flex gap-2">
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="flex h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {countryCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <div className="flex-1 space-y-1">
                      <Input
                        {...field}
                        placeholder="Enter your phone number"
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-xs">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    {...field}
                    type="email"
                    placeholder="j.doe@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <div className="mt-3 space-y-1 text-sm">
                    <PasswordRule
                      label="Minimum 8 characters"
                      valid={passwordRules.length}
                    />
                    <PasswordRule
                      label="At least 1 uppercase letter (A–Z)"
                      valid={passwordRules.uppercase}
                    />
                    <PasswordRule
                      label="At least 1 lowercase letter (a–z)"
                      valid={passwordRules.lowercase}
                    />
                    <PasswordRule
                      label="At least 1 number (0–9)"
                      valid={passwordRules.number}
                    />
                    <PasswordRule
                      label="Should not match your email"
                      valid={passwordRules.notEmailOrUsername}
                    />
                  </div>
                </div>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Re-enter password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="agreeToTerms"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1B4746] focus:ring-[#1B4746]"
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-[#222] leading-relaxed"
                    >
                      By signing up or booking, you confirm that you have read
                      and agree to the{" "}
                      <Link to="/terms" className="text-[#1B4746] underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-[#1B4746] underline">
                        Privacy Policy
                      </Link>{" "}
                      of HalalHolidayCheck.
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs">
                      {errors.agreeToTerms.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#1B4746] hover:bg-[#2a5a58] rounded-xl h-12"
              disabled={isPending}
            >
              {isPending ? "Registering..." : "Continue"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-[#222]">
                You already have an account?{" "}
              </span>
              <Link
                to="/sign-in"
                className="text-sm text-[#E8B040] font-medium hover:underline"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
