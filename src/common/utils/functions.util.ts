export const createSlug = (title: string): string => {
  return title
    ?.replace(/[ٍ،؛؟\.\+\-_)(!@#$%^&*=~`?><|][:;÷٪×،۰ء]/g, '')
    ?.replace(/\s+/g, '-');
};
