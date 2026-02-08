import { useQuery } from "@tanstack/react-query";

import { api, getAccessToken } from "@/lib/axios";
import type { ApiResponse, NotificationSettings } from "@/types/api";

export const notificationSettingsQueryKey = [
  "profile",
  "notifications",
] as const;

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await api.get<ApiResponse<NotificationSettings>>(
    "/v1/profile/notifications"
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to fetch notification settings");
  }
  return response.data.data;
};

export const useGetNotificationSettings = () => {
  return useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: getNotificationSettings,
    enabled: !!getAccessToken(),
    refetchOnMount: true,
  });
};
