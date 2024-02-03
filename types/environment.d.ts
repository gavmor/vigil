declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_SIGNING_SECRET: string;
      SLACK_BOT_TOKEN: string;
      SLACK_USER_ID: string;
      SLACK_CHANNEL_ID: string;

      ASTRA_DB_API_ENDPOINT: string;
      ASTRA_DB_APPLICATION_TOKEN: string;
    }
  }
}


export {}