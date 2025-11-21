import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, PromptResponse, ProductType } from "../types";

// Initialize the client with the API Key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePrompts = async (data: ProductData): Promise<PromptResponse> => {
  const modelName = 'gemini-2.5-flash'; 

  // Logic to adapt instructions based on product type
  let actionGuidance = "";
  let lookGuidance = "";

  if (data.productType === ProductType.FASHION) {
    lookGuidance = `The "LOOK" section must describe the '${data.productName}' being WORN by the influencer. Describe the fit, fabric, and style in detail.`;
    actionGuidance = `In "ACTIONS", she must model the outfit: turning, adjusting the fabric, showing details on her body. She should point to the "link/cart" gestures.`;
  } else {
    lookGuidance = `The "LOOK" section should describe a trendy outfit that fits the vibe of '${data.environment}', but the product is held in her hands.`;
    actionGuidance = `In "ACTIONS", she holds the '${data.productName}' up to the camera, demonstrates how it works, points to specific features, and does the "link/cart" gestures.`;
  }

  const priceInstruction = data.hasPrice 
    ? `Include the price (${data.price}) naturally in the Portuguese dialogue.` 
    : `Do not mention a specific number. Use terms like "preço de fábrica", "super oferta", "queima de estoque".`;

  const systemInstruction = `
    You are an elite Prompt Engineer for Veo3 and Sora2.
    
    YOUR TASK:
    Generate 4 distinct video generation prompts based on the product data.
    
    INPUT DATA:
    - Product: ${data.productName}
    - Type: ${data.productType}
    - Features: ${data.features}
    - Environment: ${data.environment}
    - Price Strategy: ${priceInstruction}

    OUTPUT FORMAT RULES:
    You must STRICTLY follow the structure below for every prompt. Do not change the headers.
    
    TEMPLATE STRUCTURE (Fill in the brackets):

    CHARACTER:
    [Description of a stunning influencer suitable for the niche (e.g., blonde, brunette, curly hair). Describe physical traits, expression, and charisma.]

    LOOK:
    [${lookGuidance} Describe accessories and general style.]

    SCENE SETUP:
    Location: ${data.environment}.
    Background: [Specific details of the background matching the location].
    Lighting: [Lighting details, e.g., Golden Hour, Studio Bright, Neon].
    Aspect ratio: 9:16 vertical, photorealistic 4K quality.

    CAMERA MOVEMENTS:
    [Cinematic instructions. Start with full shot or medium shot. Zoom details. Focus adjustments.]

    ACTIONS:
    [${actionGuidance}. She acts confident, smiles, gestures numbers with hands, gives thumbs up, points down repeatedly for the cart.]

    DIALOGUE (Portuguese): INFLUENCIADORA: "[Write a natural, high-energy script in PT-BR. She MUST mention the 'Carrinho Laranja' (Orange Cart). Keep it under 8 seconds spoken. ${priceInstruction}]"

    ENDING:
    She smiles broadly, [closing action].
    After the main shot fades, a short animated outro appears featuring the TikTok logo in the lower right corner, followed by the glowing white text “@achadinhos_da_ellenr”.
    The animation lasts around 1.5 seconds, with a smooth fade-in and subtle pulse effect, matching the video’s lighting.
    Keep it elegant, cinematic, and professional.

    --------------------------------------------------

    STRATEGIES FOR THE 4 VARIATIONS:
    1. **Visual Impact:** Focus on the beauty/aesthetic of the product/location.
    2. **Pain/Benefit:** Focus on solving a problem quickly.
    3. **Urgency/Sale:** Focus on "Last units", "Promotion".
    4. **Detailed Demo:** Focus on showing exactly how the product works or fits.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate 4 structured prompts for ${data.productName} situated in ${data.environment}. Follow the strict header format provided.`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Short title (e.g., 'Variation 1: Visual Impact')" },
                  fullPrompt: { type: Type.STRING, description: "The COMPLETE text block starting with 'CHARACTER:' and ending with the 'ENDING:' section." },
                  strategy: { type: Type.STRING, description: "Strategy used." }
                },
                required: ["title", "fullPrompt", "strategy"]
              }
            }
          },
          required: ["prompts"]
        }
      }
    });

    const jsonText = response.text;
    return JSON.parse(jsonText) as PromptResponse;

  } catch (error) {
    console.error("Error generating prompts:", error);
    throw new Error("Falha ao gerar os prompts. Tente novamente.");
  }
};