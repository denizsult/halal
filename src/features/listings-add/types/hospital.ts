import type { BaseFormData } from "./base";

// Complete hospital form data
export interface HospitalFormData extends BaseFormData {
  // Step 1: Locations
  locations: {
    headquartersName: string;
    headquartersAddress: string;
    branches: {
      name: string;
      address: string;
      isTemporarilyClosed?: boolean;
    }[];
  };

  // Step 2: Mission & Vision
  missionVision: {
    mission: string;
    vision: string;
  };

  // Step 3: Statistics
  statistics: {
    statistics: {
      title: string;
      value: string;
    }[];
  };

  // Step 4: Certificates
  certificates: {
    certificates: {
      title: string;
      file?: File | null;
    }[];
  };

  // Step 5: Awards
  awards: {
    awards: {
      title: string;
      file?: File | null;
    }[];
  };

  // Step 6: Media
  media: {
    photos?: File[] | null;
  };

  // Step 2: Doctors
  doctors: {
    doctors: {
      title: string;
      fullName: string;
      rating: string;
      about: string;
      expertise: string[];
      statistics: {
        title: string;
        value: string;
      }[];
      photo?: File | null;
      license?: File | null;
      certificates?: File[] | null;
    }[];
  };

  // Step 3: Services
  services: {
    services: {
      title: string;
      about: string;
      symptoms: string[];
      doctors: string[];
      statistics: {
        title: string;
        value: string;
      }[];
      photo?: File | null;
      cover?: File | null;
    }[];
  };
}

// Initial hospital form data
export const initialHospitalFormData: HospitalFormData = {
  locations: {
    headquartersName: "",
    headquartersAddress: "",
    branches: [],
  },
  missionVision: {
    mission: "",
    vision: "",
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
  doctors: {
    doctors: [],
  },
  services: {
    services: [],
  },
};

// API DTOs
export interface CreateHospitalDTO {
  name: string;
  description: string;
  mission: string;
  vision: string;
}

export interface UpdateHospitalDTO {
  id: number;
  name?: string;
  description?: string;
  mission?: string;
  vision?: string;
}

export interface HospitalMediaDTO {
  id: number;
  photos?: File[];
}
