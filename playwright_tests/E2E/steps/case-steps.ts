import config from "../../config"

export async function routeToCasePage(page, caseId: string) {
    const casePageUrl = config.CaseBaseURL + '/case-details/' + caseId;
    console.log("Going to case details page:" + casePageUrl);
    await page.goto(casePageUrl);
}