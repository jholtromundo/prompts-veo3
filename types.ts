export enum TargetModel {
  VEO3 = 'Veo3',
  SORA2 = 'Sora2'
}

export enum ProductType {
  PHYSICAL = 'Physical Object', // Handheld items, gadgets, cosmetics
  FASHION = 'Fashion/Clothing'  // Items worn by the model
}

export interface ProductData {
  productName: string;
  features: string;
  price: string;
  hasPrice: boolean;
  targetModel: TargetModel;
  productType: ProductType;
  environment: string;
}

export interface GeneratedPrompt {
  title: string;
  fullPrompt: string; // The strict block format
  strategy: string;
}

export interface PromptResponse {
  prompts: GeneratedPrompt[];
}