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
    i scrape data from website, i want you to extract this text to get company profile

    Text: 
    ${text}

    **Instructions**:
    - **Company Summary**: Provide a concise overview of the company's history, mission, and key milestones (max 200 words).
    - **Industry Category**: List the industries the company operates in, using standard industry classification terms.
    - **Main Products or Services**: Identify the primary products or services offered by the company.
    - **Social Media**: Include official social media links of the company (e.g., LinkedIn, Twitter). Do **NOT** include personal social media accounts of employees or workers.
    - **Emails: Include official email links of the company. Do **NOT** include personal email accounts of employees or workers.
    - **Phones: Include official phone links of the company. Do **NOT** include personal phone accounts of employees or workers.

    **Output Format**: Return the information in **valid JSON format** as shown below.

    {
      "Company Summary": "string",
      "Industry Category": ["string", ...],
      "Main Products or Services": ["string", ...],
      "Social Media": ["string", ...],
      "Emails": ["string", ...],
      "Phones": ["string", ...],
      "Error": "",
    }
    

    **If you cannot get the Company Summary, Industry Category, and Main Products or Services because it is the important part, give the error output. Output Format**:
    just let the other key is empty, but write the error message in Error key alone
    {
        "Company Summary": "",
        "Industry Category": [""],
        "Main Products or Services": [""],
        "Social Media": [""],
        "Emails": [""],
        "Phones": [""],
        "Error": "Error Message"
    }
    
    so you have 2 types of output, first output, if you can get Company Summary, Industry Category, and Main Products or Services at once.
    second output, if cannot get Company Summary, Industry Category, and Main Products or Services at once. 
    
    !!!JUST PRINT ON OF THEM!!!
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
