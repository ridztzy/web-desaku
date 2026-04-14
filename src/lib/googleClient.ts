import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
];

export function getGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Kredensial Service Account belum di-set di .env.local");
  }

  // Handle newline characters in the private key if they are escaped in .env strings
  const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  return auth;
}

export function getGoogleSheets() {
  const auth = getGoogleAuth();
  return google.sheets({ version: "v4", auth });
}
