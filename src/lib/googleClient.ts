import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
];

interface ServiceAccountCredential {
  client_email: string;
  private_key: string;
}

function getCredentials(): ServiceAccountCredential {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccountCredential;
    return parsed;
  }

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Set GOOGLE_SERVICE_ACCOUNT_JSON atau GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY");
  }

  return {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

export function getGoogleAuth() {
  const { client_email, private_key } = getCredentials();

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email, private_key },
    scopes: SCOPES,
  });

  return auth;
}

export function getGoogleSheets() {
  const auth = getGoogleAuth();
  return google.sheets({ version: "v4", auth });
}
