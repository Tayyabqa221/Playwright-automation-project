import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

/**
 * Generates a random number with the specified number of digits.
 *
 * @param digits - The number of digits for the generated number.
 * @returns - A random number with the specified number of digits.
 * @throws {Error} - If the number of digits is less than or equal to zero.
 */
export const generateRandomNumber = (digits: number): string => {
  if (digits <= 0 || digits > 15) {
    throw new Error('Invalid number of digits. Please provide a number between 1 and 15.');
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  return `${faker.number.int({ max, min })}`;
};

export const generateUniqueId = (): string => {
  return uuidv4();
};

export const generateRandomAlphanumeric = (length: number): string => {
  if (length <= 0 || length > 50) {
    // You can adjust the max length as needed
    throw new Error('Invalid length. Please provide a number between 1 and 50.');
  }

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = faker.number.int({ max: characters.length - 1, min: 0 });
    result += characters[randomIndex];
  }

  return result;
};

export const removeTrailingSlash = (value: string): string => {
  return value.replace(/\/$/, '');
};

/**
 * Generates a random email using the Mailosaur domain.
 *
 * @returns - A randomly generated email address.
 */
export const generateRandomEmailAddress = (): string => {
  const randomString = faker.string.alphanumeric(8);
  const mailosaurDomain = process.env.mailosaurDomain;
  return `${randomString}@${mailosaurDomain}`;
};

/**
 * Generates a random email subject.
 *
 * @returns - A randomly generated email subject.
 */
export const generateRandomEmailSubject = (): string => {
  return faker.lorem.sentence(5); // Generates a random sentence with 5 words
};

/**
 * Generates a random email body.
 *
 * @returns - A randomly generated email body.
 */
export const generateRandomEmailBody = (): string => {
  return faker.lorem.paragraphs(1);
};
