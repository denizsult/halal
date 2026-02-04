import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  LayoutGrid,
  LogOut,
  Package,
  User,
  Users,
} from "lucide-react";

import { useSidebar } from "@/providers/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

export interface SidebarItemProps {
  icon: string | React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps): React.ReactElement => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active ? "bg-brand-400" : "hover:bg-brand-400/50"
      }`}
    >
      {typeof icon === "string" ? (
        <img className="w-4 h-4" alt={label} src={icon} />
      ) : (
        <span className="w-4 h-4 flex items-center justify-center text-white [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </span>
      )}

      <div className="font-semibold text-white text-sm">{label}</div>
    </button>
  );
};

const navItems: NavItem[] = [
  { icon: <LayoutGrid />, name: "Dashboard", path: "/dashboard" },
  { icon: <Package />, name: "Listings", path: "/listings" },
  { icon: <Users />, name: "Customers", path: "/customers" },
  { icon: <CreditCard />, name: "Billings & earnings", path: "/billings" },
  { icon: <User />, name: "Profile", path: "/profile" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(path + "/"),
    [pathname]
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/sign-in");
  };

  const renderMenuItems = () => (
    <div className="flex flex-col gap-1">
      {navItems.map((nav) => (
        <div key={nav.name}>
          {nav.path && (
            <Link to={nav.path}>
              <SidebarItem
                icon={nav.icon}
                label={nav.name}
                active={isActive(nav.path)}
              />
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 bg-[#1D4B4A] h-screen transition-all duration-300 z-50 overflow-hidden
        ${isExpanded || isHovered || isMobileOpen ? "w-[275px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isExpanded || isHovered || isMobileOpen) && (
        <div className="absolute inset-0 opacity-80">
          <img
            src="/images/backgrounds/topographic.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full p-4 gap-8">
        {/* Logo */}
        <Link to="/dashboard">
          <img src="/images/logo/logo.svg" alt="Logo" width={191} height={27} />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col flex-1 gap-4">
          <p className="text-brand-25 text-sm">Main menu</p>
          {renderMenuItems()}
        </nav>

        {/* Help Widget */}
        <div className="flex flex-col gap-2.5 p-4 bg-brand-500 rounded-2xl border border-brand-400">
          <div className="w-10 h-10 bg-brand-400 rounded-full flex items-center justify-center">
            <span role="img" aria-label="chat">
              💬
            </span>
          </div>
          <div>
            <div className="text-white font-semibold">Need Help?</div>
            <p className="text-gray-50 text-sm">
              If you have any questions, issues, or just need a hand, our
              support team is ready to help.
            </p>
          </div>
          <button className="text-yellow-500 text-sm text-left">
            Learn more
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 hover:bg-brand-400/50 rounded-lg"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
