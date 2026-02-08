import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettings } from "@/types/api";

import {
  useGetNotificationSettings,
  useUpdateNotificationSettings,
} from "../api";

const notificationItems: {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "email_notifications",
    label: "Email Notifications",
    description: "Receive email updates about your account",
  },
  {
    key: "push_notifications",
    label: "Push Notifications",
    description: "Receive push notifications on your device",
  },
  {
    key: "marketing_emails",
    label: "Marketing Emails",
    description: "Receive emails about new features and offers",
  },
  {
    key: "booking_updates",
    label: "Booking Updates",
    description: "Get notified about new bookings",
  },
];

export function NotificationsTab() {
  const { data: settings, isLoading } = useGetNotificationSettings();
  const updateNotifications = useUpdateNotificationSettings();

  const handleToggle = (key: keyof NotificationSettings, checked: boolean) => {
    updateNotifications.mutate({ [key]: checked });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationItems.map((item, index) => (
          <div key={item.key}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Switch
                checked={settings?.[item.key] ?? false}
                onCheckedChange={(checked) => handleToggle(item.key, checked)}
                disabled={updateNotifications.isPending}
              />
            </div>
            {index < notificationItems.length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
