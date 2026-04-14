"use server";

import { getAkunAdmin } from "@/lib/sheets";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let isSuccess = false;

  if (!email || !password) {
    return { success: false, message: "Email dan Password wajib diisi!" };
  }

  try {
    const akunList = await getAkunAdmin();
    const isLocalhost = process.env.NODE_ENV !== "production";

    // Validate against Google Sheets data
    const match = akunList.find((akun) => akun.email.toLowerCase() === email.toLowerCase());

    if (!match) {
      return { success: false, message: "Alamat Email tidak ditemukan di sistem Desa!" };
    }

    // Verifikasi Hash Password API secara ketat (Tanpa fallback Teks Biasa)
    let isVerified = false;
    
    if (match.password.startsWith("$2a$") || match.password.startsWith("$2b$")) {
      isVerified = await bcrypt.compare(password, match.password);
    } else {
      return { success: false, message: "Keamanan ditolak" };
    }

    if (!isVerified) {
      return { success: false, message: "Kata sandi yang Anda masukkan salah!" };
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", match.email, {
      httpOnly: true,
      secure: !isLocalhost,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    isSuccess = true;

  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Login Server Action Error:", error);
    return { success: false, message: "Terjadi kesalahan internal server saat memvalidasi otentikasi." };
  }

  if (isSuccess) {
    redirect("/admin");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
