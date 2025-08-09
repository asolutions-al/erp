"use server"
import "server-only"

import { aiAnalysisBucket } from "@/constants/bucket"
import { publicStorageUrl } from "@/constants/consts"
import { ProductUnitT } from "@/types/enum"
import { GoogleGenAI, Type } from "@google/genai"
import { getTranslations } from "next-intl/server"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
      },
      price: {
        type: Type.NUMBER,
      },
      description: {
        type: Type.STRING,
      },
      unit: {
        type: Type.STRING, // TODO: add enum
      },
      categories: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
    propertyOrdering: ["name", "price", "description", "unit", "categories"],
  },
}

const prompt = `
Analyze this image and extract product information. This appears to be a menu or product catalog.

Please identify all products in the image and extract the following information for each product:
- Product name
- Price (extract the numerical value)
- Description (if available)
- Unit (XPP, XKG, XL, etc.)
- Category (if identifiable)

Important guidelines:
1. Only extract products that are clearly visible and have identifiable names and prices
2. If a price is not clearly visible, estimate it as 0.00
3. Use "XPP" as the default unit if not specified
4. If no category is identifiable, leave it empty
5. Ensure all prices are numerical values (not strings)
`

type AiProductSchemaT = {
  name: string
  price: number
  description: string
  unit: ProductUnitT
  categories: string[]
}

const analyzeImageProducts = async (
  imagePath: string
): Promise<ResT<AiProductSchemaT[]>> => {
  const t = await getTranslations()
  const imageRes = await fetch(
    `${publicStorageUrl}/${aiAnalysisBucket}/${imagePath}`
  )

  if (!imageRes.ok) {
    return {
      success: null,
      error: {
        message: t("Failed to fetch image"),
      },
    }
  }

  // Generate content with structured output using the new API
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [
      prompt,
      {
        inlineData: {
          data: Buffer.from(
            new Uint8Array(await imageRes.arrayBuffer())
          ).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  })

  const { text } = res

  if (!text) {
    return {
      success: null,
      error: {
        message: t("No response text from AI model"),
      },
    }
  }

  const products = JSON.parse(text) as AiProductSchemaT[]
  return {
    success: { data: products },
    error: null,
  }
}

export { analyzeImageProducts }
