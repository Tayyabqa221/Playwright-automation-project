import { ClinicRegistrationDetails } from '@interfaces/clinic.registration.interface';
import { TestCaseData } from '../../interfaces/testcase.data.interface';

interface ClinicRegistrationTestCaseData {
    cityQuery?: string;
    expectedCities?: string[];
    invalidEmails?: string[];
    registrationDetails?: ClinicRegistrationDetails;
    testCaseData: TestCaseData;
    validationMessages?: string[];
}

const validRegistrationDetails: ClinicRegistrationDetails = {
    address: '123 Harley Street, London',
    businessEmail: 'qa.clinic.validation@gmail.com',
    city: 'London',
    clinicName: 'QA Automation Clinic {unique}',
    fullName: 'Jane Smith',
    phoneNumber: '020 7123 4567',
};

const clinicRegistrationTestData: { [key: string]: ClinicRegistrationTestCaseData } = {
    'open-register-clinic-page': {
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Open Register a Clinic Page',
            testDescription: 'Verify that a user can open the clinic registration page from the Clinic Portal using the "Register a clinic" link.',
            testSummary: 'Open Register a Clinic Page',
        },
    },
    'valid-required-fields': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P0',
            testCase: 'Submit Registration with All Valid Required Fields',
            testDescription: 'Verify that Step 1 can be submitted using valid values for all mandatory fields.',
            testSummary: 'Submit Registration with All Valid Required Fields',
        },
    },
    'empty-registration-form': {
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Submit Empty Registration Form',
            testDescription: 'Verify validation when the user clicks "Send verification code" without entering any data.',
            testSummary: 'Submit Empty Registration Form',
        },
        validationMessages: [
            'Clinic Name is required.',
            'Please enter your full name.',
            'Business Email is required.',
            'Phone Number is required.',
            'Address is required.',
            'City is required.',
        ],
    },
    'clinic-name-required': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Clinic Name Is Required',
            testDescription: 'Verify that Clinic name cannot be left blank.',
            testSummary: 'Clinic Name Is Required',
        },
    },
    'business-email-required': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Business Email Is Required',
            testDescription: 'Verify that Business email cannot be left blank.',
            testSummary: 'Business Email Is Required',
        },
    },
    'invalid-business-email': {
        invalidEmails: ['user', 'user@', 'user @gmail.com', 'user@@gmail.com'],
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Business Email with Invalid Format',
            testDescription: 'Verify validation for invalid email formats such as missing @, missing domain, spaces, or multiple @ characters.',
            testSummary: 'Business Email with Invalid Format',
        },
    },
    'phone-number-required': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Phone Number Is Required',
            testDescription: 'Verify that Phone number cannot be left blank.',
            testSummary: 'Phone Number Is Required',
        },
    },
    'city-autocomplete-search': {
        cityQuery: 'Lon',
        expectedCities: ['London', 'Londonderry'],
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'City Autocomplete Search',
            testDescription: 'Verify city suggestions appear when the user starts typing a valid city name.',
            testSummary: 'City Autocomplete Search',
        },
    },
    'select-city-from-autocomplete': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Select City from Autocomplete',
            testDescription: 'Verify a city can be selected from the autocomplete suggestions.',
            testSummary: 'Select City from Autocomplete',
        },
    },
    'verification-code-sent-once': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P0',
            testCase: 'Verification Code Sent Once on Valid Submission',
            testDescription: 'Verify clicking "Send verification code" once triggers one verification request.',
            testSummary: 'Verification Code Sent Once on Valid Submission',
        },
    },
    'verification-step-opens': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P0',
            testCase: 'Verification Step Opens After Valid Registration',
            testDescription: 'Verify the user is taken to the email verification step after Step 1 is submitted successfully.',
            testSummary: 'Verification Step Opens After Valid Registration',
        },
    },
    'verify-valid-6-digit-code': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P0',
            testCase: 'Verify with Valid 6-Digit Code',
            testDescription: 'Verify a valid, unexpired 6-digit verification code can be submitted.',
            testSummary: 'Verify with Valid 6-Digit Code',
        },
    },
    'verify-button-disabled': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Verify Button Disabled Until Code Is Complete',
            testDescription: 'Verify the Verify button state when fewer than 6 digits are entered.',
            testSummary: 'Verify Button Disabled Until Code Is Complete',
        },
    },
    'reject-incorrect-code': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Reject Incorrect Verification Code',
            testDescription: 'Verify behavior when a wrong 6-digit code is submitted.',
            testSummary: 'Reject Incorrect Verification Code',
        },
    },
    'reject-expired-code': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Reject Expired Verification Code',
            testDescription: 'Verify a code cannot be used after the stated 10-minute expiry period.',
            testSummary: 'Reject Expired Verification Code',
        },
    },
    'resend-verification-code': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P1',
            testCase: 'Resend Verification Code',
            testDescription: 'Verify the Resend code link sends a new verification code.',
            testSummary: 'Resend Verification Code',
        },
    },
    'old-code-invalid-after-resend': {
        registrationDetails: validRegistrationDetails,
        testCaseData: {
            tags: '@regression @Smoke @clinic @P0',
            testCase: 'Old Code Invalid After Resend',
            testDescription: 'Verify the previous verification code cannot be used after a new code is issued.',
            testSummary: 'Old Code Invalid After Resend',
        },
    },
};

export function getClinicRegistrationTestCaseData(testCase: string): ClinicRegistrationTestCaseData {
    const data = clinicRegistrationTestData[testCase];
    if (!data) {
        throw new Error(`Test case data not found for: ${testCase}`);
    }
    return data;
}
