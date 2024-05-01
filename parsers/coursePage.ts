import { Page } from "puppeteer";

type CoursePage = {
  name: string;
  amountOfEmptyNotes: number;
}

const coursePageParser = async (page: Page): Promise<CoursePage> => {
  let selector = 'table.zebra tbody td:nth-child(3)';
  let notes = await page.$$(selector);

  let nameEl = await page.waitForSelector('h1');
  let name = await nameEl?.evaluate(el => el?.textContent);
  name = name?.split(":")[0].trim();

  let notesText = await Promise.all(notes.map(async (note) => {
    return await page.evaluate(el => el.textContent, note);
  }))

  let amountOfEmptyNotes = notesText.filter(note => note?.includes("--")).length;

  return { name: name || "", amountOfEmptyNotes }
}


export default coursePageParser;