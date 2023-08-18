import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/TRF Viewer/)
  await expect(page.getByText('Open a trf test report file...')).toBeVisible()
});


test('open trf file', async ({ page }) => {
  console.log(`cwd=${process.cwd()}`)
  page.on('console', async (msg) => {
    const msgArgs = msg.args();
    const logValues = await Promise.all(msgArgs.map(async arg => await arg.jsonValue()));
    console.log(...logValues);
    // console.log(msg)
  })

  await page.goto('/')
  await expect(page.getByText('Drag \'n\' drop files here, or click to select files')).toBeVisible()
  const inputFile = page.locator('input[type="file"]')
  await inputFile.waitFor({ state: 'hidden' })

  await page.setInputFiles('input[type="file"]', './basic_test.trf', { strict: true })

  await expect(page.getByText('Summary: Project')).toBeVisible()
});
