import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarCheck,
  CarFront,
  MessageSquare,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type Notification = {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    icon: CalendarCheck,
    iconBg: "bg-green-100 text-green-600",
    title: "New booking received",
    description: "John Doe booked Mercedes E-Class for 3 days",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    icon: Star,
    iconBg: "bg-yellow-100 text-yellow-600",
    title: "New review",
    description: "You received a 5-star review from Sarah",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    icon: CarFront,
    iconBg: "bg-blue-100 text-blue-600",
    title: "Listing approved",
    description: "Your BMW X5 listing is now live",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    icon: MessageSquare,
    iconBg: "bg-purple-100 text-purple-600",
    title: "New message",
    description: "Ali sent you a message about Transfer service",
    time: "Yesterday",
    read: true,
  },
];

export function NotificationPopover() {
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl bg-gray-50 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs text-brand-500 font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <Separator />

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.read ? "bg-blue-50/50" : ""
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notification.iconBg}`}
              >
                <notification.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-brand-500 hover:text-brand-600"
            onClick={() => navigate("/profile?tab=notifications")}
          >
            Notification settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
