import { searchAndOpenTopLinks } from "../services/search";
import { scrapeCompanyWebsite } from "../services/scraper";
import { extractCompanyProfile } from "../services/extract-v2";
import { readExcel } from "../services/excel";
import { appendToExcel } from "../services/write";
import { extractJsonFromString } from "../services/convert";
import { cutTextToWordLimit } from "../services/words-limit";

// Retry utility to attempt an async task multiple times
async function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 2000): Promise<T | undefined> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn(); // Try to execute the function
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw new Error(`Failed after ${retries} retries`);
      }
      console.log(`Retry attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    }
  }
}

(async () => {
  let rawText: string = "";
  let urls: string[] = [];

  const companyNames = await readExcel("./src/file/Sample Sisa.xlsx");

  if (companyNames && companyNames.length > 0) {
    for (const companyName of companyNames) {
      try {
        console.log(`\nProcessing company: ${companyName}`);

        // Retry fetching top links until successful
        let links = await retry(() => searchAndOpenTopLinks(companyName!), 3);
        
        if (links && links.length > 0) {
          urls = urls.concat(links);
        } else {
          console.log(`No results found for ${companyName}. Retrying...`);
          // Retry if no links were found after the first attempt
          links = await retry(() => searchAndOpenTopLinks(companyName!), 3);
          if (links && links.length > 0) {
            urls = urls.concat(links);
          } else {
            console.log(`Still no results for ${companyName}, skipping.`);
            continue;
          }
        }

        // Retry scraping each URL, but skip to the next URL if one fails
        for (const url of urls) {
          try {
            console.log(`Scraping URL: ${url}`);
            rawText += await retry(() => scrapeCompanyWebsite(url), 3);
          } catch (error) {
            console.error(`Error scraping URL ${url}:`, error);
            continue; // Skip to the next URL if this one fails
          }
        }

        const cutRawText = await cutTextToWordLimit(rawText, 2000);
        console.log(cutRawText);

        // Extract company profile information
        const companyInfo = await extractCompanyProfile(cutRawText);
        console.log("\nExtracted Company Info:\n\n", companyInfo);

        const companyInfoFormatted = await extractJsonFromString(companyInfo);
        console.log(`Formatted: ${companyInfoFormatted}`);

        // Write the extracted data to the Excel file
        await appendToExcel(companyInfoFormatted!, companyName!, urls);

        // Clear accumulated data for the next company
        rawText = "";
        urls = [];
      } catch (error) {
        console.error(`Error processing ${companyName}:`, error);
        rawText = "";
        urls = [];
      }
    }
  } else {
    console.log("No company names found in the input Excel file.");
  }
})();
