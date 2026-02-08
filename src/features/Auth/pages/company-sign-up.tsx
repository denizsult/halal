import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CitySelect } from "@/components/form/city-select";
import { CommonSelect } from "@/components/form/common-select";
import { CountrySelect } from "@/components/form/country-select";
import { Upload } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CompanyInfoFormData,
  companyInfoSchema,
} from "@/features/Auth/schemas/company-info.schema";
import { useRegistrationStore } from "@/features/Auth/stores/registration-store";

// Country codes
const countryCodes = [
  "+376 (AD)",
  "+1868 (TT)",
  "+381 (RS)",
  "+44 (GB)",
  "+73 (RU)",
  "+74 (RU)",
  "+75 (RU)",
  "+78 (RU)",
  "+79 (RU)",
  "+852 (HK)",
  "+2125288 (EH)",
  "+2125289 (EH)",
  "+598 (UY)",
  "+1246 (BB)",
  "+970 (PS)",
  "+52 (MX)",
  "+265 (MW)",
  "+687 (NC)",
  "+4779 (SJ)",
  "+672 (NF)",
  "+61 (CX)",
  "+976 (MN)",
  "+371 (LV)",
  "+673 (BN)",
  "+380 (UA)",
  "+850 (KP)",
  "+358 (FI)",
  "+1264 (AI)",
  "+994 (AZ)",
  "+1345 (KY)",
  "+998 (UZ)",
  "+353 (IE)",
  "+44 (JE)",
  "+250 (RW)",
  "+387 (BA)",
  "+48 (PL)",
  "+351 (PT)",
  "+509 (HT)",
  "+98 (IR)",
  "+262 (TF)",
  "+251 (ET)",
  "+76 (KZ)",
  "+77 (KZ)",
  "+223 (ML)",
  "+505 (NI)",
  "+49 (DE)",
  "+372 (EE)",
  "+216 (TN)",
  "+590 (MF)",
  "+237 (CM)",
  "+691 (FM)",
  "+1721 (SX)",
  "+357 (CY)",
  "+212 (MA)",
  "+64 (PN)",
  "+599 (CW)",
  "+297 (AW)",
  "+34 (ES)",
  "+241 (GA)",
  "+35818 (AX)",
  "+45 (DK)",
  "+596 (MQ)",
  "+1268 (AG)",
  "+268 (SZ)",
  "+886 (TW)",
  "+678 (VU)",
  "+682 (CK)",
  "+61 (CC)",
  "+238 (CV)",
  "+375 (BY)",
  "+420 (CZ)",
  "+51 (PE)",
  "+670 (TL)",
  "+264 (NA)",
  "+690 (TK)",
  "+243 (CD)",
  "+1758 (LC)",
  "+597 (SR)",
  "+257 (BI)",
  "+995 (GE)",
  "+233 (GH)",
  "+246 (IO)",
  "+20 (EG)",
  "+594 (GF)",
  "+692 (MH)",
  "+245 (GW)",
  "+679 (FJ)",
  "+260 (ZM)",
  "+354 (IS)",
  "+1441 (BM)",
  "+55 (BR)",
  "+680 (PW)",
  "+249 (SD)",
  "+61 (AU)",
  "+855 (KH)",
  "+64 (NZ)",
  "+63 (PH)",
  "+226 (BF)",
  "+298 (FO)",
  "+232 (SL)",
  "+1473 (GD)",
  "+591 (BO)",
  "+41 (CH)",
  "+1784 (VC)",
  "+593 (EC)",
  "+248 (SC)",
  "+27 (ZA)",
  "+91 (IN)",
  "+231 (LR)",
  "+82 (KR)",
  "+370 (LT)",
  "+65 (SG)",
  "+1787 (PR)",
  "+1939 (PR)",
  "+501 (BZ)",
  "+31 (NL)",
  "+291 (ER)",
  "+1664 (MS)",
  "+262 (RE)",
  "+500 (GS)",
  "+880 (BD)",
  "+967 (YE)",
  "+47 (NO)",
  "+386 (SI)",
  "+968 (OM)",
  "+258 (MZ)",
  "+218 (LY)",
  "+235 (TD)",
  "+592 (GY)",
  "+996 (KG)",
  "+253 (DJ)",
  "+1670 (MP)",
  "+1201 (US)",
  "+1202 (US)",
  "+1203 (US)",
  "+1205 (US)",
  "+1206 (US)",
  "+1207 (US)",
  "+1208 (US)",
  "+1209 (US)",
  "+1210 (US)",
  "+1212 (US)",
  "+1213 (US)",
  "+1214 (US)",
  "+1215 (US)",
  "+1216 (US)",
  "+1217 (US)",
  "+1218 (US)",
  "+1219 (US)",
  "+1220 (US)",
  "+1224 (US)",
  "+1225 (US)",
  "+1227 (US)",
  "+1228 (US)",
  "+1229 (US)",
  "+1231 (US)",
  "+1234 (US)",
  "+1239 (US)",
  "+1240 (US)",
  "+1248 (US)",
  "+1251 (US)",
  "+1252 (US)",
  "+1253 (US)",
  "+1254 (US)",
  "+1256 (US)",
  "+1260 (US)",
  "+1262 (US)",
  "+1267 (US)",
  "+1269 (US)",
  "+1270 (US)",
  "+1272 (US)",
  "+1274 (US)",
  "+1276 (US)",
  "+1281 (US)",
  "+1283 (US)",
  "+1301 (US)",
  "+1302 (US)",
  "+1303 (US)",
  "+1304 (US)",
  "+1305 (US)",
  "+1307 (US)",
  "+1308 (US)",
  "+1309 (US)",
  "+1310 (US)",
  "+1312 (US)",
  "+1313 (US)",
  "+1314 (US)",
  "+1315 (US)",
  "+1316 (US)",
  "+1317 (US)",
  "+1318 (US)",
  "+1319 (US)",
  "+1320 (US)",
  "+1321 (US)",
  "+1323 (US)",
  "+1325 (US)",
  "+1327 (US)",
  "+1330 (US)",
  "+1331 (US)",
  "+1334 (US)",
  "+1336 (US)",
  "+1337 (US)",
  "+1339 (US)",
  "+1346 (US)",
  "+1347 (US)",
  "+1351 (US)",
  "+1352 (US)",
  "+1360 (US)",
  "+1361 (US)",
  "+1364 (US)",
  "+1380 (US)",
  "+1385 (US)",
  "+1386 (US)",
  "+1401 (US)",
  "+1402 (US)",
  "+1404 (US)",
  "+1405 (US)",
  "+1406 (US)",
  "+1407 (US)",
  "+1408 (US)",
  "+1409 (US)",
  "+1410 (US)",
  "+1412 (US)",
  "+1413 (US)",
  "+1414 (US)",
  "+1415 (US)",
  "+1417 (US)",
  "+1419 (US)",
  "+1423 (US)",
  "+1424 (US)",
  "+1425 (US)",
  "+1430 (US)",
  "+1432 (US)",
  "+1434 (US)",
  "+1435 (US)",
  "+1440 (US)",
  "+1442 (US)",
  "+1443 (US)",
  "+1447 (US)",
  "+1458 (US)",
  "+1463 (US)",
  "+1464 (US)",
  "+1469 (US)",
  "+1470 (US)",
  "+1475 (US)",
  "+1478 (US)",
  "+1479 (US)",
  "+1480 (US)",
  "+1484 (US)",
  "+1501 (US)",
  "+1502 (US)",
  "+1503 (US)",
  "+1504 (US)",
  "+1505 (US)",
  "+1507 (US)",
  "+1508 (US)",
  "+1509 (US)",
  "+1510 (US)",
  "+1512 (US)",
  "+1513 (US)",
  "+1515 (US)",
  "+1516 (US)",
  "+1517 (US)",
  "+1518 (US)",
  "+1520 (US)",
  "+1530 (US)",
  "+1531 (US)",
  "+1534 (US)",
  "+1539 (US)",
  "+1540 (US)",
  "+1541 (US)",
  "+1551 (US)",
  "+1559 (US)",
  "+1561 (US)",
  "+1562 (US)",
  "+1563 (US)",
  "+1564 (US)",
  "+1567 (US)",
  "+1570 (US)",
  "+1571 (US)",
  "+1573 (US)",
  "+1574 (US)",
  "+1575 (US)",
  "+1580 (US)",
  "+1585 (US)",
  "+1586 (US)",
  "+1601 (US)",
  "+1602 (US)",
  "+1603 (US)",
  "+1605 (US)",
  "+1606 (US)",
  "+1607 (US)",
  "+1608 (US)",
  "+1609 (US)",
  "+1610 (US)",
  "+1612 (US)",
  "+1614 (US)",
  "+1615 (US)",
  "+1616 (US)",
  "+1617 (US)",
  "+1618 (US)",
  "+1619 (US)",
  "+1620 (US)",
  "+1623 (US)",
  "+1626 (US)",
  "+1628 (US)",
  "+1629 (US)",
  "+1630 (US)",
  "+1631 (US)",
  "+1636 (US)",
  "+1641 (US)",
  "+1646 (US)",
  "+1650 (US)",
  "+1651 (US)",
  "+1657 (US)",
  "+1660 (US)",
  "+1661 (US)",
  "+1662 (US)",
  "+1667 (US)",
  "+1669 (US)",
  "+1678 (US)",
  "+1681 (US)",
  "+1682 (US)",
  "+1701 (US)",
  "+1702 (US)",
  "+1703 (US)",
  "+1704 (US)",
  "+1706 (US)",
  "+1707 (US)",
  "+1708 (US)",
  "+1712 (US)",
  "+1713 (US)",
  "+1714 (US)",
  "+1715 (US)",
  "+1716 (US)",
  "+1717 (US)",
  "+1718 (US)",
  "+1719 (US)",
  "+1720 (US)",
  "+1724 (US)",
  "+1725 (US)",
  "+1727 (US)",
  "+1730 (US)",
  "+1731 (US)",
  "+1732 (US)",
  "+1734 (US)",
  "+1737 (US)",
  "+1740 (US)",
  "+1743 (US)",
  "+1747 (US)",
  "+1754 (US)",
  "+1757 (US)",
  "+1760 (US)",
  "+1762 (US)",
  "+1763 (US)",
  "+1765 (US)",
  "+1769 (US)",
  "+1770 (US)",
  "+1772 (US)",
  "+1773 (US)",
  "+1774 (US)",
  "+1775 (US)",
  "+1779 (US)",
  "+1781 (US)",
  "+1785 (US)",
  "+1786 (US)",
  "+1801 (US)",
  "+1802 (US)",
  "+1803 (US)",
  "+1804 (US)",
  "+1805 (US)",
  "+1806 (US)",
  "+1808 (US)",
  "+1810 (US)",
  "+1812 (US)",
  "+1813 (US)",
  "+1814 (US)",
  "+1815 (US)",
  "+1816 (US)",
  "+1817 (US)",
  "+1818 (US)",
  "+1828 (US)",
  "+1830 (US)",
  "+1831 (US)",
  "+1832 (US)",
  "+1843 (US)",
  "+1845 (US)",
  "+1847 (US)",
  "+1848 (US)",
  "+1850 (US)",
  "+1854 (US)",
  "+1856 (US)",
  "+1857 (US)",
  "+1858 (US)",
  "+1859 (US)",
  "+1860 (US)",
  "+1862 (US)",
  "+1863 (US)",
  "+1864 (US)",
  "+1865 (US)",
  "+1870 (US)",
  "+1872 (US)",
  "+1878 (US)",
  "+1901 (US)",
  "+1903 (US)",
  "+1904 (US)",
  "+1906 (US)",
  "+1907 (US)",
  "+1908 (US)",
  "+1909 (US)",
  "+1910 (US)",
  "+1912 (US)",
  "+1913 (US)",
  "+1914 (US)",
  "+1915 (US)",
  "+1916 (US)",
  "+1917 (US)",
  "+1918 (US)",
  "+1919 (US)",
  "+1920 (US)",
  "+1925 (US)",
  "+1928 (US)",
  "+1929 (US)",
  "+1930 (US)",
  "+1931 (US)",
  "+1934 (US)",
  "+1936 (US)",
  "+1937 (US)",
  "+1938 (US)",
  "+1940 (US)",
  "+1941 (US)",
  "+1947 (US)",
  "+1949 (US)",
  "+1951 (US)",
  "+1952 (US)",
  "+1954 (US)",
  "+1956 (US)",
  "+1959 (US)",
  "+1970 (US)",
  "+1971 (US)",
  "+1972 (US)",
  "+1973 (US)",
  "+1975 (US)",
  "+1978 (US)",
  "+1979 (US)",
  "+1980 (US)",
  "+1984 (US)",
  "+1985 (US)",
  "+1989 (US)",
  "+228 (TG)",
  "+94 (LK)",
  "+269 (KM)",
  "+53 (CU)",
  "+1671 (GU)",
  "+54 (AR)",
  "+681 (WF)",
  "+975 (BT)",
  "+961 (LB)",
  "+266 (LS)",
  "+252 (SO)",
  "+1767 (DM)",
  "+36 (HU)",
  "+352 (LU)",
  "+378 (SM)",
  "+93 (AF)",
  "+222 (MR)",
  "+213 (DZ)",
  "+590 (GP)",
  "+385 (HR)",
  "+359 (BG)",
  "+683 (NU)",
  "+62 (ID)",
  "+32 (BE)",
  "+674 (NR)",
  "+689 (PF)",
  "+964 (IQ)",
  "+261 (MG)",
  "+84 (VN)",
  "+230 (MU)",
  "+1684 (AS)",
  "+225 (CI)",
  "+599 (BQ)",
  "+423 (LI)",
  "+39 (IT)",
  "+1869 (KN)",
  "+974 (QA)",
  "+90 (TR)",
  "+1340 (VI)",
  "+244 (AO)",
  "+254 (KE)",
  "+966 (SA)",
  "+211 (SS)",
  "+1649 (TC)",
  "+1 (CA)",
  "+227 (NE)",
  "+350 (GI)",
  "+965 (KW)",
  "+58 (VE)",
  "+220 (GM)",
  "+595 (PY)",
  "+56 (CL)",
  "+389 (MK)",
  "+853 (MO)",
  "+374 (AM)",
  "+267 (BW)",
  "+977 (NP)",
  "+239 (ST)",
  "+229 (BJ)",
  "+677 (SB)",
  "+224 (GN)",
  "+262 (YT)",
  "+299 (GL)",
  "+377 (MC)",
  "+92 (PK)",
  "+60 (MY)",
  "+383 (XK)",
  "+373 (MD)",
  "+688 (TV)",
  "+508 (PM)",
  "+221 (SN)",
  "+507 (PA)",
  "+356 (MT)",
  "+256 (UG)",
  "+355 (AL)",
  "+971 (AE)",
  "+506 (CR)",
  "+590 (BL)",
  "+290 (SH)",
  "+247 (SH)",
  "+972 (IL)",
  "+43 (AT)",
  "+856 (LA)",
  "+33 (FR)",
  "+675 (PG)",
  "+1809 (DO)",
  "+1829 (DO)",
  "+1849 (DO)",
  "+676 (TO)",
  "+1876 (JM)",
  "+1658 (JM)",
  "+47 (BV)",
  "+421 (SK)",
  "+686 (KI)",
  "+962 (JO)",
  "+960 (MV)",
  "+382 (ME)",
  "+81 (JP)",
  "+503 (SV)",
  "+57 (CO)",
  "+263 (ZW)",
  "+240 (GQ)",
  "+86 (CN)",
  "+504 (HN)",
  "+44 (IM)",
  "+242 (CG)",
  "+95 (MM)",
  "+30 (GR)",
  "+685 (WS)",
  "+500 (FK)",
  "+255 (TZ)",
  "+236 (CF)",
  "+40 (RO)",
  "+268 (UM)",
  "+992 (TJ)",
  "+1242 (BS)",
  "+234 (NG)",
  "+3906698 (VA)",
  "+379 (VA)",
  "+973 (BH)",
  "+66 (TH)",
  "+46 (SE)",
  "+1284 (VG)",
  "+44 (GG)",
  "+502 (GT)",
  "+963 (SY)",
  "+993 (TM)",
] as const;

