"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { CartItem } from "@/lib/zustand";
import { headers } from "next/headers";

type checkoutActionProps = {
  cartItems: CartItem[];
  paymentMethod: number;
};

export const checkoutAction = async ({
  cartItems,
  paymentMethod,
}: checkoutActionProps) => {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) throw new Error("Nieautoryzowany");
  await db.$transaction(async (tx) => {
    const klient = await tx.klient.findFirstOrThrow({
      where: {
        id: session.user.id,
      },
    });
    if (
      !klient.imie ||
      !klient.nazwisko ||
      !klient.ulica ||
      !klient.miasto ||
      !klient.kod_pocztowy
    ) {
      throw new Error("Uzupełnij dane adresowe w profilu przed zakupem.");
    }
    await tx.tranzakcja.create({
      data: {
        data_tranzakcji: new Date(),
        id_klienta: session.user.id,
        status: 0,
        kwota: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        id_metody_platnosci: paymentMethod,
        Gry: {
          createMany: {
            data: [
              ...cartItems.map((item) => ({
                id_gra: item.gameId,
                ilosc: item.quantity,
              })),
            ],
          },
        },
      },
    });
    for (const item of cartItems) {
      await tx.gra.updateMany({
        where: { id: item.gameId, dostepnosc: { gte: item.quantity } },
        data: {
          dostepnosc: {
            decrement: item.quantity,
          },
        },
      });
    }
  });
};
