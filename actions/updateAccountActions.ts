"use server";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";

export const updateAccountAction = async (formData: FormData) => {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session) throw new Error("Nieautoryzowany");
    const name = formData.get("name") as string;
    const nazwisko = formData.get("surname") as string;
    const phone = formData.get("phone") as string;
    const zip = formData.get("zip") as string;
    const city = formData.get("city") as string;
    const street = formData.get("street") as string;
    if (!name) {
      throw new Error("Popraw swoje dane");
    }
    await auth.api.updateUser({
      body: {
        name,
      },
      headers: hdrs,
    });

    await db.klient.update({
      where: { id: session.user.id },
      data: {
        imie: name,
        nazwisko: nazwisko || "",
        telefon: phone || "",
        kod_pocztowy: zip || "",
        miasto: city || "",
        ulica: street || "",
      },
    });
    return { message: "", status: true };
  } catch (error: any) {
    console.log(error);
    let errorMessage =
      error?.body?.message || error?.message || "Błąd podczas aktualizacji";
    if (errorMessage == "Password too short")
      errorMessage = "Hasło jest za krótkie";
    return { message: errorMessage, status: false };
  }
};
