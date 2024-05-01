import { Page } from "puppeteer";
import coursePageParser from "./coursePage";
import { CourseRow } from "../types/courseRow";

const parseArchives = async (page: Page): Promise<CourseRow[]> => {
  let table = (await page.$$('table'))[2];

  let nbEvaluations = await table.$$eval('tbody td:nth-child(5)', (evaluations) => { return evaluations.map(evaluation => evaluation.textContent) });
  let links = await table.$$eval('td a', (links) => { return links.map(link => link.getAttribute('href')) });

  let row: CourseRow[] = [];
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    let nbEvaluation = nbEvaluations[i];
    if (!link || !nbEvaluation) continue;
    page.goto(link);
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