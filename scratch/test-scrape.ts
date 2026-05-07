import { scrapeCorporateActions } from '../src/services/scraper';

async function run() {
  console.log("Scraping...");
  const res = await scrapeCorporateActions();
  console.log(JSON.stringify(res, null, 2));
}

run();
