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
export async function filterScraper(text: string, companyName: string): Promise<any> {
  try {
    const prompt = `
    I need you to extract only the relevant information about the company based on the company name: ${companyName}.

    Input Text:
    ${text}

    Instructions:
    Identify and retain only the text that provides legitimate information about the company.
    Match the data with the company name. If the data do not match with company name, exclude it except there is a sentence that the company name match the data.
    This includes details such as its description, services, activities, or industry.
    Remove any unrelated or irrelevant text that does not pertain directly to the company or its operations.

    If you cannot find relevant data, just let it empty!!!

    Output Format:
    Return the extracted company information as a concise paragraph.
    IMPORTANT: Only include valid company information. Do not add any additional text or commentary.
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are an assistant that extracts company profiles." }, { role: "user", content: prompt }],
      temperature: 0.7,
    });

    const completion = response.choices[0].message?.content;
    return completion || "Error: No response received from the model.";
  } catch (error) {
    console.error("Error extracting company profile:", error);
    throw new Error("Failed to extract company profile.");
  }
}
