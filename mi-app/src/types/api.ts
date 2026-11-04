export type ApiError = {
  message: string | string[];
  error: string;
  statusCode: number;
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type HowItWorksStep = {
  step: number;
  title: string;
  description: string;
};

export type LandingResponse = {
  services: Category[];
  howItWorks: HowItWorksStep[];
  trust: {
    verifiedTechnicians: number;
    completedServices: number;
  };
};

export type TechnicianRegisterResponse = {
  id: string;
  email: string;
  fullName: string;
  role: "technician";
  technicianProfile: {
    id: string;
    isVerified: boolean;
    documentsCount: number;
  };
  message: string;
};
