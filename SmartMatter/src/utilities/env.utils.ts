export function getEnvVariable(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getEnvNumber(name: string, defaultValue?: number): number {
  const rawValue = process.env[name];

  if (rawValue === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set`);
  }

  const parsed = Number(rawValue);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} is not a valid number`);
  }

  return parsed;
}
