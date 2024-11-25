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
    i scrape data from website, i want you to cut the unnecessary text and take the text that provide information about the company based on company name: ${companyName}

    Text: 
    ${text}

    if the text is not a legit information about the company, just cut it, and send the text who contains the data about company

    **Output Format**: Return the information in paragraph.

    !!IMPORTANT: just give the output about the company information, do not add something else
`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
