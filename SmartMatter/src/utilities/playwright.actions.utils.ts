import { LocatorInfo } from '../interfaces/locator.info.interface';
import { Page, test, TestInfo } from '@playwright/test';
import path from 'path';

export class PlaywrightActionFactory {
  private readonly page: Page;
  private readonly testInfo: TestInfo;

  /**
   * @param page
   * @param testInfo
   */

  public constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  public maskValue(value: string): string {
    return '*'.repeat(value.length); // Masks the value with asterisks
  }

  public async click(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is clicked`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.click();
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is clicked`, {
        body: `🐾 "${locatorInfo.description}" is clicked`,
        contentType: 'text/plain',
      });
    });
  }

  public async doubleClick(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is double-clicked`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.dblclick();
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is double-clicked`, {
        body: `🐾 "${locatorInfo.description}" is double-clicked`,
        contentType: 'text/plain',
      });
    });
  }

  public async selectRadioButtonOrCheckBox(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is selected`, async (): Promise<void> => {
      try {
        await locatorInfo.locator.check();
        await this.testInfo.attach(`🐾 "${locatorInfo.description}" is selected`, {
          body: `🐾 "${locatorInfo.description}" is selected`,
          contentType: 'text/plain',
        });
      } catch (error) {
        await this.testInfo.attach(`🐾 "${locatorInfo.description}" is not selected - ` + error.message(), {
          body: `🐾 "${locatorInfo.description}" is not selected`,
          contentType: 'text/plain',
        });
      }
    });
  }

  public async deSelectRadioButtonOrCheckBox(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is selected`, async (): Promise<void> => {
      try {
        await locatorInfo.locator.uncheck();
        await this.testInfo.attach(`🐾 "${locatorInfo.description}" is selected`, {
          body: `🐾 "${locatorInfo.description}" is selected`,
          contentType: 'text/plain',
        });
      } catch (error) {
        await this.testInfo.attach(`🐾 "${locatorInfo.description}" is not selected - ` + error.message(), {
          body: `🐾 "${locatorInfo.description}" is not selected`,
          contentType: 'text/plain',
        });
      }
    });
  }

  public async navigateToURL(url: string): Promise<void> {
       await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.testInfo.attach(`⏩ Navigated to URL: ${url}`, {
          body: `⏩ Navigated to URL: ${url}`,
          contentType: 'text/plain',
        });
  }

  public async scrollIntoView(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`📜 Scrolling "${locatorInfo.description}" into view`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await this.testInfo.attach(`📜 "${locatorInfo.description}" scrolled into view`, {
        body: `📜 "${locatorInfo.description}" scrolled into view`,
        contentType: 'text/plain',
      });
    });
  }

  public async sendKeys(locatorInfo: LocatorInfo, strValue: string, mask: boolean = false): Promise<void> {
    const displayedValue = mask ? this.maskValue(strValue) : strValue;
    await test.step(`🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.fill(strValue);
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`, {
        body: `🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`,
        contentType: 'text/plain',
      });
    });
  }

  public async sendKeysSequentially(locatorInfo: LocatorInfo, strValue: string, mask: boolean = false): Promise<void> {
    const displayedValue = mask ? this.maskValue(strValue) : strValue;
    await test.step(`🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.pressSequentially(strValue);
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`, {
        body: `🐾 "${locatorInfo.description}" is entered with "${displayedValue}"`,
        contentType: 'text/plain',
      });
    });
  }

  public async pressKey(locatorInfo: LocatorInfo, strValue: string): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is pressed with "${strValue}"`, async (): Promise<void> => {
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.press(strValue);
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is pressed with "${strValue}"`, {
        body: `🐾 "${locatorInfo.description}" is pressed with "${strValue}"`,
        contentType: 'text/plain',
      });
    });
  }

  public async clearText(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is erased`, async (): Promise<void> => {
      await this.click(locatorInfo);
      await this.pressKey(locatorInfo, 'Control+A');
      await this.pressKey(locatorInfo, 'Backspace');
      await this.click(locatorInfo);
    });
  }

  public async waitForDomLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  public async waitForSec(seconds: number): Promise<void> {
    await test.step(`⏳ Waiting for ${seconds} second(s)`, async (): Promise<void> => {
      await this.page.waitForTimeout(seconds * 1000); // Convert seconds to milliseconds
      await this.testInfo.attach(`⏳ Waited for ${seconds} second(s)`, {
        body: `Waited for ${seconds} second(s)`,
        contentType: 'text/plain',
      });
    });
  }
  public async waitForVisibility(locatorInfo: LocatorInfo, timeout: number = 30000): Promise<void> {
    await test.step(`:hourglass_flowing_sand: Waiting for "${locatorInfo.description}" to be visible`, async (): Promise<void> => {
        await locatorInfo.locator.waitFor({ state: 'visible', timeout });
        await this.testInfo.attach(`:hourglass_flowing_sand: "${locatorInfo.description}" is visible`, {
            body: `:hourglass_flowing_sand: "${locatorInfo.description}" is visible`,
            contentType: 'text/plain',
        });
    });
}

  public async waitForSelector(locatorInfo: LocatorInfo, timeout: number = 30000): Promise<void> {
    await test.step(`⏳ Waiting for "${locatorInfo.description}" to be visible`, async (): Promise<void> => {
      await locatorInfo.locator.waitFor({ state: 'attached', timeout });
      await this.testInfo.attach(`⏳ "${locatorInfo.description}" is visible`, {
        body: `⏳ "${locatorInfo.description}" is visible`,
        contentType: 'text/plain',
      });
    });
  }

  public async forceClick(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 "${locatorInfo.description}" is clicked`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.click({ force: true });
      await this.testInfo.attach(`🐾 "${locatorInfo.description}" is clicked`, {
        body: `🐾 "${locatorInfo.description}" is clicked`,
        contentType: 'text/plain',
      });
    });
  }

  /**
   * Set input files to a hidden file input for uploading documents
   *
   * @param locatorInfo Information about the file input locator
   * @param filePaths Array of file paths to be uploaded
   */
  public async setInputFiles(locatorInfo: LocatorInfo, filePaths: string | string[]): Promise<void> {
    await test.step(`📂 Upload files to "${locatorInfo.description}"`, async (): Promise<void> => {
      // Ensure filePaths is an array for consistency
      const filesArray = Array.isArray(filePaths) ? filePaths : [filePaths];

      // Set the input files on the specified locator
      await locatorInfo.locator.setInputFiles(filesArray);

      await this.testInfo.attach(`📂 Files uploaded to "${locatorInfo.description}"`, {
        body: `Uploaded files: ${filesArray.join(', ')}`,
        contentType: 'text/plain',
      });
    });
  }

  public async embedFullPageScreenshot(description: string): Promise<void> {
    await test.step(`📸 "${description} - Full page screenshot`.trim(), async (): Promise<void> => {
      const screenshot: Buffer = await this.page.screenshot({ fullPage: true });
      await this.testInfo.attach(`📸 ${description}`, {
        body: screenshot,
        contentType: 'image/png',
      });
    });
  }

  public async getText(locatorInfo: LocatorInfo): Promise<null | string> {
    const elementTextContent = await test.step(`🐾 "${locatorInfo.description}" text is obtained`, async (): Promise<
      null | string
    > => {
      return locatorInfo.locator.textContent();
    });
    return elementTextContent;
  }

  // ... existing code ...
  public async selectFromDropdown(locatorInfo: LocatorInfo, optionText: string, value?: string): Promise<void> {
    await test.step(`🐾 Selecting exact option: "${optionText}" from dropdown`, async (): Promise<void> => {
      // Click to open the dropdown
      await locatorInfo.locator.focus();
      await locatorInfo.locator.click();

      // Locate the dropdown option that exactly matches the input text
      let exactMatchOption = this.page
        .locator('ul.form-element__custom-select-list li')
        .filter({
          hasText: new RegExp(`^\\s*${optionText}`),
        })
        .first();
      try {
        // Wait for the exact match option to be visible
        await exactMatchOption.waitFor({ state: 'visible', timeout: 10000 });

        // Scroll the element into view
        await exactMatchOption.scrollIntoViewIfNeeded();

        // Click the dropdown option
        await exactMatchOption.click({ force: true });

        if (value?.includes('multi')) {
          exactMatchOption = this.page
            .locator('ul.form-element__multi-select-list li.form-element__multi-select-option.')
            .filter({
              hasText: new RegExp(`^\\s*${optionText}`),
            })
            .first();
          try {
            // Wait for the exact match option to be visible
            await exactMatchOption.waitFor({ state: 'visible', timeout: 5000 });

            // Scroll the element into view
            await exactMatchOption.scrollIntoViewIfNeeded();

            // Click the dropdown option
            await exactMatchOption.click({ force: true });
            await this.testInfo.attach(`🐾 Selected "${optionText}" from the dropdown`, {
              body: `Selected "${optionText}" from the dropdown`,
              contentType: 'text/plain',
            });
          } catch (error) {
            if (error.message.includes('Timeout')) {
              throw new Error(`Option "${optionText}" not found in the dropdown.`);
            } else {
              throw error;
            }
          }
        }

        // Attach a message to the test report
        await this.testInfo.attach(`🐾 Selected "${optionText}" from the dropdown`, {
          body: `Selected "${optionText}" from the dropdown`,
          contentType: 'text/plain',
        });
      } catch (error) {
        if (error.message.includes('Timeout')) {
          throw new Error(`Option "${optionText}" not found in the dropdown.`);
        } else {
          throw error;
        }
      }
    });
  }



  public async searchAndSelect(locatorInfo: LocatorInfo, inputText: string, value?: string): Promise<void> {
    await test.step(`🐾 Enter "${inputText}" and select it from the dropdown`, async (): Promise<void> => {
      // Focus the input field
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.focus();
      await locatorInfo.locator.clear();
      let dropdownOption;
      let exactMatchOption;

      // Wait for the dropdown to appear and contain the exact input text
      if (value?.includes('custom')) {
        await locatorInfo.locator.pressSequentially(inputText);
        dropdownOption = this.page.locator('ul.form-element__custom-select-list li', {
          hasText: inputText,
        });

        // Filter to match exact text for custom selects
        exactMatchOption = dropdownOption
          .filter({
            has: this.page.locator('span', { hasText: inputText }),
          })
          .first();
      } else if (value?.includes('autocomplete-without-li')) {
        // For autocomplete, use partial matching with RegExp
        await locatorInfo.locator.fill(inputText);
        dropdownOption = this.page
          .locator('ul.form-element__autocomplete-list app-risk-search-result.form-element__autocomplete-option')
          .filter({ hasText: new RegExp(inputText, 'i') })
          .first();

        // For autocomplete, we already have the filtered option
        exactMatchOption = dropdownOption;

        // Wait for the dropdown to contain options
        await this.page.waitForSelector(
          'ul.form-element__autocomplete-list app-risk-search-result.form-element__autocomplete-option',
          {
            timeout: 10000,
          },
        );
      } else if (value?.includes('autocomplete')) {
        // For autocomplete, use partial matching with RegExp
        await locatorInfo.locator.fill(inputText);
        dropdownOption = this.page
          .locator('ul.form-element__autocomplete-list li.form-element__autocomplete-option')
          .filter({ hasText: new RegExp(inputText, 'i') })
          .first();

        // For autocomplete, we already have the filtered option
        exactMatchOption = dropdownOption;

        // Wait for the dropdown to contain options
        await this.page.waitForSelector('ul.form-element__autocomplete-list li.form-element__autocomplete-option', {
          state: 'visible',
          timeout: 10000,
        });
      } else if (value?.includes('multi')) {
        // For autocomplete, use partial matching with RegExp
        await locatorInfo.locator.fill(inputText);
        dropdownOption = this.page
          .locator('ul.form-element__multi-select-list li.form-element__multi-select-option')
          .filter({ hasText: new RegExp(inputText, 'i') })
          .first();

        // For autocomplete, we already have the filtered option
        exactMatchOption = dropdownOption;

        // Wait for the dropdown to contain options
        await this.page.waitForSelector('ul.form-element__multi-select-list li.form-element__multi-select-option', {
          timeout: 10000,
        });
      } else {
        // Default behavior (exact matching)
        await locatorInfo.locator.fill(inputText);
        dropdownOption = this.page.locator('ul.form-element__autocomplete-list li', {
          hasText: inputText,
        });

        // Filter to match exact text
        exactMatchOption = dropdownOption
          .filter({
            has: this.page.locator('span', { hasText: inputText }),
          })
          .first();
      }

      try {
        // Wait for the match option to be visible
        await exactMatchOption.waitFor({ state: 'visible', timeout: 15000 });

        // Scroll the element into view
        await exactMatchOption.scrollIntoViewIfNeeded();

        // Click the dropdown option
        await exactMatchOption.click({ force: true });

        // Attach a message to the test report
        await this.testInfo.attach(`🐾 Selected "${inputText}" from the dropdown`, {
          body: `Selected ${value?.includes('autocomplete') ? 'first matching' : 'exact matching'} item for "${inputText}" from the dropdown`,
          contentType: 'text/plain',
        });
      } catch (error) {
        // Handle timeout or other errors
        if (error.message.includes('Timeout')) {
          throw new Error(
            `Option ${value?.includes('autocomplete') ? 'containing' : 'matching exactly'} "${inputText}" not found in the dropdown.`,
          );
        } else {
          throw new Error(`An error occurred while selecting "${inputText}" from the dropdown: ${error.message}`);
        }
      }
    });
  }

  public async refreshBrowser(): Promise<void> {
    await test.step('🔄 Refreshing the browser', async () => {
      try {
        await this.page.reload();
        await this.waitForDomLoad();
        await this.testInfo.attach('🔄 Browser refreshed', {
          body: '🔄 The browser has been refreshed.',
          contentType: 'text/plain',
        });
      } catch (error) {
        await this.testInfo.attach('🔄 Browser refresh failed', {
          body: `Error: ${error.message}`,
          contentType: 'text/plain',
        });
      }
    });
  }

  public async waitForURL(regex: RegExp, timeout: number = 30000): Promise<void> {
    await test.step(`⏳ Waiting for URL matching "${regex}"`, async (): Promise<void> => {
      await this.page.waitForURL(regex, { timeout, waitUntil: 'domcontentloaded' });
      await this.testInfo.attach(`⏳ URL matching "${regex}" is loaded`, {
        body: `⏳ URL matching "${regex}" is loaded`,
        contentType: 'text/plain',
      });
    });
  }

  public async scrollUntilVisible(
    locatorInfo: LocatorInfo,
    options?: {
      maxScrollAttempts?: number;
      scrollAmount?: number;
      scrollInterval?: number;
    },
  ): Promise<void> {
    const { maxScrollAttempts = 10, scrollAmount = 100, scrollInterval = 300 } = options || {};
    let attempts = 0;

    await test.step(`📜 Scrolling to make "${locatorInfo.description}" visible`, async (): Promise<void> => {
      try {
        while (attempts < maxScrollAttempts) {
          const isVisible = await locatorInfo.locator.isVisible();

          if (isVisible) {
            await this.testInfo.attach(`✅ "${locatorInfo.description}" is visible after scrolling.`, {
              body: `Scrolled ${attempts} times to make "${locatorInfo.description}" visible.`,
              contentType: 'text/plain',
            });
            return;
          }

          await this.page.mouse.wheel(0, scrollAmount);
          await this.page.waitForTimeout(scrollInterval);
          attempts++;
        }

        await this.testInfo.attach(
          `💥 "${locatorInfo.description}" is not visible after ${maxScrollAttempts} scrolling attempts.`,
          {
            body: `Failed to scroll ${maxScrollAttempts} times to make "${locatorInfo.description}" visible.`,
            contentType: 'text/plain',
          },
        );
        throw new Error(`"${locatorInfo.description}" is not visible after ${maxScrollAttempts} attempts.`);
      } catch (error) {
        await this.testInfo.attach(`💥 Error while scrolling to "${locatorInfo.description}"`, {
          body: `Error: ${error.message}`,
          contentType: 'text/plain',
        });
        throw error;
      }
    });
  }

  public async mouseHover(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🐾 Mouse hover on "${locatorInfo.description}"`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.hover();
      await this.testInfo.attach(`🐾 Mouse hover on "${locatorInfo.description}"`, {
        body: `🐾 Mouse hover on "${locatorInfo.description}"`,
        contentType: 'text/plain',
      });
    });
  }

  public static getFilePath(fileName: string): string {
    return path.join(__dirname, '..', '..', '..', 'data', 'files', fileName);
  }

  public async uploadFile(locatorInfo: LocatorInfo, filePath: string): Promise<void> {
    await test.step(`📁 Uploading file "${path.basename(filePath)}"`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.setInputFiles(filePath);
      await this.testInfo.attach(`📁 File "${path.basename(filePath)}" uploaded successfully`, {
        body: `File "${path.basename(filePath)}" uploaded successfully`,
        contentType: 'text/plain',
      });
    });
  }

  public async getInputValue(locatorInfo: LocatorInfo): Promise<string> {
    return await test.step(`📝 Getting value from "${locatorInfo.description}"`, async (): Promise<string> => {
      await this.waitForSelector(locatorInfo);
      const value = await locatorInfo.locator.inputValue();
      await this.testInfo.attach(`📝 Value from "${locatorInfo.description}" is "${value}"`, {
        body: `Value from "${locatorInfo.description}" is "${value}"`,
        contentType: 'text/plain',
      });
      return value;
    });
  }

  public async hover(locatorInfo: LocatorInfo): Promise<void> {
    await test.step(`🖱️ Hovering over "${locatorInfo.description}"`, async (): Promise<void> => {
      await this.waitForSelector(locatorInfo);
      await locatorInfo.locator.scrollIntoViewIfNeeded();
      await locatorInfo.locator.hover();
      await this.testInfo.attach(`🖱️ Hovered over "${locatorInfo.description}"`, {
        body: `🖱️ Hovered over "${locatorInfo.description}"`,
        contentType: 'text/plain',
      });
    });
  }

  public async dragAndDrop(sourceLocator: LocatorInfo, targetLocator: LocatorInfo): Promise<void> {
    await test.step(`🐾 Dragging "${sourceLocator.description}" to "${targetLocator.description}"`, async (): Promise<void> => {
      await this.waitForSelector(sourceLocator);
      await this.waitForSelector(targetLocator);
      await sourceLocator.locator.scrollIntoViewIfNeeded();
      await sourceLocator.locator.dragTo(targetLocator.locator);
      await this.testInfo.attach(`🐾 Dragged "${sourceLocator.description}" to "${targetLocator.description}"`, {
        body: `🐾 Dragged "${sourceLocator.description}" to "${targetLocator.description}"`,
        contentType: 'text/plain',
      });
    });
  }

  public async clickAllElements(elements: LocatorInfo): Promise<void> {
    const count = await elements.locator.count();

    await test.step(`🐾 Clicking ${count} element(s) for: "${elements.description}" `, async (): Promise<void> => {
      for (let i = 0; i < count; i++) {
        console.log(`👉 Clicking element ${i + 1} of ${count} for: "${elements.description}"`);
        await elements.locator.nth(i).click();
      }
    });
  }
}
