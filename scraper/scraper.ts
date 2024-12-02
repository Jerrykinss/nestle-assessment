import puppeteer, { Page } from 'puppeteer';
import { getDbConnection } from '../src/lib/db.js';
import 'dotenv/config';

const visitedUrls: Set<string> = new Set();

interface ScraperOptions {
  dbPool: any;
  targetUrl: string;
}

const scrapePage = async (page: Page, options: ScraperOptions): Promise<void> => {
  const { dbPool, targetUrl } = options;

  if (visitedUrls.has(targetUrl)) return;
  visitedUrls.add(targetUrl);

  console.log(`Scraping: ${targetUrl}`);

  try {
    // Navigate to the target URL
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    // Wait for dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Extract and clean the text content
    const cleanTextContent = await page.evaluate(() => {
      // Helper function to remove unwanted nodes
      const removeUnwantedNodes = (selectors: string[]) => {
        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((node) => node.remove());
        });
      };

      // Remove script, style, meta, iframe, and noscript elements
      removeUnwantedNodes(['script', 'style', 'meta', 'iframe', 'noscript']);

      // Remove elements that are invisible or not meaningful
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          el.remove();
        }
      });

      // Extract the cleaned text content from the body
      const body = document.body;
      return body && body.textContent
        ? body.textContent
            .replace(/\s+/g, ' ')
            .trim()
        : '';
    });

    // Insert the cleaned text into the database
    const insertQuery = `
      INSERT INTO scraped_data (url, text_content)
      VALUES (@url, @text_content);
    `;
    await dbPool
      .request()
      .input('url', targetUrl)
      .input('text_content', cleanTextContent)
      .query(insertQuery);

    console.log(`Inserted: ${targetUrl}`);

    // Extract links from the page for recursive scraping
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
      return anchors.map((a) => a.href);
    });

    // Filter links to include only those on the target domain and not visited
    const filteredLinks = links.filter((link: string) => {
      const isOnTargetDomain = link.includes('madewithnestle.ca'); // Adjust domain as needed
      const hasQueryParams = link.includes('?') || link.includes('#');
      return isOnTargetDomain && !hasQueryParams && !visitedUrls.has(link);
    });

    // Recursively scrape each filtered link
    for (const link of filteredLinks) {
      await scrapePage(page, { dbPool, targetUrl: link });
    }
  } catch (error) {
    console.error(`Error scraping ${targetUrl}:`, error);
  }
};




(async () => {
  try {
    const dbPool = await getDbConnection();

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set user agent and headers to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Begin scraping
    await scrapePage(page, { dbPool, targetUrl: 'https://www.madewithnestle.ca/' });

    await browser.close();
    console.log('Scraping completed.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
})();
