import { Page, TestInfo, test } from '@playwright/test';
import { ClinicRegistrationDetails } from '../../interfaces/clinic.registration.interface';
import { LocatorInfo } from '../../interfaces/locator.info.interface';
import { PlaywrightActionFactory } from '../../utilities/playwright.actions.utils';
import { PlaywrightVerificationFactory } from '../../utilities/playwright.verifications.utils';
import { getEnvVariable } from '../../utilities/env.utils';
import { generateRandomAlphanumeric } from '../../utilities/random.utils';
import {
    createTempMailInbox,
    getInboxMessages,
    getOtpFromMessage,
    TempMailInbox,
    waitForEmailOtp,
    waitForInboxMessage,
} from '../../utilities/temp.mail.utils';

type MandatoryField = 'address' | 'city' | 'clinicName' | 'email' | 'fullName' | 'phone';

export class ClinicRegistrationPage {
    private readonly locators: { [key: string]: LocatorInfo };
    private readonly page: Page;
    private readonly playwrightActionsFactory: PlaywrightActionFactory;
    private readonly playwrightVerificationsFactory: PlaywrightVerificationFactory;
    private readonly url: string;

    /**
     * @param page
     * @param testInfo
     */
    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.playwrightActionsFactory = new PlaywrightActionFactory(page, testInfo);
        this.playwrightVerificationsFactory = new PlaywrightVerificationFactory(page, testInfo);
        this.url = getEnvVariable('URL');

