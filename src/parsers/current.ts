import { Page } from "puppeteer";
import coursePageParser from "./coursePage.ts";
import { CourseRow } from "../types/courseRow.ts";

const parseCurrents = async (page: Page): Promise<CourseRow[]> => {
  const table = (await page.$$('table'))[1];

  const nbEvaluations = await table.$$eval('tbody td:nth-child(5)', (evaluations) => { return evaluations.map(evaluation => evaluation.textContent) });
  const links = await table.$$eval('td a', (links) => { return links.map(link => link.getAttribute('href')) });

  const row: CourseRow[] = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const nbEvaluation = nbEvaluations[i];
    if (!link || !nbEvaluation) continue;
    page.goto(link);
    const pageResult = await coursePageParser(page);

    row.push({
      name: pageResult.name,
      evaluationAmount: parseInt(nbEvaluation),
      emptyNoteAmount: pageResult.amountOfEmptyNotes
    });
  }
  return row;
}

export default parseCurrents;