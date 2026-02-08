import { Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/providers/SidebarContext";

import { NotificationPopover } from "./NotificationPopover";
import UserDropdown from "./UserDropdown";
import { useNavigate } from "react-router-dom";

export default function AppHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();
  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky bg-white top-0 z-50 py-3 px-6 border-b border-gray-100 flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggle}
          className="lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
          className="rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        <NotificationPopover />

        <UserDropdown />
      </div>
    </header>
  );
}
