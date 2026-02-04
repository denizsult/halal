import type { ListingConfig } from "../types";

export const hospitalConfig: ListingConfig = {
  type: "hospital",
  displayName: "Hospital",
  
  steps: [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Enter basic hospital information.",
      submitAction: "create",
      toast: {
        success: "Hospital details saved.",
        error: "Failed to save hospital details.",
      },
      fields: [
        {
          name: "name",
          label: "Hospital Name",
          type: "text",
          placeholder: "e.g., Istanbul Medical Center",
          required: true,
          span: 2,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Describe your hospital...",
          required: true,
          span: 2,
        },
      ],
    },
    {
      id: "mission-vision",
      title: "Mission & Vision",
      description: "Define the hospital's mission and vision statements.",
      submitAction: "update",
      fields: [
        {
          name: "mission",
          label: "Mission Statement",
          type: "textarea",
          placeholder: "What is your hospital's mission?",
          required: true,
          span: 2,
        },
        {
          name: "vision",
          label: "Vision Statement",
          type: "textarea",
          placeholder: "What is your hospital's vision?",
          required: true,
          span: 2,
        },
      ],
    },
    {
      id: "media",
      title: "Media Assets",
      description: "Upload hospital logo and cover images.",
      submitAction: "uploadMedia",
      fields: [
        {
          name: "logo",
          label: "Hospital Logo",
          type: "file",
          helpText: "Upload your hospital logo (recommended: 200x200px)",
          fileConfig: {
            multiple: false,
            maxFiles: 1,
            accept: "image/*",
          },
          span: 1,
        },
        {
          name: "cover",
          label: "Cover Image",
          type: "file",
          helpText: "Upload a cover image (recommended: 1200x400px)",
          fileConfig: {
            multiple: false,
            maxFiles: 1,
            accept: "image/*",
          },
          span: 1,
        },
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      description: "Add contact details and location information.",
      submitAction: "update",
      fields: [
        {
          name: "address",
          label: "Address",
          type: "textarea",
          placeholder: "Full address of your hospital",
          span: 2,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "text",
          placeholder: "+90 xxx xxx xx xx",
          span: 1,
        },
        {
          name: "email",
          label: "Email",
          type: "text",
          placeholder: "contact@hospital.com",
          span: 1,
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
