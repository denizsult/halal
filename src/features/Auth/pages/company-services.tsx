import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useRegistrationStore } from "@/features/Auth/stores/registration-store";
import {
  SERVICE_TYPE_MAP,
  type ServiceType,
} from "@/features/Auth/types/registration.types";

export function CompanyServicesPage() {
  const navigate = useNavigate();
  const { serviceType, setServiceType, nextStep } = useRegistrationStore();

  const [selectedService, setSelectedService] = useState<ServiceType | "">(
    () => {
      if (serviceType == null) return "";
      const entry = Object.entries(SERVICE_TYPE_MAP).find(
        ([, value]) => value === serviceType
      );
      return (entry?.[0] as ServiceType) ?? "";
    }
  );

  const services = useMemo(
    () => [
      {
        id: "hospitals",
        name: "Hospitals",
        icon: "/images/Register-icons/🏨-1.svg",
        companies: "80+ companies",
      },
      {
        id: "car-rental",
        name: "Car Rental",
        icon: "/images/Register-icons/🚘.svg",
        companies: "500+ companies",
      },
      {
        id: "transfers",
        name: "Transfers",
        icon: "/images/Register-icons/Private parking.svg",
        companies: "300+ companies",
      },

      {
        id: "tours",
        name: "Tours",
        icon: "/images/Register-icons/📸.svg",
        companies: "200+ companies",
      },
      {
        id: "events",
        name: "Events",
        icon: "/images/Register-icons/🎟️.svg",
        companies: "150+ companies",
      },

      {
        id: "hotel",
        name: "Hotel",
        icon: "/images/Register-icons/🏨.svg",
        companies: "500+ companies",
      },

      {
        id: "activities",
        name: "Activities",
        icon: "/images/Register-icons/🏄.svg",
        companies: "250+ companies",
      },
      {
        id: "rooms",
        name: "Rooms",
        icon: "/images/Register-icons/🏠.svg",
        companies: "300+ companies",
      },
      {
        id: "medical-resorts",
        name: "Medical Resorts",
        icon: "/images/Register-icons/🌿.svg",
        companies: "50+ companies",
      },
    ],
    []
  );

  const activeServices: ServiceType[] = [
    "hospitals",
    "transfers",
    "car-rental",
    "tours",
    "events",
  ];
  const isServiceActive = (serviceId: string) =>
    activeServices.includes(serviceId as ServiceType);

  return (
    <div className="flex flex-col justify-center md:flex-row">
      <div className="md:h-screen bg-[#1D4B4A] relative w-full md:w-2/7 flex flex-col items-center justify-between pt-[10px] pb-[35px] pl-[20px] pr-[20px] md:pt-6 md:pr-5 md:pb-[30px] md:pl-5">
        <img
          src="/images/backgrounds/left-side-background-carusel.svg"
          alt="login"
          className="w-full h-full object-bottom object-contain absolute inset-0 z-0"
        />

        <div className="absolute inset-0 bg-black/20 z-1"></div>

        <div className="relative z-10">
          <Link to="/" className="cursor-pointer">
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

        <div className="relative z-10 text-white max-full mt-[50px] md:mt-[0px] pr-[10px] pl-[10px]">
          <div className="bg-[#1D4B4A] rounded-2xl pt-2 pb-2 pl-4 pr-4 flex flex-col gap-4 shadow-lg border-2 border-[#2B6C68]">
            <div className="flex items-start flex-col gap1 pt-2">
              <div className="rounded-full pb-[5px] flex items-center justify-center">
                <img
                  src="/images/emojis/message.svg"
                  alt="Help"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold leading-tight text-white">
                  Need Help? We&apos;re Here for You!
                </h3>
                <p className="text-[11px] font-normal text-white/80 mt-1">
                  If you have any questions, issues, or just need a hand, our
                  support team is ready to help.
                </p>
              </div>
            </div>
            <Link
              to="#"
              className="text-[#FBBF24] text-[14px] mb-1 font-semibold hover:underline w-fit"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full md:w-5/7 flex items-center justify-center pl-[30px] pr-[30px]">
        <div className="w-full max-w-[660px]">
          <div className="text-left mb-7">
            <h1 className="text-[24px] font-semibold text-[#222222] mb-1">
              What is your service?
            </h1>
            <p className="text-[#5A5A5A] font-medium text-[14px]">
              Describe the type of service you offer, like hotel, car rental, or
              activity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
            {services.map((service) => {
              const isActive = isServiceActive(service.id);
              const isSelected = selectedService === service.id;

              return (
                <div
                  key={service.id}
                  className={`relative p-6 rounded-xl border-1 transition-all duration-200
                    ${
                      isSelected && isActive
                        ? "border-[#1D4B4A] bg-[#e4ecec]"
                        : "border-gray-200 bg-[#F9F9F9]"
                    }
                    ${isActive ? "cursor-pointer hover:border-gray-300" : "opacity-60 cursor-not-allowed"}
                  `}
                  onClick={() =>
                    isActive && setSelectedService(service.id as ServiceType)
                  }
                >
                  {!isActive && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded-md">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 mb-1 flex items-center justify-center">
                      <img
                        src={service.icon}
                        alt={service.name}
                        width={32}
                        height={32}
                        className="w-[32px] h-[32px]"
                      />
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#222222] mb-2">
                      {service.name}
                    </h3>
                    <p
                      className={`text-[12px] font-medium ${
                        isActive ? "text-[#1D4B4A]" : "text-gray-400"
                      }`}
                    >
                      {service.companies}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end items-center gap-3">
            <button
              className="cursor-pointer px-8 py-3 bg-[#F9F9F9] text-[#222222] font-medium rounded-lg hover:bg-[#F2F2F2] transition-colors"
              onClick={() => navigate(-1)}
            >
              Back
            </button>

            <button
              className={`px-8 py-3 font-medium rounded-lg transition-colors inline-block text-center
                ${
                  selectedService && isServiceActive(selectedService)
                    ? "cursor-pointer hover:bg-[#1D4B4A] text-white bg-[#266462]"
                    : "cursor-not-allowed bg-gray-300 text-gray-500 pointer-events-none"
                }`}
              onClick={() => {
                if (!selectedService || !isServiceActive(selectedService)) {
                  toast.error("Please select a service type");
                  return;
                }
                const type = SERVICE_TYPE_MAP[selectedService];
                setServiceType(type);
                nextStep();
                navigate("/sign-up/company");
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
