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
  return {
    name: formData.name as string,
    description: formData.description as string,
    mission: formData.mission as string,
    vision: formData.vision as string,
  };
}

function toUpdateHospitalDTO(
  id: number,
  formData: Record<string, unknown>
): UpdateHospitalDTO {
  return {
    id,
    name: formData.name as string | undefined,
    description: formData.description as string | undefined,
    mission: formData.mission as string | undefined,
    vision: formData.vision as string | undefined,
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
      name: data.name,
      description: data.description,
      mission: data.mission,
      vision: data.vision,
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

  // Upload hospital media (logo and cover)
  async uploadMedia(
    hospitalId: number,
    logo?: File | null,
    cover?: File | null
  ): Promise<void> {
    if (!logo && !cover) {
      return; // Nothing to upload
    }

    const formData = new FormData();
    formData.append("id", hospitalId.toString());

    if (logo) {
      formData.append("logo", logo);
    }
    if (cover) {
      formData.append("cover", cover);
    }

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
        const logo = formData.logo as File | null;
        const cover = formData.cover as File | null;
        await this.uploadMedia(entityId, logo, cover);
        break;
      }

      default:
        console.warn(`Unknown action: ${action}`);
    }
  },
};
