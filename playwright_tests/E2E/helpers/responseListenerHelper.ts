export async function waitForSpecificResponse(page, urlSubstring, method = 'GET', timeout = 30000) {
  const response = await page.waitForResponse((response) => {
    const request = response.request();
    return request.url().includes(urlSubstring) && request.method() === method;
  }, { timeout });

  return response.json();
}
