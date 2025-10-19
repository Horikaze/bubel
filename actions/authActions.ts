"use server";

import { db } from "@/db/drizzle";
import { klient } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// drop DATABASE bubel;
// CREATE DATABASE bubel;
export const singUpAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nazwisko = formData.get("surname") as string;
  const phone = formData.get("phone") as string;
  const zip = formData.get("zip") as string;
  const city = formData.get("city") as string;
  const street = formData.get("street") as string;

  if (!name || !email || !password) {
    throw new Error("Popraw swoje dane");
  }
  const user = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });
  await db.insert(klient).values({
    id_konta: user.user.id,
    imie: user.user.name || "",
    nazwisko: nazwisko || "",
    email: email || "",
    telefon: phone || "",
    kod_pocztowy: zip || "",
    miasto: city || "",
    ulica: street || "",
  });
  return { status: true };
};

export const singInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  return { status: true };
};
export const signOutAction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/");
};
