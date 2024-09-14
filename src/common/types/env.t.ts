// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
    //Application
    PORT: number;
    //Database
    DP_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    //Secrets
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
  }
}
