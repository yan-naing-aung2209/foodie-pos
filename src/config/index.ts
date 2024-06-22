interface Config {
  googleClientId: string;
  googleClientSecret: string;
  backofficeApiBaseUrl: string;
  orderApiBaseUrl: string;
  spaceEndPoint: string;
  spaceAccessKeyId: string;
  spaceSecretAccessKey: string;
  orderAppUrl: string;
  callbackUrl: string;
}

export const config: Config = {
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  backofficeApiBaseUrl: process.env.NEXT_PUBLIC_BACKOFFICE_API_BASE_URL || "",
  orderApiBaseUrl: process.env.NEXT_PUBLIC_ORDER_API_BASE_URL || "",
  callbackUrl: process.env.NEXT_PUBLIC_CALLBACK_URL || "",
  spaceEndPoint: process.env.SPACE_ENDPOINT || "",
  spaceAccessKeyId: process.env.SPACE_ACCESS_KEY_ID || "",
  spaceSecretAccessKey: process.env.SPACE_SECRET_ACCESS_KEY || "",
  orderAppUrl: process.env.NEXT_PUBLIC_ORDER_APP_URL || "",
};
