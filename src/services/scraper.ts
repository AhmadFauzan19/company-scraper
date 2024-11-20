import puppeteer from "puppeteer";

export async function scrapeCompanyWebsite(url: string): Promise<string> {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Function to extract the main page text without unnecessary elements
    const extractText = async () => {
        return await page.evaluate(() => {
            const elementsToRemove = ['footer', 'header', '.ads', '.sidebar', '.navigation'];
            elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => element.remove());
            });
            return document.body.innerText;
        });
    };

    // Initial content extraction from main page
    let mainText = await extractText();

    // Collect links to potential additional pages (About Us, Services, etc.)
    const links = await page.evaluate(() => {
        const anchorTags = Array.from(document.querySelectorAll('a'));
        return anchorTags.map((a: HTMLAnchorElement) => a.href);
    });

    const potentialPages = links.filter((link: string) =>
        link.includes('about') || link.includes('services') || link.includes('product')
    );

    const socialMedia = await page.evaluate(() => {
        // Define social media domains to look for
        const socialDomains = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com/channel'];
        const links: string[] = [];

        // Get all anchor tags
        const anchorElements = Array.from(document.querySelectorAll('a'));

        // Filter anchors to find those with social media links
        anchorElements.forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href) {
                // Check if href contains any of the social media domains
                if (socialDomains.some(domain => href.includes(domain))) {
                    links.push(href);
                }
            }
        });

        return links;
    });

    mainText += socialMedia.join(" ");

    // Scrape additional pages' content and append to mainText
    for (let pageUrl of potentialPages) {
        try {
            await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
            const pageText = await extractText();
            mainText += '\n' + pageText;
        } catch (err) {
            console.log(`Failed to load ${pageUrl}: ${err}`);
            // Continue to the next task/page without stopping
            continue;
        }
    }

    // Function to limit the word count of the text
    async function limitWords(text: string, maxWords: number): Promise<string> {
      if (!text || typeof text !== 'string') {
          throw new Error("Invalid input text");
      }
  
      const words = text.trim().split(/\s+/); // Split text into words
      if (words.length > maxWords) {
          console.log(`Truncating text to ${maxWords} words (original word count: ${words.length})`);
      }
  
      return words.slice(0, maxWords).join(" "); // Return truncated text
  }
  

    const cleanedText = await limitWords(mainText, 3000); // Set word limit to 7000

    console.log(cleanedText);

    await browser.close();

    return cleanedText;
}
