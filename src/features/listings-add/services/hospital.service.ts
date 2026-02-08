"use client";

import { api, getAccessToken } from "@/lib/axios";

import { hospitalConfig } from "../config/hospital.config";
import type { CreateHospitalDTO, UpdateHospitalDTO } from "../types";

const API_BASE = hospitalConfig.apiEndpoints;

const getHeaders = () => {
  const token = getAccessToken();
  return {
    "x-language": "en",
    "x-extranet": token ?? "",
  };
};

const extractId = (response: unknown): number | null => {
  if (!response || typeof response !== "object") return null;
  if (
    "data" in response &&
    typeof (response as { data?: unknown }).data === "number"
  ) {
    return (response as { data: number }).data;
  }
  if (
    "id" in response &&
    typeof (response as { id?: unknown }).id === "number"
  ) {
    return (response as { id: number }).id;
  }
  if (
    "data" in response &&
    typeof (response as { data?: { id?: number } }).data?.id === "number"
  ) {
    return (response as { data: { id: number } }).data.id;
  }
  return null;
};

// Transform form data to API DTOs
function toCreateHospitalDTO(
  formData: Record<string, unknown>
): CreateHospitalDTO {
  const locations = formData.locations as
    | {
        headquartersName?: string;
        headquartersAddress?: string;
      }
    | undefined;
  const missionVision = formData.missionVision as
    | { mission?: string; vision?: string }
    | undefined;
  return {
    name: (locations?.headquartersName as string) ?? "",
    description: (locations?.headquartersAddress as string) ?? "",
    mission: (missionVision?.mission as string) ?? "",
    vision: (missionVision?.vision as string) ?? "",
  };
}

function toUpdateHospitalDTO(
  id: number,
  formData: Record<string, unknown>
): UpdateHospitalDTO {
  const locations = formData.locations as
    | {
        headquartersName?: string;
        headquartersAddress?: string;
      }
    | undefined;
  const missionVision = formData.missionVision as
    | { mission?: string; vision?: string }
    | undefined;
  return {
    id,
    name: locations?.headquartersName,
    description: locations?.headquartersAddress,
    mission: missionVision?.mission,
    vision: missionVision?.vision,
  };
}

export const hospitalApiService = {
  // Get a hospital listing by ID
  async getListing(id: number): Promise<Record<string, unknown>> {
    const response = await api.get(`${API_BASE.read}/${id}`, {
      headers: getHeaders(),
    });
    const data = response.data.data;
    // Basic transform, can be expanded as needed
    return {
      locations: {
        headquartersName: data.name ?? "",
        headquartersAddress: data.description ?? "",
        branches: [],
      },
      missionVision: {
        mission: data.mission ?? "",
        vision: data.vision ?? "",
      },
      statistics: {
        statistics: [],
      },
      certificates: {
        certificates: [],
      },
      awards: {
        awards: [],
      },
      media: {
        photos: [],
      },
    };
  },

  // Create a new hospital listing
  async createHospital(data: CreateHospitalDTO): Promise<{ id: number }> {
    const response = await api.post(API_BASE.create, data, {
      headers: getHeaders(),
    });

    const id = extractId(response.data);
    if (!id) {
      throw new Error("Failed to create hospital listing");
    }
    return { id };
  },

  // Update hospital
  async updateHospital(data: UpdateHospitalDTO): Promise<void> {
    await api.put(API_BASE.update, data, {
      headers: getHeaders(),
    });
  },

  // Upload hospital media (photos)
  async uploadMedia(hospitalId: number, photos?: File[] | null): Promise<void> {
    if (!photos || photos.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("id", hospitalId.toString());
    photos.forEach((photo) => {
      formData.append("photos[]", photo);
    });

    await api.post(API_BASE.uploadMedia!, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Execute step action
  async executeStepAction(
    action: string,
    formData: Record<string, unknown>,
    entityId: number | null,
    _appUserId?: string | number
  ): Promise<{ id?: number } | void> {
    switch (action) {
      case "create": {
        const createDTO = toCreateHospitalDTO(formData);
        const result = await this.createHospital(createDTO);
        return result;
      }

      case "update": {
        if (!entityId) throw new Error("Hospital ID is required for updating");
        const updateDTO = toUpdateHospitalDTO(entityId, formData);
        await this.updateHospital(updateDTO);
        break;
      }

      case "uploadMedia": {
        if (!entityId)
          throw new Error("Hospital ID is required for uploading media");
        const media = formData.media as { photos?: File[] | null } | undefined;
        const photos = media?.photos ?? null;
        await this.uploadMedia(entityId, photos);
        break;
      }

      default:
        console.warn(`Unknown action: ${action}`);
    }
  },
};
