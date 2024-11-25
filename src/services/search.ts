import puppeteer from "puppeteer";

// Define a list of social media platforms to exclude
const socialMediaDomains = [
  "instagram.com",
  "twitter.com",
  "youtube.com",
  "facebook.com",
  "linkedin.com",
  "tiktok.com",
  "pinterest.com",
  "jobstreet.com"
];

export async function searchAndOpenTopLinks(keyword: string): Promise<string[] | null> {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // Go to Google search page
  await page.goto('https://www.google.com');

  // Wait for the search input to be available and type the keyword
  try {
    const searchInputSelector = 'textarea[name="q"], input[name="q"]';
    await page.waitForSelector(searchInputSelector, { timeout: 5000 });
    await page.type(searchInputSelector, keyword);
    await page.keyboard.press('Enter'); // Press Enter to search
  } catch (error) {
    console.error('Error: Search input not found');
    await browser.close();
    return null;
  }

  // Wait for search results to load
  await page.waitForSelector('#search', { timeout: 10000 });

  const filteredLinks: string[] = [];

  // Get the top search results and filter out social media links
  while (filteredLinks.length < 5) {
    const newLinks = await page.evaluate(() => {
      const anchorTags = Array.from(document.querySelectorAll('a h3'));
      return anchorTags.map(anchor => {
        const parentAnchor = anchor.parentElement as HTMLAnchorElement;
        return parentAnchor.href;
      });
    });

    // Filter out social media links and add new valid links to the result
    for (const link of newLinks) {
      if (!socialMediaDomains.some(domain => link.includes(domain)) && !filteredLinks.includes(link)) {
        filteredLinks.push(link);
        if (filteredLinks.length === 5) break;
      }
    }

    // Break out of the loop if there are no more results to process
    if (filteredLinks.length < 5) {
      try {
        // Try to navigate to the next page of results
        const nextButtonSelector = '#pnnext';
        await page.click(nextButtonSelector);
        await page.waitForSelector('#search', { timeout: 5000 });
      } catch (error) {
        console.warn('No more results available.');
        break;
      }
    }
  }

  // Close the browser
  await browser.close();

  console.log(filteredLinks);

  return filteredLinks.length ? filteredLinks : null;
}
