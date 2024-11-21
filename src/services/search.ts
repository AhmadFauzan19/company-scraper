import puppeteer from "puppeteer";

// Define a list of social media platforms to exclude
const socialMediaDomains = [
  "instagram.com",
  "twitter.com",
  "youtube.com",
  "facebook.com",
  "linkedin.com",
  "tiktok.com"
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
  await page.waitForSelector('#search', {timeout: 10000});

  // Get the top 3 search results
  const links = await page.evaluate(() => {
    const anchorTags = Array.from(document.querySelectorAll('a h3'));
    return anchorTags.slice(0, 5).map(anchor => {
      const parentAnchor = anchor.parentElement as HTMLAnchorElement;
      return parentAnchor.href;
    });
  });

  // Filter out social media links
  const filteredLinks = links.filter(link => {
    return !socialMediaDomains.some(domain => link.includes(domain));
  });

  // Close the browser
  await browser.close();

  console.log(filteredLinks);

  return filteredLinks;
}
