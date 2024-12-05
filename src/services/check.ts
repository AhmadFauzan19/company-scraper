import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in .env file
});

/**
 * Extract company profile from raw text using OpenAI GPT-4.
 * @param {string} text - The raw text from the company website.
 * @returns {Promise<string>} - The extracted company profile.
 */
export async function checkValidation(text: string): Promise<any> {
  try {
    const prompt = `
    I need you to validate email addresses and phone numbers extracted from a website. Here's the input:

    Input Text:
    ${text}

    Validation Rules:
    
    Email:

    Must follow the standard email format (e.g., example@domain.com).
    If invalid, remove it and set the field to an empty string ("").

    Phone Number:

    Must be a valid phone number (include country code if applicable).
    If invalid, remove it and set the field to an empty string ("").
    If any key in the input is already empty, leave it as is. Do not replace it with any value or code.

    Output Format:
    Return the validated data in valid JSON format, following the structure of the input.
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are an assistant that extracts company profiles." }, { role: "user", content: prompt }],
    });

    const completion = response.choices[0].message?.content;
    return completion || "Error: No response received from the model.";
  } catch (error) {
    console.error("Error extracting company profile:", error);
    throw new Error("Failed to extract company profile.");
  }
}
