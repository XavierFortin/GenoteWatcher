import puppeteer, { Page } from 'puppeteer';
import 'dotenv/config'
import Credentials from './types/credentials';

function getInformations(): Credentials {
  return { email: process.env.EMAIL, password: process.env.PASSWORD }
}

async function navigateToGenote(page: Page, user: Credentials) {
  if (user.email === undefined || user.password === undefined) {
    throw new Error('You must provide an email and a password in the .env file')
  }

  // Navigate the page to a URL
  await page.goto('https://cas.usherbrooke.ca/login?service=https%3A%2F%2Fwww.usherbrooke.ca%2Fgenote%2Fpublic%2Findex.php');

  // Type into search box
  await page.type('#username', user.email);
  await page.type('#password', user.password);

  // Wait and click on first result
  const searchResultSelector = '.btn-submit'
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  await page.waitForNavigation();
}

async function navigateToNoteList(page: Page) {
  await page.goto('https://www.usherbrooke.ca/genote/application/etudiant/cours.php');
  await page.waitForNavigation();
}

async function main() {
  let user: Credentials = getInformations()
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  await navigateToGenote(page, user);

  await navigateToNoteList(page);

  // Locate the full title with a unique string
  const fullTitle = await page.title();

  // Print the full title
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
}

main();
