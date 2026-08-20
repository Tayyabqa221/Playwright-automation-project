import { addDays, format } from 'date-fns';
import fs from 'fs';
import path from 'path';

const FILE_BASE_PATH = 'src/data/files/';

/**
 * Splits an array into chunks of a specified size.
 *
 * @param array The array to be chunked.
 * @param chunkSize The size of each chunk.
 * @returns A new array containing the chunks of the original array.
 */
export const chunkArray = (array: string[], chunkSize: number): string[][] => {
  const result: string[][] = [];
  for (let index = 0; index < array.length; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize);
    result.push(chunk);
  }
  return result;
};

// Returns date in 'DD/MM/YYYY' format
export function fixDateFormat(date: Date, formatStr?: string): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  if (formatStr === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`; // YYYY-MM-DD format
  }

  return `${day}/${month}/${year}`; // Combine them in DD-MM-YYYY format
}

export function getDate(formatStr: string = 'dd-MM-yyyy', dateInput: string = 'today'): string {
  let date: Date;

  // Handle special keywords like 'today', 'yesterday', 'tomorrow', or relative offsets
  // Updated regex to handle spaces between 'today' and '+' and between '+' and number
  const match = dateInput.match(/today\s*([+-])\s*(\d+)/i);

  if (match) {
    const operator = match[1]; // '+' or '-'
    const days = parseInt(match[2], 10);
    const offsetDays = operator === '+' ? days : -days;
    date = addDays(new Date(), offsetDays);
    //logic to subtract 1 day if needed for expiry date
    if (dateInput.includes('365')) {
      date = addDays(date, -1);
    }
  } else if (dateInput.toLowerCase() === 'today') {
    date = new Date(); // Handle plain 'today'
  } else if (dateInput.toLowerCase() === 'yesterday') {
    date = addDays(new Date(), -1);
  } else if (dateInput.toLowerCase() === 'tomorrow') {
    date = addDays(new Date(), 1);
  } else {
    // Try to parse a fixed date string
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error(`Received date value "${dateInput}" is not recognized`);
    }
  }

  // Check for ISO date-time format
  if (formatStr === 'iso' || formatStr === 'ISO' || formatStr === 'timestamp') {
    // Return in format: YYYY-MM-DDThh:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // Return the formatted date
  return format(date, formatStr);
}

export function resolveDate(dateInput: string): Date {
  if (dateInput.toLowerCase() === 'today') {
    return new Date();
  } else if (dateInput.toLowerCase() === 'tomorrow') {
    return addDays(new Date(), 1);
  } else if (dateInput.toLowerCase() === 'yesterday') {
    return addDays(new Date(), -1);
  } else {
    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date input: "${dateInput}"`);
    }
    return parsedDate;
  }
}

