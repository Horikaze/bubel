"use server";

import { db } from "@/db/drizzle";
import { gra, jezyk, klient, producent } from "@/db/schema";
import { auth } from "@/lib/auth";
import { log } from "console";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const addGameAction = async (formData: FormData) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  const nazwa = formData.get("nazwa") as string;
  const cena = formData.get("cena") as string;
  const id_producenta = Number(formData.get("id_producenta"));
  const id_jezyk = Number(formData.get("id_jezyk"));
  const data_wydania = formData.get("data_wydania") as string;
  const od_ilu_lat = Number(formData.get("od_ilu_lat"));
  const id_rodzaj = Number(formData.get("id_rodzaj"));
  const opis = formData.get("opis") as string;
  const zdjecia = formData.get("zdjecia") as string;
  const ocena = Number(formData.get("ocena"));
  const dostepnosc = Number(formData.get("dostepnosc"));
  if (
    !nazwa ||
    !cena ||
    !id_producenta ||
    !id_jezyk ||
    !data_wydania ||
    !id_rodzaj ||
    !opis ||
    !zdjecia ||
    !ocena ||
    !dostepnosc ||
    !od_ilu_lat
  ) {
    throw new Error("Popraw swoje dane");
  }
};

export type AddProducerType = {
  nazwa: string;
  images: string;
  opis: string;
};

export const addGameProducerAction = async (producer: AddProducerType) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  if (!producer) throw new Error("Brak danych producenta");
  await db.insert(producent).values({
    ...producer,
    logo: producer.images,
  });
};

export type AddLanguageType = {
  nazwa: string;
  images: string;
  skrot: string;
};

export const addLanguage = async (languaage: AddLanguageType) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  if (!languaage) throw new Error("Brak danych języku");
  await db.insert(jezyk).values({
    ...languaage,
    flaga: languaage.images,
  });
};

export type AddGameTypeType = {
  nazwa: string;
  opis: string;
};

export const addGameType = async (gameType: AddGameTypeType) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  if (!gameType) throw new Error("Brak danych języku");
  await db.insert(jezyk).values({
    ...gameType,
  });
};
