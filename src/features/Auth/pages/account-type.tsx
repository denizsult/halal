import { Link } from "react-router-dom";

import { AuthCompanyIconUrl, AuthUserIconUrl } from "@/components/icons";

export type AccountTypeValue = "user" | "company";

type AccountTypePageProps = {
  searchParams?: {
    type?: AccountTypeValue;
  };
};

const isAccountType = (
  value: AccountTypePageProps["searchParams"]
): value is { type: AccountTypeValue } =>
  value?.type === "user" || value?.type === "company";

export function AccountTypePage({ searchParams }: AccountTypePageProps) {
  const selectedType = isAccountType(searchParams)
    ? searchParams.type
    : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:gap-[40px] md:flex-row">
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
          <p className="text-xl md:text-2xl font-bold leading-tight mb-4">
            &quot;HalalHolidayCheck makes finding halal-friendly stays easy and
            reliable. A must-use for Muslim travelers!&quot;
          </p>
          <p className="font-semibold">Amina Khalid</p>
          <p className="text-white">
            Travel Blogger & Halal Tourism Consultant
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Choose Your Account Type
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you registering as a user or a company?
            </p>
          </div>

          <div className="space-y-6">
            <Link
              to="/sign-up/user"
              className={`flex items-center gap-4 px-4 py-6 w-full rounded-xl transition-all border-2 ${
                selectedType === "user"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0">
                <img
                  src={AuthUserIconUrl}
                  alt="User Account"
                  className="w-10 h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  User Account
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Book tours, hotels, and activities. Save your favorites,
                  manage your bookings, and enjoy seamless travel experiences.
                </p>
              </div>
            </Link>

            <Link
              to="/sign-up/company/services"
              className={`flex items-center gap-4 px-4 py-6 w-full rounded-xl transition-all border-2 ${
                selectedType === "company"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0">
                <img
                  src={AuthCompanyIconUrl}
                  alt="Company Account"
                  className="w-10 h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  Company Account
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  List your services (hotels, cars, tours), manage reservations,
                  receive payments, and grow your business with our platform.
                </p>
              </div>
            </Link>
          </div>

          <div className="w-full text-center mt-6">
            <p className="text-[#5A5A5A]">
              You already have an account?{" "}
              <Link
                to="/signin"
                className="text-[#EEC470] font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
