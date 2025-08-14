"use server"
import "server-only"

import { GoogleGenAI, Modality } from "@google/genai"
import { nanoid } from "nanoid"
import { getTranslations } from "next-intl/server"

type Args = {
  name: string
  description?: string | null
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const getPrompt = ({ name, description }: Args) => {
  const basePrompt = `Professional photography of ${name}`
  const descriptionPart = description ? `, ${description}` : ""
  const stylePart =
    ", high quality, clean background, commercial photography style, well-lit, 4K resolution, studio lighting"

  return `${basePrompt}${descriptionPart}${stylePart}`
}

const generateAiImage = async ({
  name,
  description,
}: Args): Promise<
  ResT<{
    file: File
  }>
> => {
  const t = await getTranslations()
  const prompt = getPrompt({ name, description })

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: [prompt],
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  })

  const parts = response?.candidates?.[0]?.content?.parts

  if (parts) {
    for (const part of parts) {
      const imgData = part.inlineData?.data
      if (imgData) {
        const buffer = Buffer.from(imgData, "base64")
        const blob = new Blob([buffer], {
          type: "image/webp",
        })

        const file = new File([blob], `${encodeURI(name)}-${nanoid()}.webp`, {
          type: "image/webp",
        })

        return {
          success: {
            data: {
              file,
            },
          },
          error: null,
        }
      }
    }
  }

  return {
    success: null,
    error: {
      message: t("Failed to generate image"),
    },
  }
}

export { generateAiImage }
