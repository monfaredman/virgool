export const createSlug = (title: string): string => {
  return title
    ?.replace(/[ٍ،؛؟\.\+\-_)(!@#$%^&*=~`?><|][:;÷٪×،۰ء]/g, '')
    ?.replace(/\s+/g, '-');
};

export const randomId = (): string => Math.random().toString(36).substr(2);
