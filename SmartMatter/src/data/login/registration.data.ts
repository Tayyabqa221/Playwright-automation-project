import { RegistrationDetails } from "@interfaces/registration.interface";
import {  TestCaseData } from "../../interfaces/testcase.data.interface";

interface RegistrationTestCaseData {
    testCaseData: TestCaseData;
    registrationDetails: RegistrationDetails;
}
const registrationTestData: { [key: string]: RegistrationTestCaseData } = {
'admin-registration': {
    registrationDetails: {
        firstName:`Ahmad`,
        lastName: `Hassan`,
        address:'9550 Ocean Lane, Unit',
        appartmentUnit:'Unit 5B',
        city:'Modesto',
        state:'California',
        zipCode:'95350',
        phoneNumber: '3233888192',
        emailAddress:'hassan@redpocket.com',
        password:'@7GMUZ!5b78T4yi',
        confirmPassword:'@7GMUZ!5b78T4yi',

    },
    testCaseData: {
        tags: '@regression @Smoke @login',
        testCase: '0001-registration',
        testDescription: 'Validate the Admin user can registration into the Application',
        testSummary: 'Admin User registration',
    },
},
};
export function getRegistrationTestCaseData(testCase: string): RegistrationTestCaseData {
const data = registrationTestData[testCase];
if (!data) {
    throw new Error(`Test case data not found for: ${testCase}`);
}
return data;
}