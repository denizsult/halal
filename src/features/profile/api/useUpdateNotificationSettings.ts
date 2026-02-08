import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import type { MutationConfig } from "@/lib/react-query";
import type { ApiResponse, NotificationSettings } from "@/types/api";

import { notificationSettingsQueryKey } from "./useGetNotificationSettings";

const updateNotificationSettings = async (
  payload: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  const response = await api.put<ApiResponse<NotificationSettings>>(
    "/v1/profile/notifications",
    payload
  );
  if (!response.data.success || response.data.data == null) {
    throw new Error("Failed to update notification settings");
  }
  return response.data.data;
};

export const useUpdateNotificationSettings = (
  config?: MutationConfig<typeof updateNotificationSettings>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: updateNotificationSettings,
    onSuccessMessage: "Notification settings updated",
    onErrorMessage: "Failed to update notification settings",
    refetchQueries: [notificationSettingsQueryKey],
  });
};
