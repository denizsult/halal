import type { ListingConfig } from "../types";

export const transferConfig: ListingConfig = {
  type: "transfer",
  displayName: "Transfer",
  steps: [
    {
      id: "car-model",
      title: "Car Model",
      description:
        "Confirm the model of your car so we can match it to your listing.",
      infoAlert:
        "You can find this information on the car registration certificate.",
      submitAction: "create",
      toast: {
        success: "Car model saved.",
        error: "Failed to save car model.",
      },
      fields: [
        {
          name: "car_brand_id",
          label: "Brand",
          type: "select",
          dynamicOptions: "brands",
          required: true,
          span: 1,
        },
        {
          name: "car_model_id",
          label: "Model",
          type: "select",
          dynamicOptions: "models",
          required: true,
          span: 1,
          dependsOn: "car_brand_id",
        },
        {
          name: "plate_number",
          label: "Plate Number",
          type: "text",
          placeholder: "e.g., 34 ABC 123",
          required: true,
          span: 1,
        },
        {
          name: "car_model_year",
          label: "Year",
          type: "number",
          placeholder: "e.g., 2023",
          required: true,
          span: 1,
        },
        {
          name: "country_id",
          label: "Country of Registration",
          type: "select",
          dynamicOptions: "countries",
          required: true,
          span: 1,
        },
        {
          name: "mileage",
          label: "Mileage",
          type: "number",
          placeholder: "e.g., 50000",
          required: true,
          span: 1,
        },
        {
          name: "fuel_type",
          label: "Fuel",
          type: "select",
          options: [
            { value: 1, label: "Petrol" },
            { value: 2, label: "Diesel" },
            { value: 3, label: "Electric" },
            { value: 4, label: "Hybrid" },
          ],
          required: true,
          span: 1,
        },
        {
          name: "transmission_type",
          label: "Transmission",
          type: "radio",
          options: [
            { value: 1, label: "Automatic" },
            { value: 2, label: "Manual" },
          ],
          required: true,
          span: 2,
        },
        {
          name: "number_of_luggage",
          label: "Number of Luggage",
          type: "radio",
          options: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
          ],
          required: true,
          span: 2,
        },
        {
          name: "number_of_seats",
          label: "Number of Seats",
          type: "radio",
          options: [
            { value: 2, label: "2" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
            { value: 6, label: "6" },
            { value: 7, label: "7+" },
          ],
          required: true,
          span: 2,
        },
        {
          name: "transfer_feature_ids",
          label: "Any other features",
          type: "checkboxGroup",
          dynamicOptions: "features",
          helpText: "Select all features that apply to your car",
          span: 2,
        },
        {
          name: "number_of_doors",
          label: "Number of Doors",
          type: "radio",
          options: [
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
          ],
          required: true,
          span: 2,
        },
        {
          name: "is_profession_owner",
          label: "Ownership Type",
          type: "radio",
          options: [
            { value: false, label: "Private Owner" },
            { value: true, label: "Professional Owner" },
          ],
          required: true,
          span: 2,
        },
      ],
    },
    {
      id: "company-locations",
      title: "Company Locations",
      description:
        "Add your company locations so customers can find you easily.",
      submitAction: "updateInformations",
      toast: {
        success: "Locations saved.",
        error: "Failed to save locations.",
      },
      fields: [
        {
          name: "transfer_branches",
          label: "Company Locations",
          type: "custom",
          customComponent: "TransferBranches",
          helpText: "Add all locations where you provide transfer service",
          required: true,
          span: 2,
        },
      ],
    },
    {
      id: "area-of-expertise",
      title: "Area of Expertise",
      description:
        "Define your area of expertise to help us match you with the right customers.",
      submitAction: "updateInformations",
      toast: {
        success: "Expertise saved.",
        error: "Failed to save expertise.",
      },
      fields: [
        {
          name: "transfer_expertises",
          label: "Area of Expertise",
          type: "custom",
          customComponent: "TransferExpertises",
          helpText: "Add your specialized transfer routes and services",
          required: true,
          span: 2,
        },
      ],
    },
    {
      id: "pricing",
      title: "Pricing",
      description: "Set your prices per day according to demand.",
      infoAlert:
        "We charge a 25% service fee from your earnings after each transfer.",
      submitAction: "updatePricing",
      toast: {
        success: "Pricing updated.",
        error: "Failed to update pricing.",
      },
      fields: [
        {
          name: "pricing",
          label: "Pricing Configuration",
          type: "custom",
          customComponent: "TransferPricing",
          span: 2,
        },
      ],
    },
    {
      id: "media",
      title: "Upload Photos",
      description:
        "What does your property look like? Upload high-quality photos of your vehicle to get more bookings.",
      infoAlert:
        "Vehicles with more photos get more bookings. We recommend at least 5 photos.",
      submitAction: "uploadMedia",
      toast: {
        success: "Photos uploaded.",
        error: "Failed to upload photos.",
      },
      fields: [
        {
          name: "images",
          label: "Vehicle Photos",
          type: "file",
          required: true,
          helpText: "Upload at least one photo of your vehicle",
          fileConfig: {
            multiple: true,
            maxFiles: 10,
            accept: "image/*",
            existingKey: "existingImages",
            existingLabel: "Existing vehicle photos",
          },
          span: 2,
        },
      ],
    },
  ],
  apiEndpoints: {
    create: "/v1/transfers/listings",
    update: "/v1/transfers/listings",
    delete: "/v1/transfers/listings",
    read: "/v1/transfers/listings/:id",
    uploadMedia: "/v1/transfers/listings/{id}/images",
    updatePricing: "/v1/transfers/listings/{id}/pricing",
    updateInformations: "/v1/transfers/listings/{id}/informations",
  },
};
