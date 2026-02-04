import { Bell, Menu, Search,Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/providers/SidebarContext";

import UserDropdown from "./UserDropdown";

export default function AppHeader() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

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

        <div className="hidden md:flex relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." type="text" className="pl-9" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>

        <UserDropdown />
      </div>
    </header>
  );
}
