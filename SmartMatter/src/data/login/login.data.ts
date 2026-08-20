import { LoginDetails,LogoutPage } from "@interfaces/login.interface";
import {  TestCaseData } from "../../interfaces/testcase.data.interface";

interface LoginTestCaseData {
    testCaseData: TestCaseData;
    loginDetails: LoginDetails;
}
interface LogoutPageTestCaseData {
    testCaseData: TestCaseData;
    logoutPage: LogoutPage;
}
const loginTestData: { [key: string]: LoginTestCaseData } = {
'login-Data': {
    loginDetails: {
        username:`hassan@redpocket.com`,
        password: `SecurePass123!`,
        verifySignUpPage:'Almost there, get your RedPocket login.'
    },
    testCaseData: {
        tags: '@regression @Smoke @login',
        testCase: 'login-Data',
        testDescription: 'Validate the Admin user can login into the Application',
        testSummary: 'Admin User login',
    },
},
};

const logoutPageTestCaseData: { [key: string]: LogoutPageTestCaseData } = {
    'Logout-Page': {
        logoutPage: {
            verifyLogoutPage:'Sign in'
        },
        testCaseData: {
            tags: '@regression @Smoke @login',
            testCase: 'Logout Page',
            testDescription: 'Validate the Admin user can Logout into the Application',
            testSummary: 'Admin User login',
        },
    },
    };

export function getData(testCase: string): LoginTestCaseData {
const data = loginTestData[testCase];
if (!data){
    throw new Error (`Test case data not found for: ${testCase}`);
}
return data;

}  

export function logoutPage(testCase: string): LogoutPageTestCaseData {
    const data = logoutPageTestCaseData[testCase];
    if (!data){
        throw new Error (`Test case data not found for: ${testCase}`);
    }
    return data;
    
    }  