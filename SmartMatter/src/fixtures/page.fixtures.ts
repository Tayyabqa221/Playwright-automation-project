import { test as base } from '@playwright/test';
import { LoginPage } from '@page/login/login.page';
import { ClinicRegistrationPage } from '@page/clinic/clinic.registration.page';

type TestFixtures = {
    loginPage: LoginPage;
    clinicRegistrationPage: ClinicRegistrationPage;
};

export const test = base.extend<TestFixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page, base.info());
        await use(loginPage);
    },
    clinicRegistrationPage: async ({ page }, use) => {
        const clinicRegistrationPage = new ClinicRegistrationPage(page, base.info());
        await use(clinicRegistrationPage);
    },
});
