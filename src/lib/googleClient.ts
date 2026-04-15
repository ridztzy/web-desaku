import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
];

function parsePrivateKey(raw: string): string {
  let key = raw;

  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, "\n");

  if (!key.includes("\n") && key.includes("PRIVATE KEY")) {
    key = key
      .replace("-----BEGIN RSA PRIVATE KEY-----", "")
      .replace("-----END RSA PRIVATE KEY-----", "")
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .trim();

    const CHUNK_SIZE = 64;
    const chunks: string[] = [];
    for (let i = 0; i < key.length; i += CHUNK_SIZE) {
      chunks.push(key.slice(i, i + CHUNK_SIZE));
    }

    const keyType = raw.includes("RSA PRIVATE KEY") ? "RSA PRIVATE KEY" : "PRIVATE KEY";
    key = `-----BEGIN ${keyType}-----\n${chunks.join("\n")}\n-----END ${keyType}-----\n`;
  }

  return key;
}

export function getGoogleAuth() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Kredensial Service Account belum di-set di .env.local");
  }

  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);

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
