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
export async function extractCompanyProfile(text: string): Promise<any> {
  try {
    const prompt = `
Extract a structured company profile from the following text. 
Include: Company Name, Description, Products/Services, Industry, and Social Media links, email, phones, referencesLink, error
Text:
${text}

translate text to english first if its not in english

just print the output from { to }

if you cannot extract the data properly, just give the same output and just fill the company name and add error message in error key, and the other just key but the value is empty
just give output like the output, do not add another word before or after it

Output:
{
  "Company Name": "<Company Name>",
  "Company Summary": "<Short description in one sentence>",
  "Industry Category": "<List some of industry that related>",
  "Main Products or Services": "<List some of products/services>",
  "Social Media": "<Social media like, instagram, twitter, youtube, linkedin, facebook",
  "Emails": "<Company's email>",
  "Phones": "<Company's phones>",
  "Reference Links": "<Some reference link to company>",
  "Error": "<Give short error message if that data do not get extract properly>"
}`;
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
