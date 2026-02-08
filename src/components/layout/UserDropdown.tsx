import { useNavigate } from "react-router-dom";
import { Building, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/Auth/api";
import { useAuthStore } from "@/stores/auth.store";

export default function UserDropdown() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 text-gray-700 dark:text-gray-400 outline-none">
          <Avatar className="bg-brand-500">
            <AvatarImage src={user?.profile_photo_url ?? ""} alt={user?.name} />
            <AvatarFallback className="bg-brand-500 text-white">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="font-semibold text-gray-900 text-sm">
              {user?.name}
            </span>
            <span className="text-gray-400 text-xs">{user?.email}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="md:hidden">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/profile?tab=company")}>
            <Building className="mr-2 h-4 w-4" />
            <span>Company Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/profile?tab=security")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
