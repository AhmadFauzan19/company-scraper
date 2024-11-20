import { searchAndOpenTopLinks } from "../services/search";
import { scrapeCompanyWebsite } from "../services/scraper";
import { extractCompanyProfile } from "../services/extract-v2";
import { saveDataToCSV } from "../services/write";

  (async () => {
    let rawText: string = "";
    let urls: string[] = [];
    const name = 'YAKIN PASIFIK TUNA'

          // Search for top links
          const links = await searchAndOpenTopLinks(name);
          if (links) {
            urls = urls.concat(links);
          } 

          // Scrape each URL and accumulate the text
          for (const url of urls) {
            console.log(`Scraping URL: ${url}`);
            rawText += await scrapeCompanyWebsite(url);
          }

          // Extract company profile information
          const companyInfo = await extractCompanyProfile(rawText);
          console.log(`\n${companyInfo}`);

          saveDataToCSV([companyInfo])

          // Clear accumulated data for the next company
          rawText = "";
          urls = [];

      

  })();
