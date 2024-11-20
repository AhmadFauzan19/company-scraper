import puppeteer from "puppeteer";

export async function searchAndOpenTopLinks(keyword: string): Promise<string[] | null> {
  const browser = await puppeteer.launch({ 
    headless: true, });

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
  await page.waitForSelector('#search');

  // Get the top 3 search results
  const links = await page.evaluate(() => {
    const anchorTags = Array.from(document.querySelectorAll('a h3'));
    return anchorTags.slice(0, 1).map(anchor => {
      const parentAnchor = anchor.parentElement as HTMLAnchorElement;
      return parentAnchor.href;
    });
  });

  // Close the browser
  await browser.close();

  console.log(links)

  return links;
}