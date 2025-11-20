
export interface ServicePlus {
  id: string;
  name: string;
  description: string;
  businessLine: 'Google Cloud' | 'AWS';
  productType: 'Propio' | 'Representado';
  category: string;
  rating: number;
  driveFolderUrl?: string;
  keyBenefits: {
    title: string;
    description: string;
  }[];
}

export interface SalesDocument {
  id: string;
  serviceId: string;
  name:string;
  type: 'PDF' | 'PPT' | 'DOC';
  url: string;
}

export interface CaseStudy {
  id: string;
  serviceId: string;
  title: string;
  summary: string;
  imageUrl: string;
}

export interface Expert {
  id: string;
  serviceId: string;
  name: string;
  role: string;
  email?: string;
  imageUrl: string;
}

export interface PricingPlan {
  planName: 'Básico' | 'Operativo' | 'Premium';
  cost: number;
  price: number;
}

export interface Addon {
    id: string;
    name: string;
    cost: number;
    price: number;
}

export interface PricingRule {
  serviceId: string;
  plans: PricingPlan[];
  addons: Addon[];
}

export interface Quote {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  planName: 'Básico' | 'Operativo' | 'Premium';
  licenses: number;
  selectedAddons: string[];
  discount: number;
  createdAt: string;
}
