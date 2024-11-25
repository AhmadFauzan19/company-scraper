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
    i scrape data from website, i want you to check the validation especially of email and phone

    Text: 
    ${text}

    if it is not valid, you can delete it, and make it empty
    
    if the key is empty, let it empty, do not add with another word or code

    **Output Format**: Return the information in **valid JSON format** look like the input.
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
