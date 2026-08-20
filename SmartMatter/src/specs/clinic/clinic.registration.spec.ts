import { logTestCaseData } from '@utilities/test.helper.utils';
import { getClinicRegistrationTestCaseData } from '@data/clinic/clinic.registration.data';
import { test } from '@fixtures/page.fixtures';
import type { ClinicRegistrationPage } from '@page/clinic/clinic.registration.page';
import { ClinicRegistrationDetails } from '@interfaces/clinic.registration.interface';

test.describe('Feature: Clinic Registration', () => {
    test.setTimeout(180000);
    const openRegisterPage = getClinicRegistrationTestCaseData('open-register-clinic-page');
    const validRequiredFields = getClinicRegistrationTestCaseData('valid-required-fields');
    const emptyForm = getClinicRegistrationTestCaseData('empty-registration-form');
    const clinicNameRequired = getClinicRegistrationTestCaseData('clinic-name-required');
    const businessEmailRequired = getClinicRegistrationTestCaseData('business-email-required');
    const invalidBusinessEmail = getClinicRegistrationTestCaseData('invalid-business-email');
    const phoneNumberRequired = getClinicRegistrationTestCaseData('phone-number-required');
    const cityAutocompleteSearch = getClinicRegistrationTestCaseData('city-autocomplete-search');
    const selectCity = getClinicRegistrationTestCaseData('select-city-from-autocomplete');
    const verificationCodeSentOnce = getClinicRegistrationTestCaseData('verification-code-sent-once');
    const verificationStepOpens = getClinicRegistrationTestCaseData('verification-step-opens');
    const verifyValidCode = getClinicRegistrationTestCaseData('verify-valid-6-digit-code');
    const verifyButtonDisabled = getClinicRegistrationTestCaseData('verify-button-disabled');
    const rejectIncorrectCode = getClinicRegistrationTestCaseData('reject-incorrect-code');
    const rejectExpiredCode = getClinicRegistrationTestCaseData('reject-expired-code');
    const resendCode = getClinicRegistrationTestCaseData('resend-verification-code');
    const oldCodeAfterResend = getClinicRegistrationTestCaseData('old-code-invalid-after-resend');

    const requireDetails = (details: ClinicRegistrationDetails | undefined): ClinicRegistrationDetails => {
        if (!details) {
            throw new Error('Registration details are required for this test');
        }
        return details;
    };

    const openClinicRegistration = async (clinicRegistrationPage: ClinicRegistrationPage): Promise<void> => {
        await clinicRegistrationPage.navigateToClinicPortal();
        await clinicRegistrationPage.openRegisterClinicPage();
    };

    test(`
        Test case: '${openRegisterPage.testCaseData.testCase}'
        Description: '${openRegisterPage.testCaseData.testDescription}'
        Tags: '${openRegisterPage.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), openRegisterPage.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
    });

    test(`
        Test case: '${validRequiredFields.testCaseData.testCase}'
        Description: '${validRequiredFields.testCaseData.testDescription}'
        Tags: '${validRequiredFields.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), validRequiredFields.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.submitValidRequiredFields(requireDetails(validRequiredFields.registrationDetails));
    });

    test(`
        Test case: '${emptyForm.testCaseData.testCase}'
        Description: '${emptyForm.testCaseData.testDescription}'
        Tags: '${emptyForm.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), emptyForm.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        if (!emptyForm.validationMessages) {
            throw new Error('Validation messages are required for this test');
        }
        await clinicRegistrationPage.submitEmptyRegistrationForm(emptyForm.validationMessages);
    });

    test(`
        Test case: '${clinicNameRequired.testCaseData.testCase}'
        Description: '${clinicNameRequired.testCaseData.testDescription}'
        Tags: '${clinicNameRequired.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), clinicNameRequired.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.submitWithoutClinicName(requireDetails(clinicNameRequired.registrationDetails));
    });

    test(`
        Test case: '${businessEmailRequired.testCaseData.testCase}'
        Description: '${businessEmailRequired.testCaseData.testDescription}'
        Tags: '${businessEmailRequired.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), businessEmailRequired.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.submitWithoutBusinessEmail(requireDetails(businessEmailRequired.registrationDetails));
    });

    test(`
        Test case: '${invalidBusinessEmail.testCaseData.testCase}'
        Description: '${invalidBusinessEmail.testCaseData.testDescription}'
        Tags: '${invalidBusinessEmail.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), invalidBusinessEmail.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        if (!invalidBusinessEmail.invalidEmails) {
            throw new Error('Invalid emails are required for this test');
        }
        await clinicRegistrationPage.submitInvalidBusinessEmails(
            requireDetails(invalidBusinessEmail.registrationDetails),
            invalidBusinessEmail.invalidEmails,
        );
    });

    test(`
        Test case: '${phoneNumberRequired.testCaseData.testCase}'
        Description: '${phoneNumberRequired.testCaseData.testDescription}'
        Tags: '${phoneNumberRequired.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), phoneNumberRequired.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.submitWithoutPhoneNumber(requireDetails(phoneNumberRequired.registrationDetails));
    });

    test(`
        Test case: '${cityAutocompleteSearch.testCaseData.testCase}'
        Description: '${cityAutocompleteSearch.testCaseData.testDescription}'
        Tags: '${cityAutocompleteSearch.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), cityAutocompleteSearch.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        if (!cityAutocompleteSearch.cityQuery || !cityAutocompleteSearch.expectedCities) {
            throw new Error('City query data is required for this test');
        }
        await clinicRegistrationPage.verifyCityAutocompleteSuggestions(
            cityAutocompleteSearch.cityQuery,
            cityAutocompleteSearch.expectedCities,
        );
    });

    test(`
        Test case: '${selectCity.testCaseData.testCase}'
        Description: '${selectCity.testCaseData.testDescription}'
        Tags: '${selectCity.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), selectCity.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.selectCityFromAutocomplete(requireDetails(selectCity.registrationDetails).city);
    });

    test(`
        Test case: '${verificationCodeSentOnce.testCaseData.testCase}'
        Description: '${verificationCodeSentOnce.testCaseData.testDescription}'
        Tags: '${verificationCodeSentOnce.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), verificationCodeSentOnce.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.verifySingleVerificationCodeSent(
            requireDetails(verificationCodeSentOnce.registrationDetails),
        );
    });

    test(`
        Test case: '${verificationStepOpens.testCaseData.testCase}'
        Description: '${verificationStepOpens.testCaseData.testDescription}'
        Tags: '${verificationStepOpens.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), verificationStepOpens.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.verifyVerificationStepOpened(
            requireDetails(verificationStepOpens.registrationDetails),
        );
    });

    test(`
        Test case: '${verifyValidCode.testCaseData.testCase}'
        Description: '${verifyValidCode.testCaseData.testDescription}'
        Tags: '${verifyValidCode.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), verifyValidCode.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.verifyWithValidOtp(requireDetails(verifyValidCode.registrationDetails));
    });

    test(`
        Test case: '${verifyButtonDisabled.testCaseData.testCase}'
        Description: '${verifyButtonDisabled.testCaseData.testDescription}'
        Tags: '${verifyButtonDisabled.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), verifyButtonDisabled.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.verifyButtonDisabledUntilCodeIsComplete(
            requireDetails(verifyButtonDisabled.registrationDetails),
        );
    });

    test(`
        Test case: '${rejectIncorrectCode.testCaseData.testCase}'
        Description: '${rejectIncorrectCode.testCaseData.testDescription}'
        Tags: '${rejectIncorrectCode.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), rejectIncorrectCode.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.rejectIncorrectVerificationCode(
            requireDetails(rejectIncorrectCode.registrationDetails),
        );
    });

    test(`
        Test case: '${resendCode.testCaseData.testCase}'
        Description: '${resendCode.testCaseData.testDescription}'
        Tags: '${resendCode.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), resendCode.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.resendVerificationCode(requireDetails(resendCode.registrationDetails));
    });

    test(`
        Test case: '${oldCodeAfterResend.testCaseData.testCase}'
        Description: '${oldCodeAfterResend.testCaseData.testDescription}'
        Tags: '${oldCodeAfterResend.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        logTestCaseData(test.info(), oldCodeAfterResend.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.rejectOldCodeAfterResend(requireDetails(oldCodeAfterResend.registrationDetails));
    });

    test(`
        Test case: '${rejectExpiredCode.testCaseData.testCase}'
        Description: '${rejectExpiredCode.testCaseData.testDescription}'
        Tags: '${rejectExpiredCode.testCaseData.tags}'
      `, async ({ clinicRegistrationPage }: { clinicRegistrationPage: ClinicRegistrationPage }) => {
        test.setTimeout(15 * 60 * 1000);
        logTestCaseData(test.info(), rejectExpiredCode.testCaseData);
        await openClinicRegistration(clinicRegistrationPage);
        await clinicRegistrationPage.rejectExpiredVerificationCode(
            requireDetails(rejectExpiredCode.registrationDetails),
        );
    });
});
