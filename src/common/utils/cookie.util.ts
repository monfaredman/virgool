export function CookiesOptionsToken() {
  return {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  };
}