function UploadFile({
  file,
  setFile,
  label,
  progress,
  setProgress,
  completed,
  setCompleted,
  accept,
  error,
}: {
  file?: File | null;
  setFile: (file: File | null) => void;
  label: string;
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
  completed: boolean;
  setCompleted: Dispatch<SetStateAction<boolean>>;
  accept: string;
  error?: string;
}) {
  const uploadFile = (_selectedFile: File) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setCompleted(true);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} at ${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col gap-2 mt-[30px]">
      {!completed ? (
        <div className="text-center">
          <label
            htmlFor={`${label}-upload`}
            className={`block border-none rounded-lg px-[15px] py-[20px] md:px-[40px] md:py-[30px] bg-[#F9F9F9] hover:bg-gray-100 cursor-pointer transition-colors ${
              error ? "border border-red-500" : ""
            }`}
          >
            <div className="flex justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-semibold text-black mb-2">
              Upload {label}
            </h3>
            <p className="text-[11px] text-[#5A5A5A] font-medium">
              Accepted formats: {accept.replace(/\./g, "").toUpperCase()} (Max
              size: 5MB)
            </p>
            {progress > 0 && (
              <div className="mt-2 text-sm text-[#5A5A5A] font-medium">
                Uploading... {progress}%
              </div>
            )}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </label>
          <input
            id={`${label}-upload`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (!selectedFile) return;
              if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("Max 5MB!");
                return;
              }

              setFile(selectedFile);
              uploadFile(selectedFile);
            }}
          />
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs">📄</span>
            </div>
            <div>
              <p className="text-sm font-medium">{file?.name}</p>
              <p className="text-xs text-gray-500">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • ` : ""}
                {getFormattedDate()}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setCompleted(false);
              setProgress(0);
            }}
            className="rounded-xl bg-[#FFE8E8] p-[10px] cursor-pointer hover:bg-[#FFD4D4] transition-colors"
          >
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// Custom Input wrapper to match reference design
function CustomInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",

  hasError,
  hintText,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;

  hasError?: boolean;
  hintText?: string;
}) {
  return (
    <div className="mb-3">
      {label && (
        <Label className="text-[#222] text-[14px] font-semibold mb-[6px] block">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-[45px] px-3 py-4 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#222] focus:border-transparent ${
            hasError ? "border-[#FF7F7F]" : "border-[#F2F2F2]"
          }`}
        />
      </div>
      {hintText && (
        <p
          className={`mt-[6px] text-xs ${
            hasError ? "text-[#ba0606]" : "text-[#5A5A5A]"
          }`}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}

export function CompanySignUpPage() {
  const navigate = useNavigate();
  const { companyInfo, setCompanyInfo, nextStep, serviceType } =
    useRegistrationStore();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [logoCompleted, setLogoCompleted] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [coverCompleted, setCoverCompleted] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema) as Resolver<CompanyInfoFormData>,
    mode: "onChange",
    defaultValues: {
      name: companyInfo.name || "",
      country: companyInfo.country || "",
      city: companyInfo.city || "",
      countryCode: companyInfo.countryCode || "+90 (TR)",
      phoneNumber: companyInfo.phoneNumber || "",
      businessEmail: companyInfo.businessEmail || "",
      addressLine: companyInfo.addressLine || "",
      zipCode: companyInfo.zipCode || "",
      licenseFile: companyInfo.licenseFile || undefined,
      logoFile: companyInfo.logoFile || undefined,
      coverFile: companyInfo.coverFile || undefined,
    },
  });

  const selectedCountryId = watch("country");

  useEffect(() => {
    if (!serviceType) {
      toast.error("Please select a service type");
      navigate("/sign-up/company/services", { replace: true });
    }
  }, [serviceType, navigate]);

  const onSubmit = (formData: CompanyInfoFormData) => {
    // Save to store
    setCompanyInfo({
      name: formData.name,
      country: formData.country,
      city: formData.city,
      countryCode: formData.countryCode,
      phoneNumber: formData.phoneNumber,
      businessEmail: formData.businessEmail,
      addressLine: formData.addressLine,
      zipCode: formData.zipCode,
      licenseFile: formData.licenseFile,
      logoFile: formData.logoFile || null,
      coverFile: formData.coverFile || null,
    });

    // Navigate to next step
    nextStep();
    navigate("/sign-up/company/passwords");
  };

  if (!serviceType) {
    return null;
  }

  return (
    <>
      <div className="md:h-screen flex flex-col md:flex-row">
        {/* Left Side - Image with Help Box */}
        <div className="md:h-screen bg-[#1D4B4A] relative w-full md:w-2/7 flex flex-col items-center justify-between pt-[10px] pb-[35px] pl-[20px] pr-[20px] md:pt-6 md:pr-5 md:pb-[30px] md:pl-5">
          <img
            src="/images/backgrounds/left-side-background-carusel.svg"
            alt="login"
            className="w-full h-full object-bottom object-contain absolute inset-0 z-0"
          />
          <div className="absolute inset-0 bg-black/20 z-[1]"></div>
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
              <div className="flex items-start flex-col gap-1 pt-2">
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

        {/* Right Side - Form */}
        <div className="w-full md:w-5/7 h-screen md:overflow-y-auto flex justify-center px-[20px]">
          <div className="w-[550px] md:w-[650px] flex flex-col pt-[50px] md:pt-[50px] pb-[40px]">
            <div className="w-full mb-6 text-center md:text-left">
              <h1 className="text-2xl font-bold text-[#222]">
                Company Information
              </h1>
              <p className="text-[12px] w-full mt-[10px] text-[#5A5A5A] font-medium">
                Please enter your company details
              </p>
            </div>

            <form
              id="company-signup-form"
              onSubmit={handleSubmit(onSubmit)}
              className="w-full space-y-6 rounded-xl border border-[#E4ECEC] p-[20px]"
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Company Name"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your company Name"
                    type="text"
                    hasError={!!errors.name}
                    hintText={errors.name?.message}
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CountrySelect
                      label="Country"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setValue("city", "");
                      }}
                      hasError={!!errors.country}
                      hintText={errors.country?.message}
                    />
                  )}
                />

                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <CitySelect
                      label="City"
                      value={field.value}
                      onChange={field.onChange}
                      countryId={selectedCountryId}
                      hasError={!!errors.city}
                      hintText={errors.city?.message}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-2 p-0 mb-[-10px]">
                <h2 className="text-[14px] font-semibold">
                  Personal phone number
                </h2>
                <div className="flex gap-2 p-0 m-0">
                  <div className="w-2/7">
                    <Controller
                      name="countryCode"
                      control={control}
                      render={({ field }) => (
                        <CommonSelect
                          value={field.value}
                          onChange={field.onChange}
                          options={countryCodes.map((cc) => ({
                            id: cc,
                            name: cc,
                            value: cc,
                          }))}
                          placeholder="Select country"
                          hasError={!!errors.countryCode}
                          hintText={errors.countryCode?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter your phone number"
                          type="tel"
                          hasError={!!errors.phoneNumber}
                          hintText={errors.phoneNumber?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <Controller
                name="businessEmail"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Business e-mail"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your business e-mail"
                    type="email"
                    hasError={!!errors.businessEmail}
                    hintText={errors.businessEmail?.message}
                  />
                )}
              />

              <Controller
                name="addressLine"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Address line"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Address line"
                    type="text"
                    hasError={!!errors.addressLine}
                    hintText={errors.addressLine?.message}
                  />
                )}
              />

              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    label="Zip code"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your zip code"
                    type="text"
                    hasError={!!errors.zipCode}
                    hintText={errors.zipCode?.message}
                  />
                )}
              />

              <Controller
                name="licenseFile"
                control={control}
                render={({ field }) => (
                  <UploadFile
                    file={field.value}
                    setFile={(file) => {
                      field.onChange(file);
                      setCompanyInfo({ licenseFile: file });
                    }}
                    label="Business License"
                    progress={uploadProgress}
                    setProgress={setUploadProgress}
                    completed={uploadCompleted}
                    setCompleted={setUploadCompleted}
                    accept=".jpg,.jpeg,.png,.pdf"
                    error={errors.licenseFile?.message}
                  />
                )}
              />

              <Controller
                name="logoFile"
                control={control}
                render={({ field }) => (
                  <UploadFile
                    file={field.value}
                    setFile={(file) => {
                      field.onChange(file);
                      setCompanyInfo({ logoFile: file });
                    }}
                    label="Company Logo"
                    progress={logoProgress}
                    setProgress={setLogoProgress}
                    completed={logoCompleted}
                    setCompleted={setLogoCompleted}
                    accept=".jpg,.jpeg,.png"
                  />
                )}
              />

              <Controller
                name="coverFile"
                control={control}
                render={({ field }) => (
                  <UploadFile
                    file={field.value}
                    setFile={(file) => {
                      field.onChange(file);
                      setCompanyInfo({ coverFile: file });
                    }}
                    label="Cover Photo"
                    progress={coverProgress}
                    setProgress={setCoverProgress}
                    completed={coverCompleted}
                    setCompleted={setCoverCompleted}
                    accept=".jpg,.jpeg,.png"
                  />
                )}
              />
            </form>

            <div className="flex justify-end items-center gap-3 mt-[20px] pb-[20px]">
              <Link to="/sign-up/company/services">
                <button className="cursor-pointer px-8 py-3 bg-[#F9F9F9] text-[#222222] font-medium rounded-lg hover:bg-[#F2F2F2] transition-colors">
                  Back
                </button>
              </Link>

              <button
                type="submit"
                form="company-signup-form"
                className="px-8 py-3 font-medium rounded-lg transition-colors bg-[#266462] text-white hover:bg-[#1D4B4A] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
