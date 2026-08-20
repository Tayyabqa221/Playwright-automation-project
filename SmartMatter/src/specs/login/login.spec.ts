import { logTestCaseData } from '@utilities/test.helper.utils';
import { getData, logoutPage } from '@data/login/login.data';
import {test} from '@fixtures/page.fixtures'
import type { LoginPage } from '@page/login/login.page';


test.describe('Feature: Login', () => {
    test.setTimeout(30000)
    const scenario1 = getData('login-Data');
    const scenario2 = logoutPage('Logout-Page');



    test(`
        Test case: '${scenario1.testCaseData.testCase}'	
        Description: '${scenario1.testCaseData.testDescription}'
        Tags: '${scenario1.testCaseData.tags}'
      `, async ({ loginPage }: { loginPage: LoginPage }) => {
        logTestCaseData(test.info(), scenario1.testCaseData);
    
        await test.step('Admin user logs in', async () => {
          await loginPage.navigateToLoginPage();
        });
        await test.step(`Enter Username into Field`, async () => {
         await loginPage.loginPage(scenario1);
          });
      });

      test(`
        Test case: '${scenario2.testCaseData.testCase}'	
        Description: '${scenario2.testCaseData.testDescription}'
        Tags: '${scenario2.testCaseData.tags}'
      `, async ({ loginPage }: { loginPage: LoginPage }) => {
        logTestCaseData(test.info(), scenario2.testCaseData);
    
        await test.step('Admin user logs in', async () => {
          await loginPage.navigateToLoginPage();
        });
        await test.step(`Enter Username into Field`, async () => {
         await loginPage.loginPage(scenario1);
          });

          await test.step(`Logout Page`, async () => {
            await loginPage.logoutPage();
             });
      });
});