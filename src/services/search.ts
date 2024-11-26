import puppeteer from "puppeteer";

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
  await page.goto("https://www.google.com");

  // Locate and interact with the search input
  try {
    const searchInputSelector = 'textarea[name="q"], input[name="q"]';
    await page.waitForSelector(searchInputSelector, { timeout: 5000 });
    await page.type(searchInputSelector, keyword);
    await page.keyboard.press("Enter");
  } catch (error) {
    console.error("Error: Search input not found");
    await browser.close();
    return null;
  }

  await page.waitForSelector("#search", { timeout: 10000 });

  const filteredLinks: string[] = [];
  const maxRetries = 5; // Maximum number of retries if not enough links are found
  let retries = 0;

  while (filteredLinks.length < 5 && retries < maxRetries) {
    const newLinks = await page.evaluate(() => {
      const anchorTags = Array.from(document.querySelectorAll("a h3"));
      return anchorTags.map(anchor => {
        const parentAnchor = anchor.parentElement as HTMLAnchorElement;
        return parentAnchor.href;
      });
    });

    for (const link of newLinks) {
      if (!socialMediaDomains.some(domain => link.includes(domain)) && !filteredLinks.includes(link)) {
        filteredLinks.push(link);
        if (filteredLinks.length === 5) break;
      }
    }

    if (filteredLinks.length < 5) {
      try {
        const nextButtonSelector = "#pnnext";
        await page.click(nextButtonSelector);
        await page.waitForSelector("#search", { timeout: 10000 });
      } catch (error) {
        console.warn("No more results available or next page button not found.");
        retries++;
      }
    } else {
      break;
    }
  }

  await browser.close();

  if (filteredLinks.length === 0) {
    console.warn("No valid links found.");
    return null;
  }

  console.log(filteredLinks)

  return filteredLinks;
}
