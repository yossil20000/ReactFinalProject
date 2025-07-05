export function safeJsonParse<T = unknown>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Invalid JSON:', error);
    return null;
  }
}

export function safeJsonStringify<T = unknown>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return '';
  }
}