        this.locators = {
            addressInput: {
                description: 'Address input',
                locator: this.page.locator(`//input[@id='clinic-address']`),
            },
            businessEmailInput: {
                description: 'Business email input',
                locator: this.page.locator(`//input[@id='claimer-email']`),
            },
            chooseYourPlanHeading: {
                description: 'Choose your plan heading',
                locator: this.page.locator(`//*[normalize-space()='Choose your plan']`),
            },
            cityInput: {
                description: 'City input',
                locator: this.page.locator(`//input[@id='clinic-city']`),
            },
            clinicNameInput: {
                description: 'Clinic name field on registration Step 1',
                locator: this.page.locator(`//input[@id='clinic-name-input']`),
            },
            fullNameInput: {
                description: 'Your full name input',
                locator: this.page.locator(`//input[@id='claimer-name']`),
            },
            invalidEmailMessage: {
                description: 'Invalid business email format validation',
                locator: this.page.locator(`//p[normalize-space()='Please enter a valid email address.']`),
            },
            phoneNumberInput: {
                description: 'Phone number input',
                locator: this.page.locator(`//input[@id='clinic-phone']`),
            },
            registerAClinicLink: {
                description: 'Register a clinic link',
                locator: this.page.locator(`//a[text()='Register a clinic']`),
            },
            registerYourClinicHeading: {
                description: 'Register your clinic page heading',
                locator: this.page.locator(`//h1[text()='Register your clinic']`),
            },
            resendCodeButton: {
                description: 'Resend code button',
                locator: this.page.locator(`//button[normalize-space()='Resend code']`),
            },
            sendVerificationCodeButton: {
                description: 'Send verification code button',
                locator: this.page.locator(`//button[normalize-space()='Send verification code']`),
            },
            step1Indicator: {
                description: 'Clinic registration form Step 1',
                locator: this.page.locator(`//div[contains(@class,'rounded-full') and normalize-space()='1']`),
            },
            step2Indicator: {
                description: 'Clinic registration form Step 2',
                locator: this.page.locator(`//div[contains(@class,'rounded-full') and normalize-space()='2']`),
            },
            verificationCodeHeading: {
                description: 'Enter your verification code heading',
                locator: this.page.locator(`//*[normalize-space()='Enter your verification code']`),
            },
            verificationCodeInput: {
                description: 'Verification code input',
                locator: this.page.locator(`//input[@placeholder='000000']`),
            },
            verificationErrorMessage: {
                description: 'Verification code error message',
                locator: this.page.locator(`//p[contains(@class,'text-destructive')]`),
            },
            verifyButton: {
                description: 'Verify button',
                locator: this.page.locator(`//button[normalize-space()='Verify']`),
            },
        };
    }

    /**
     * Navigates to the Clinic Portal login page
     */
    public async navigateToClinicPortal(): Promise<void> {
        await test.step('Navigate to Clinic Portal login page', async () => {
            await this.playwrightActionsFactory.navigateToURL(this.url);
        });
    }

    /**
     * Opens the clinic registration page from the Clinic Portal and verifies Step 1
     */
    public async openRegisterClinicPage(): Promise<void> {
        await test.step('Open Register a Clinic page', async () => {
            await this.playwrightActionsFactory.click(this.locators.registerAClinicLink);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.registerYourClinicHeading);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.step1Indicator);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.clinicNameInput);
        });
    }

    /**
     * Submits Step 1 with valid mandatory fields, reads the OTP from temp mail, and verifies the account
     */
    public async submitValidRequiredFields(details: ClinicRegistrationDetails): Promise<void> {
        const inbox = await this.submitStep1WithTempMail(details);
        const otp = await waitForEmailOtp(inbox);
        await this.submitVerificationCode(otp);
        await this.playwrightActionsFactory.waitForVisibility(this.locators.chooseYourPlanHeading);
    }

    /**
     * Submits the empty registration form and verifies mandatory field validation
     */
    public async submitEmptyRegistrationForm(validationMessages: string[]): Promise<void> {
        await test.step('Submit empty registration form', async () => {
            await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
            await this.assertStillOnStep1();
            for (const message of validationMessages) {
                await this.waitForValidationMessage(message);
            }
        });
    }

    /**
     * Submits Step 1 with every mandatory field except clinic name
     */
    public async submitWithoutClinicName(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Submit Step 1 without clinic name', async () => {
            await this.fillMandatoryFields(details, details.businessEmail, ['clinicName']);
            await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
            await this.assertStillOnStep1();
            await this.waitForValidationMessage('Clinic Name is required.');
        });
    }

    /**
     * Submits Step 1 with every mandatory field except business email
     */
    public async submitWithoutBusinessEmail(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Submit Step 1 without business email', async () => {
            await this.fillMandatoryFields(details, details.businessEmail, ['email']);
            await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
            await this.assertStillOnStep1();
            await this.waitForValidationMessage('Business Email is required.');
        });
    }

    /**
     * Submits Step 1 with invalid business email formats
     */
    public async submitInvalidBusinessEmails(details: ClinicRegistrationDetails, emails: string[]): Promise<void> {
        await test.step('Submit Step 1 with invalid business email formats', async () => {
            for (const email of emails) {
                await this.fillMandatoryFields(details, email);
                await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
                await this.assertStillOnStep1();
                await this.playwrightActionsFactory.waitForVisibility(this.locators.invalidEmailMessage);
            }
        });
    }

    /**
     * Submits Step 1 with every mandatory field except phone number
     */
    public async submitWithoutPhoneNumber(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Submit Step 1 without phone number', async () => {
            await this.fillMandatoryFields(details, details.businessEmail, ['phone']);
            await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
            await this.assertStillOnStep1();
            await this.waitForValidationMessage('Phone Number is required.');
        });
    }

    /**
     * Types a city query and verifies relevant autocomplete suggestions
     */
    public async verifyCityAutocompleteSuggestions(query: string, expectedCities: string[]): Promise<void> {
        await test.step('Verify city autocomplete suggestions', async () => {
            await this.playwrightActionsFactory.sendKeys(this.locators.cityInput, query);
            for (const city of expectedCities) {
                await this.playwrightActionsFactory.waitForVisibility(this.cityOption(city));
            }
        });
    }

    /**
     * Selects a city from autocomplete and verifies the City field keeps that value
     */
    public async selectCityFromAutocomplete(city: string): Promise<void> {
        await test.step('Select city from autocomplete', async () => {
            await this.selectCity(city);
            const selectedCity = await this.playwrightActionsFactory.getInputValue(this.locators.cityInput);
            await this.playwrightVerificationsFactory.assertStringsEqual(
                selectedCity,
                city,
                `City field should contain ${city}`,
            );
        });
    }

    /**
     * Submits valid Step 1 data and verifies exactly one verification email/OTP is created
     */
    public async verifySingleVerificationCodeSent(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Verify one verification code is sent', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            await waitForEmailOtp(inbox);
            await this.playwrightActionsFactory.waitForSec(5);
            const messages = await getInboxMessages(inbox);
            if (messages.length !== 1) {
                throw new Error(`Expected one verification email, but received ${messages.length}.`);
            }
        });
    }

    /**
     * Submits valid Step 1 data and verifies the email verification step UI
     */
    public async verifyVerificationStepOpened(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Verify the email verification step is displayed', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationCodeHeading);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.step2Indicator);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationCodeInput);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verifyButton);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.resendCodeButton);
            await this.playwrightActionsFactory.waitForVisibility({
                description: 'Submitted business email on verification step',
                locator: this.page.locator(`//strong[normalize-space()='${inbox.address}']`),
            });
        });
    }

    /**
     * Submits a valid unexpired OTP and verifies Step 3 Choose plan
     */
    public async verifyWithValidOtp(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Verify account with a valid 6-digit code', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            const otp = await waitForEmailOtp(inbox);
            await this.submitVerificationCode(otp);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.chooseYourPlanHeading);
        });
    }

    /**
     * Verifies the Verify button stays disabled until 6 digits are entered
     */
    public async verifyButtonDisabledUntilCodeIsComplete(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Verify button remains disabled until 6 digits are entered', async () => {
            await this.submitStep1WithTempMail(details);
            await this.playwrightVerificationsFactory.assertElementIsDisabled(this.locators.verifyButton);
            await this.playwrightActionsFactory.sendKeys(this.locators.verificationCodeInput, '12345');
            await this.playwrightVerificationsFactory.assertElementIsDisabled(this.locators.verifyButton);
            await this.playwrightActionsFactory.sendKeys(this.locators.verificationCodeInput, '123456');
            await this.playwrightVerificationsFactory.assertElementIsEnabled(this.locators.verifyButton);
        });
    }

    /**
     * Submits an incorrect 6-digit code and verifies the user remains on Step 2
     */
    public async rejectIncorrectVerificationCode(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Reject an incorrect verification code', async () => {
            await this.submitStep1WithTempMail(details);
            await this.submitVerificationCode('000000');
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationErrorMessage);
            await this.assertStillOnVerificationStep();
        });
    }

    /**
     * Waits for the 10-minute expiry and verifies the old code is rejected
     */
    public async rejectExpiredVerificationCode(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Reject an expired verification code', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            const otp = await waitForEmailOtp(inbox);
            await this.playwrightActionsFactory.waitForSec(630);
            await this.submitVerificationCode(otp);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationErrorMessage);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.resendCodeButton);
            await this.assertStillOnVerificationStep();
        });
    }

    /**
     * Resends the verification code and verifies a new OTP arrives for the same email
     */
    public async resendVerificationCode(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Resend verification code', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            const firstMessage = await waitForInboxMessage(inbox);
            await this.playwrightActionsFactory.click(this.locators.resendCodeButton);
            const secondMessage = await waitForInboxMessage(inbox, [firstMessage.id]);
            const newOtp = await getOtpFromMessage(inbox, secondMessage.id);
            if (!newOtp) {
                throw new Error('A new 6-digit verification code was not received after resend.');
            }
            await this.assertStillOnVerificationStep();
            await this.playwrightActionsFactory.waitForVisibility({
                description: 'Submitted business email after resend',
                locator: this.page.locator(`//strong[normalize-space()='${inbox.address}']`),
            });
        });
    }

    /**
     * Verifies the previous OTP is rejected after a new code is issued
     */
    public async rejectOldCodeAfterResend(details: ClinicRegistrationDetails): Promise<void> {
        await test.step('Reject the old verification code after resend', async () => {
            const inbox = await this.submitStep1WithTempMail(details);
            const firstMessage = await waitForInboxMessage(inbox);
            const oldOtp = await getOtpFromMessage(inbox, firstMessage.id);
            await this.playwrightActionsFactory.click(this.locators.resendCodeButton);
            const secondMessage = await waitForInboxMessage(inbox, [firstMessage.id]);
            const newOtp = await getOtpFromMessage(inbox, secondMessage.id);
            await this.submitVerificationCode(oldOtp);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationErrorMessage);
            await this.assertStillOnVerificationStep();
            await this.submitVerificationCode(newOtp);
            await this.playwrightActionsFactory.waitForVisibility(this.locators.chooseYourPlanHeading);
        });
    }

    /**
     * Fills Step 1 using a temp mailbox and opens the verification step
     */
    public async submitStep1WithTempMail(details: ClinicRegistrationDetails): Promise<TempMailInbox> {
        return await test.step('Submit Step 1 using a temporary business email', async () => {
            const inbox = await createTempMailInbox();
            await this.fillMandatoryFields(details, inbox.address);
            await this.playwrightActionsFactory.click(this.locators.sendVerificationCodeButton);
            await this.assertStillOnVerificationStep();
            await this.playwrightActionsFactory.waitForVisibility({
                description: 'Six-digit verification code sent message',
                locator: this.page.locator(
                    `//p[contains(., 'We sent a 6-digit code to') and .//strong[normalize-space()='${inbox.address}']]`,
                ),
            });
            return inbox;
        });
    }

    private async fillMandatoryFields(
        details: ClinicRegistrationDetails,
        email: string,
        omit: MandatoryField[] = [],
    ): Promise<void> {
        const unique = generateRandomAlphanumeric(8).toLowerCase();
        const clinicName = details.clinicName.replace('{unique}', unique);

        if (!omit.includes('clinicName')) {
            await this.playwrightActionsFactory.sendKeys(this.locators.clinicNameInput, clinicName);
        }
        if (!omit.includes('fullName')) {
            await this.playwrightActionsFactory.sendKeys(this.locators.fullNameInput, details.fullName);
        }
        if (!omit.includes('email')) {
            await this.playwrightActionsFactory.sendKeys(this.locators.businessEmailInput, email);
        }
        if (!omit.includes('phone')) {
            await this.playwrightActionsFactory.sendKeys(this.locators.phoneNumberInput, details.phoneNumber);
        }
        if (!omit.includes('address')) {
            await this.playwrightActionsFactory.sendKeys(this.locators.addressInput, details.address);
        }
        if (!omit.includes('city')) {
            await this.selectCity(details.city);
        }
    }

    private async submitVerificationCode(otp: string): Promise<void> {
        await this.playwrightActionsFactory.sendKeys(this.locators.verificationCodeInput, otp);
        await this.playwrightActionsFactory.click(this.locators.verifyButton);
    }

    private async waitForValidationMessage(message: string): Promise<void> {
        await this.playwrightActionsFactory.waitForVisibility({
            description: `Validation message: ${message}`,
            locator: this.page.locator(`//p[normalize-space()='${message}']`),
        });
    }

    private async assertStillOnStep1(): Promise<void> {
        await this.playwrightActionsFactory.waitForVisibility(this.locators.registerYourClinicHeading);
        await this.playwrightActionsFactory.waitForVisibility(this.locators.sendVerificationCodeButton);
        await this.playwrightActionsFactory.waitForVisibility(this.locators.clinicNameInput);
    }

    private async assertStillOnVerificationStep(): Promise<void> {
        await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationCodeHeading);
        await this.playwrightActionsFactory.waitForVisibility(this.locators.step2Indicator);
        await this.playwrightActionsFactory.waitForVisibility(this.locators.verificationCodeInput);
    }

    private cityOption(city: string): LocatorInfo {
        return {
            description: `City option ${city}`,
            locator: this.page.locator(`//ul[contains(@class,'absolute')]//button[normalize-space()='${city}']`),
        };
    }

    /**
     * Selects a city from the clinic registration autocomplete list
     */
    private async selectCity(city: string): Promise<void> {
        await this.playwrightActionsFactory.sendKeys(this.locators.cityInput, city);
        await this.playwrightActionsFactory.waitForVisibility(this.cityOption(city));
        await this.playwrightActionsFactory.click(this.cityOption(city));
    }
}
