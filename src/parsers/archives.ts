import { Page } from "puppeteer";
import coursePageParser from "./coursePage.ts";
import { CourseRow } from "../types/courseRow.ts";

const parseArchives = async (page: Page, take: number): Promise<CourseRow[]> => {
  let table = (await page.$$('table'))[2];

  let nbEvaluations = await table.$$eval('tbody td:nth-child(5)', (evaluations) => { return evaluations.map(evaluation => evaluation.textContent) });
  let links = await table.$$eval('td a', (links) => { return links.map(link => link.getAttribute('href')) });

  if (take > links.length) {
    take = links.length;
  }

  let row: CourseRow[] = [];

  for (let i = 0; i < take; i++) {
    let link = links[i];
    let nbEvaluation = nbEvaluations[i];
    if (!link || !nbEvaluation) continue;

    let baseUrl = `https://www.usherbrooke.ca/genote/application/etudiant/${link}`;
    await page.goto(baseUrl);
    let pageResult = await coursePageParser(page);

    row.push({
      name: pageResult.name,
      evaluationAmount: parseInt(nbEvaluation),
      emptyNoteAmount: pageResult.amountOfEmptyNotes
    });
  }
  return row;
}

export default parseArchives;