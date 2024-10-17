import { Page } from "puppeteer";

type CoursePage = {
  name: string;
  amountOfEmptyNotes: number;
}

const coursePageParser = async (page: Page): Promise<CoursePage> => {
  const selector = 'table.zebra tbody td:nth-child(3)';
  const notes = await page.$$(selector);

  const nameEl = await page.waitForSelector('h1');
  let name = await nameEl?.evaluate(el => el?.textContent);
  name = name?.split(":")[0].trim();

  const notesText = await Promise.all(notes.map(async (note) => {
    return await page.evaluate(el => el.textContent, note);
  }))

  const amountOfEmptyNotes = notesText.filter((note: string | string[]) => note?.includes("--")).length;

  return { name: name || "", amountOfEmptyNotes }
}


export default coursePageParser;