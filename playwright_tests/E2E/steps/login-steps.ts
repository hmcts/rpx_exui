import config from "../../config";
const testConfig = require("../../../test_codecept/e2e/config/appTestConfig");

export async function signIn(page: any, userIdentifier: string, goToCaseBaseURL: boolean = true) {
  const matchingUsers = testConfig.users[testConfig.testEnv].filter(
    (user: any) => user.userIdentifier === userIdentifier
  );
  const email = matchingUsers[0].email;
  if (goToCaseBaseURL) await page.goto(config.CaseBaseURL);
  else await page.goto(config.AppBaseURL);
  await page.getByLabel("Email address").click();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(matchingUsers[0].key);
  await page.getByRole("button", { name: "Sign in" }).click();
  console.log("Signed in as " + email);
  
}

export async function signOut(page) {
  try {
    await page.getByText("Sign out").click();
    console.log("Signed out");
  } catch (error) {
    console.log(`Sign out failed: ${error}`);
  }
  
}
