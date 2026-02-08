import type { ListingConfig } from "../types";

export const hospitalConfig: ListingConfig = {
  type: "hospital",
  displayName: "Hospital",
  useOverviewBetweenSteps: true,

  steps: [
    {
      id: "hospital-details",
      title: "Hospital details",
      description:
        "Enter your hospital's name, location, and general information.",
      submitAction: "create",
      toast: {
        success: "Hospital details saved.",
        error: "Failed to save hospital details.",
      },
      subSteps: [
        {
          id: "locations",
          label: "Locations",
          fields: [
            "locations.headquartersName",
            "locations.headquartersAddress",
          ],
        },
        {
          id: "mission-vision",
          label: "Mission & Vision",
          fields: ["missionVision.mission", "missionVision.vision"],
        },
        {
          id: "statistics",
          label: "Statistics",
          fields: [],
        },
        {
          id: "certificates",
          label: "Certificates",
          fields: [],
        },
        {
          id: "awards",
          label: "Awards",
          fields: [],
        },
      ],
      fields: [
        {
          name: "hospitalDetails",
          label: "Hospital details",
          type: "custom",
          customComponent: "HospitalDetails",
          span: 2,
        },
      ],
    },
    {
      id: "doctors",
      title: "Our doctors",
      description:
        "Add profiles of your doctors, their specialties, and experience.",
      fields: [
        {
          name: "doctors",
          label: "Our doctors",
          type: "custom",
          customComponent: "HospitalDoctors",
          span: 2,
        },
      ],
    },
    {
      id: "services",
      title: "Services",
      description:
        "List all medical services, departments, and treatment options available.",
      fields: [
        {
          name: "services",
          label: "Services",
          type: "custom",
          customComponent: "HospitalServices",
          span: 2,
        },
      ],
    },
    {
      id: "media",
      title: "Upload Media",
      description:
        "Add photos of your hospital’s interior and exterior to give patients a visual impression.",
      submitAction: "uploadMedia",
      fields: [
        {
          name: "media",
          label: "Media assets",
          type: "custom",
          customComponent: "HospitalMedia",
          span: 2,
        },
      ],
    },
  ],
  apiEndpoints: {
    create: "/api/proxy/api/main/extranet/hospitals/add",
    update: "/api/proxy/api/main/extranet/hospitals/update",
    delete: "/api/proxy/api/main/extranet/hospitals/delete",
    read: "/api/proxy/api/main/extranet/hospitals",
    uploadMedia: "/api/proxy/api/main/extranet/hospitals/media/upload",
  },
};
