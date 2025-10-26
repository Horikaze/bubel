"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers";

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
  const ocena = formData.get("ocena") as string;
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
  await db.gra.create({
    data: {
      nazwa,
      cena: new Prisma.Decimal(cena),
      id_producenta,
      id_jezyk,
      data_wydania: new Date(data_wydania),
      od_ilu_lat,
      id_rodzaj,
      opis,
      zdjecia,
      ocena,
      dostepnosc,
    },
  });
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
  await db.producent.create({
    data: {
      nazwa: producer.nazwa,
      logo: producer.images,
      opis: producer.opis,
    },
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
  await db.jezyk.create({
    data: {
      nazwa: languaage.nazwa,
      flaga: languaage.images,
      skrot: languaage.skrot,
    },
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
  await db.rodzaj.create({
    data: {
      nazwa: gameType.nazwa,
      opis: gameType.opis,
    },
  });
};

export const AddCommentAction = async (
  gameId: number,
  content: string,
  rating: number
) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  if (!gameId || !content || !rating) throw new Error("Brak danych komentarza");
  await db.$transaction(async (tx) => {
    await tx.komentarz.create({
      data: {
        id_gry: gameId,
        id_klienta: session.user.id,
        tresc: content,
        ocena: rating,
        data_dodania: new Date(),
      },
    });
    const avgRating = await tx.komentarz.aggregate({
      where: { id_gry: gameId },
      _avg: { ocena: true },
    });
    if (avgRating._avg.ocena !== null) {
      await tx.gra.update({
        where: { id: gameId },
        data: { ocena: avgRating._avg.ocena },
      });
    }
  });
};
export const DeleteCommentAction = async (formData: FormData) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  const commentId = Number(formData.get("commentId"));
  if (!commentId) throw new Error("Brak danych komentarza");
  await db.$transaction(async (tx) => {
    const comment = await tx.komentarz.findUnique({
      where: { id: commentId },
    });
    if (!comment) throw new Error("Nie znaleziono komentarza");
    if (comment.id_klienta !== session.user.id)
      throw new Error("Nie masz uprawnień do usunięcia tego komentarza");
    await tx.komentarz.delete({
      where: { id: commentId },
    });
    const avgRating = await tx.komentarz.aggregate({
      where: { id_gry: comment.id_gry },
      _avg: { ocena: true },
    });
    // set to null if no comments left
    if (avgRating._avg.ocena === null) {
      await tx.gra.update({
        where: { id: comment.id_gry },
        data: { ocena: null },
      });
    } else if (avgRating._avg.ocena !== null) {
      await tx.gra.update({
        where: { id: comment.id_gry },
        data: { ocena: avgRating._avg.ocena },
      });
    }
    revalidatePath(`/gra/${commentId}`);
  });
};
