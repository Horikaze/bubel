"use server";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
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
  db.klient.update({
    where: { id: user.user.id },
    data: {
      nazwisko: nazwisko || "",
      telefon: phone || "",
      email: email,
      kod_pocztowy: zip || "",
      miasto: city || "",
      ulica: street || "",
    },
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
