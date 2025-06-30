export const isValidURL = (string: string): boolean => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeURL = (input: string): string => {
  const trimmed = input.trim();
  
  // If it already has a protocol, return as is
  if (trimmed.match(/^https?:\/\//)) {
    return trimmed;
  }
  
  // Add https:// by default
  return `https://${trimmed}`;
};

export const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};