import puppeteer, { Page } from 'puppeteer';
import 'dotenv/config'
import User from './types/user';

function getInformations(): User {
    return { email: process.env.EMAIL, password: process.env.PASSWORD }
}


async function navigateToGenote(page: Page, user: User) {
    if (user.email === undefined || user.password === undefined) {
        throw new Error('You must provide an email and a password in the .env file')
    }

    // Navigate the page to a URL
    await page.goto('https://cas.usherbrooke.ca/login?service=https%3A%2F%2Fwww.usherbrooke.ca%2Fgenote%2Fpublic%2Findex.php');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

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

}

async function main() {
    let user: User = getInformations()
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    navigateToGenote(page, user);

    navigateToNoteList(page);

    // Locate the full title with a unique string
    const fullTitle = await page.title();

    // Print the full title
    console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close();
}

main();
