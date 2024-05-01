import { Page } from "puppeteer";
import coursePageParser from "./coursePage";
import { CourseRow } from "../types/courseRow";


const parseArchives = async (page: Page): Promise<CourseRow[]> => {
  let table = (await page.$$('table'))[1];

  let nbEvaluations = await table.$$eval('tbody td:nth-child(5)', (evaluations) => { return evaluations.map(evaluation => evaluation.textContent) });
  let links = await table.$$eval('td a', (links) => { return links.map(link => link.getAttribute('href')) });

  let archives: CourseRow[] = [];
  for (let i = 0; i < links.length; i++) {
    let link = links[i];
    let nbEvaluation = nbEvaluations[i];
    if (!link || !nbEvaluation) continue;
    page.goto(link);
    let pageResult = await coursePageParser(page);

    archives.push({
      name: pageResult.name,
      evaluationAmount: parseInt(nbEvaluation),
      emptyNoteAmount: pageResult.amountOfEmptyNotes
    });
  }
  return archives;
}

export default parseArchives;