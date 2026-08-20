import { getValueFromCookies } from '@utilities/general.utils';
import { getEnvVariable } from './env.utils';

export async function getAPIHeaders(
  user: 'financial-crime' | 'underwriter-assistant' | 'underwriter-technician' | 'underwriter',
): Promise<{ [key: string]: string }> {
  const JSESSIONID = getValueFromCookies(user, 'JSESSIONID');
  const AWSELBAuthSessionCookie0 = getValueFromCookies(user, 'AWSELBAuthSessionCookie-0');
  const AWSELBAuthSessionCookie1 = getValueFromCookies(user, 'AWSELBAuthSessionCookie-1');

  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US',
    'content-type': 'application/json',
    cookie: `JSESSIONID=${JSESSIONID}; AWSELBAuthSessionCookie-0=${AWSELBAuthSessionCookie0}; AWSELBAuthSessionCookie-1=${AWSELBAuthSessionCookie1}`,
    'message-id': '6d39c691-59ce-4719-a3f3-64c6cbbafdec',
    'sec-ch-ua': '"Chromium";v="133", "Not(A:Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.16 Safari/537.36',
  };
  return headers;
}

export async function getXrayHeaders(): Promise<{ [key: string]: string }> {
  const token = getEnvVariable('XRAY_TOKEN');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/xml',
  };
  return headers;
}
