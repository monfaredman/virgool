export type AuthResponse = {
  code: number;
  token: string;
};

export type GoogleUser = {
  email: string;
  firstName?: string;
  lastName?: string;
  profile_image?: string;
  accessToken?: string;
};
