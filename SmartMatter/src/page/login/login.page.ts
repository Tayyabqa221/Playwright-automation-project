import { Page, TestInfo, test} from "@playwright/test";
import { PlaywrightActionFactory } from "../../utilities/playwright.actions.utils";
import { PlaywrightVerificationFactory } from "../../utilities/playwright.verifications.utils";
import { LocatorInfo } from "../../interfaces/locator.info.interface";
import { getEnvVariable } from "../../utilities/env.utils";

export class LoginPage {
    private readonly page: Page;
    private readonly testInfo: TestInfo;
    private readonly playwrightActionsFactory: PlaywrightActionFactory;
    private readonly playwrightVerificationsFactory: PlaywrightVerificationFactory;
    private readonly locators: { [key: string]: LocatorInfo };
    private readonly url: string;
/**
 * 
 * @param page 
 * @param testInfo
 */
    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.playwrightActionsFactory = new PlaywrightActionFactory(page, testInfo);
        this.playwrightVerificationsFactory = new PlaywrightVerificationFactory(page, testInfo);
        this.url = getEnvVariable('URL');

        // Locators
        this.locators = {
            usernameInput: { 
                description: 'Username input' ,
                locator: this.page.locator(`//input[@name='mdn']`),
            },
            passwordInput: { 
                description: 'Password input',
                locator: this.page.locator(`//input[@name='password']`),
            },
            continueButton: { 
                description: 'Password input',
                locator: this.page.locator(`//button[text()='Continue']`),
            },
            verifySignUpPage: { 
                description: 'Verify Sign up Page',
                locator: this.page.locator(`//h4[text()='Almost there, get your RedPocket login.']`),
            },
            loginButton: { 
                description: 'Login Button',
                locator: this.page.locator(`//button[text()='Login']`),
            },
            logoutButton: { 
                description: 'Logout Button',
                locator: this.page.locator(`//*[text()='LOGOUT']`),
            },
            verifyHomePage: { 
                description: 'Verify Home Page',
                locator: this.page.locator(`//*[text()='Welcome,']`),
            },
            verifySigninPage: { 
                description: 'Verify Sign in Page',
                locator: this.page.locator(`//*[text()='Sign in']`),
            },
            
        };
    }
    /**
     * Navigates to the login page
     */
    public async navigateToLoginPage(): Promise<void> {
        await test.step('Navigate to login page', async () => {
           await this.playwrightActionsFactory.navigateToURL(this.url);
        });
    }
    public async loginPage(scenario1: any): Promise<void> {
        await test.step('Username Field', async () => {
            await this.playwrightActionsFactory.sendKeys(this.locators.usernameInput, scenario1.loginDetails.username);
            await this.playwrightActionsFactory.click(this.locators.continueButton);
            await this.playwrightActionsFactory.sendKeys(this.locators.passwordInput, scenario1.loginDetails.password);
            await this.playwrightActionsFactory.click(this.locators.loginButton);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verifyHomePage);

        });
    }
    public async logoutPage(): Promise<void> {
        await test.step('Logout Page', async () => {
            await this.playwrightActionsFactory.click(this.locators.logoutButton);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verifySigninPage);
        
        });
    }
    }
    
