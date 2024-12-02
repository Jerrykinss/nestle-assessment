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
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    // Wait for dynamic content to load
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Get the fully rendered HTML
    const html = await page.evaluate(() => document.documentElement.outerHTML);

    // Check if the HTML already exists in the database
    const duplicateCheckQuery = `
      SELECT COUNT(*) AS count
      FROM scraped_data
      WHERE html = @html;
    `;
    const duplicateCheckResult = await dbPool
      .request()
      .input('html', html)
      .query(duplicateCheckQuery);

    const duplicateUrlCheckQuery = `
      SELECT COUNT(*) AS count
      FROM scraped_data
      WHERE url = @targetUrl;
    `;
    const duplicateUrlCheckResult = await dbPool
      .request()
      .input('targetUrl', targetUrl)
      .query(duplicateUrlCheckQuery);

    const isDuplicate = duplicateCheckResult.recordset[0].count > 0 || duplicateUrlCheckResult.recordset[0].count > 0;

    if (isDuplicate) {
      console.log(`Duplicate HTML found, skipping: ${targetUrl}`);
    } else {
      // Check if the URL already exists
      const urlCheckQuery = `
        SELECT COUNT(*) AS count
        FROM scraped_data
        WHERE url = @url;
      `;
      const urlCheckResult = await dbPool
        .request()
        .input('url', targetUrl)
        .query(urlCheckQuery);

      const urlExists = urlCheckResult.recordset[0].count > 0;

      if (urlExists) {
        // Update the existing row with the new HTML
        const updateQuery = `
          UPDATE scraped_data
          SET html = @html
          WHERE url = @url;
        `;
        await dbPool
          .request()
          .input('url', targetUrl)
          .input('html', html)
          .query(updateQuery);

        console.log(`Updated: ${targetUrl}`);
      } else {
        // Insert a new row if the URL doesn't exist
        const insertQuery = `
          INSERT INTO scraped_data (url, html)
          VALUES (@url, @html);
        `;
        await dbPool
          .request()
          .input('url', targetUrl)
          .input('html', html)
          .query(insertQuery);

        console.log(`Inserted: ${targetUrl}`);
      }
    }

    // Extract links from the rendered page
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
      return anchors.map((a) => a.href);
    });

    // Filter links to include only those on the target domain and not visited
    const filteredLinks = links.filter((link: string) => {
      const isOnTargetDomain = link.includes('madewithnestle.ca');
      const hasQueryParams = link.includes('?');
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