// Returns date with required Month Name
export function getFormattedDateWithMonthName(date: Date): string {
  const day = String(date.getDate());
  const year = date.getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${day} ${monthNames[date.getMonth()]} ${year}`;

  return formattedDate; // returns date in format eg: 9 Sep 2024
}

/**
 * Constructs and returns the full path to a file.
 *
 * @param filePath - The relative path from the base directory to the file, including any folders.
 * @returns The full file path as a string.
 */
export const getDataFilePath = (filePath: string): string => {
  return `${FILE_BASE_PATH}${filePath}`;
};

/**
 * Converts a file to its base64 representation.
 *
 * @param fileName - The file name with extension (e.g., 'image.png').
 * @returns - The base64 encoded string of the file.
 */
export const convertFileToBase64 = (fileName: string): string => {
  const filePath = getDataFilePath(fileName); // Get the full file path using the getDataFilePath function
  const absFilePath = path.resolve(filePath);
  try {
    const fileBuffer = fs.readFileSync(absFilePath);
    return fileBuffer.toString('base64'); // Return the base64 encoded data
  } catch (err) {
    throw new Error(`Error reading the file: ${err.message}`);
  }
};

interface Cookie {
  name: string;
  value: string;
}

export function getValueFromCookies(
  filename: 'financial-crime' | 'underwriter-assistant' | 'underwriter-technician' | 'underwriter',
  cookieKeyName: 'AWSALBAuthNonce' | 'AWSELBAuthSessionCookie-0' | 'AWSELBAuthSessionCookie-1' | 'JSESSIONID',
): string | undefined {
  const storageStateDir = path.resolve(__dirname, '../../src/cookies');
  const filePath = path.join(storageStateDir, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return undefined;
  }
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cookiesData: { cookies: Cookie[] } = JSON.parse(fileContents);

    // Find the cookie object with the specified name and return its value
    const foundCookie = cookiesData.cookies.find((c: Cookie) => c.name === cookieKeyName);
    return foundCookie?.value;
  } catch (error: unknown) {
    console.error(`Error reading or parsing file ${filePath}:`, error);
    return undefined;
  }
}

/**
 * Returns the date for next year or month (one day before) in specified format
 *
 * @param currentDate - The current date to calculate from
 * @param period - 'year' or 'month' to determine which period to calculate
 * @param formatStr - Optional format string using date-fns format tokens (e.g., 'dd-MM-yyyy', 'dd MMM yyyy', 'yyyy/MM/dd')
 * @returns Date string in specified format
 */

export function getNextPeriodDate(
  currentDate: Date,
  period: 'month' | 'year',
  step: number = 1, // NEW: how many months or years to add
  formatStr?: string,
): string {
  const date = new Date(currentDate);

  if (period === 'year') {
    date.setFullYear(date.getFullYear() + step);
  } else {
    date.setMonth(date.getMonth() + step);
  }

  // Subtract one day to get the last day of the previous period
  date.setDate(date.getDate() - 1);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date calculation');
  }

  // Adjust default formatting based on day
  const day = date.getDate();
  const defaultFormat = day < 10 ? 'd MMM yyyy' : 'dd MMM yyyy';

  return format(date, formatStr ?? defaultFormat);
}

export function getCountryCode(country: string): string {
  const countryCodeMap: { [key: string]: string } = {
    Australia: 'AU',
    Belgium: 'BE',
    Brazil: 'BR',
    Canada: 'CA',
    China: 'CN',
    France: 'FR',
    Germany: 'DE',
    India: 'IN',
    Italy: 'IT',
    Japan: 'JP',
    Mexico: 'MX',
    Netherlands: 'NL',
    'New Zealand': 'NZ',
    Singapore: 'SG',
    'South Africa': 'ZA',
    Spain: 'ES',
    Switzerland: 'CH',
    'United Arab Emirates': 'AE',
    'United Kingdom of Great Britain and Northern Ireland': 'GB',
    'United States of America': 'USA',
  };

  return countryCodeMap[country] || 'US'; // Default to US if country not found
}

export function getCurrencyCode(currency: string): string {
  const currencyCodeMap: { [key: string]: string } = {
    'Australian Dollar': 'AUD',
    'British Pound - Sterling': 'GBP',
    'Canadian Dollar': 'CAD',
    'Chinese Yuan': 'CNY',
    Euro: 'EUR',
    'Japanese Yen': 'JPY',
    'New Zealand Dollar': 'NZD',
    'Singapore Dollar': 'SGD',
    'South African Rand': 'ZAR',
    'Swedish Krona': 'SEK',
    'Swiss Frank': 'CHF',
    'U.A.E. Dirham': 'AED',
    'United States Dollar': 'USD',
  };

  return currencyCodeMap[currency] || 'USD'; // Default to USD if currency not found
}

export function convertToUpperCasingAndRepSpaceWithUnderscore(str: string): string {
  /**
   * Formats a string into an API enum format by converting to uppercase and replacing spaces with underscores
   *
   * @param input The input string (e.g., "Open Market")
   * @returns Formatted string for API use (e.g., "OPEN_MARKET")
   */
  return str.toUpperCase().replace(/\s+/g, '_');
}
