import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
];

function getPrivateKey(): string {
  if (process.env.GOOGLE_PRIVATE_KEY_B64) {
    return Buffer.from(process.env.GOOGLE_PRIVATE_KEY_B64, "base64").toString("utf-8");
  }

  if (process.env.GOOGLE_PRIVATE_KEY) {
    return process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");
  }

  throw new Error("GOOGLE_PRIVATE_KEY_B64 atau GOOGLE_PRIVATE_KEY belum di-set");
}

export function getGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_EMAIL) {
    throw new Error("GOOGLE_CLIENT_EMAIL belum di-set");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: getPrivateKey(),
    },
    scopes: SCOPES,
  });

  return auth;
}

export function getGoogleSheets() {
  const auth = getGoogleAuth();
  return google.sheets({ version: "v4", auth });
}
