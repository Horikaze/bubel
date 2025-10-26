"use server";
import SqlView from "@/app/_components/SqlView";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import AddComment from "./AddComment";
import AddToCartButton from "./AddToCartButton";
import { headers } from "next/headers";
import Rating from "@/app/_components/Rating";
import { FaX } from "react-icons/fa6";
import { DeleteCommentAction } from "@/actions/gameAction";

export default async function Gra({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (!gameId) {
    notFound();
  }
  const session = await auth.api.getSession({ headers: await headers() });
  const gameData = await db.gra.findUnique({
    where: { id: gameId },
    include: {
      Producent: {
        select: {
          nazwa: true,
          logo: true,
        },
      },
      Komentarz: {
        include: {
          Klient: true,
        },
      },
      Jezyk: true,
      Rodzaj: true,
    },
  });
  if (!gameId || !gameData) {
    notFound();
  }
  const sqlQueryGame = `
SELECT 
  g.id,
  g.nazwa,
  g.cena,
  g.id_producenta,
  g.id_jezyk,
  g.data_wydania,
  g.od_ilu_lat,
  g.id_rodzaj,
  g.opis,
  g.zdjecia,
  g.ocena,
  g.dostepnosc,
  p.nazwa AS producent_nazwa,
  p.logo AS producent_logo
FROM GRA g
LEFT JOIN PRODUCENT p ON g.id_producenta = p.id
WHERE g.id = '${gameId}';
`;
  const sqlQueryComments = `
SELECT 
  id,
  id_klienta,
  tresc,
  ocena,
  data_dodania
FROM KOMENTARZ
WHERE id_gry = '${gameId}'
ORDER BY data_dodania DESC;
`;
  const ratingNum = gameData?.ocena
    ? parseFloat(gameData.ocena.toString())
    : null;
  const ratingText =
    ratingNum !== null
      ? Number.isInteger(ratingNum)
        ? ratingNum.toFixed(1)
        : String(ratingNum)
      : "Brak Ocen";
  return (
    <div className="flex gap-2 flex-col">
      <SqlView sql={sqlQueryGame} />
      <div className="flex p-10 justify-between  md:flex-row flex-col ">
        <div className="flex-1">
          <div className="h-[32rem] bg-red-200 w-[24rem] rounded-box overflow-hidden">
            {gameData.zdjecia ? (
              <Image
                src={gameData.zdjecia.split(",")[0]}
                alt={gameData.nazwa}
                width="0"
                height="0"
                sizes="100vh"
                className="object-cover size-full"
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h1 className="font-semibold text-3xl">{gameData.nazwa}</h1>
          <div className="flex gap-2">
            {ratingNum ? (
              <Rating
                rating={ratingNum}
                disable
                size="large"
                name={`rating-game-${gameId}`}
              />
            ) : null}
            <span className="text-lg">{ratingText}</span>
          </div>
          <p className="opacity-80 text-sm">
            Data wydania: {gameData.data_wydania?.toLocaleDateString()}{" "}
            Producent: {gameData.Producent?.nazwa}
          </p>
          <div className="flex gap-1 text-sm">
            <span>Język:</span>
            <Image
              alt={gameData.Jezyk?.skrot!}
              src={gameData.Jezyk?.flaga!}
              width="0"
              height="0"
              sizes="100vw"
              className="w-5 h-auto"
              title={gameData.Jezyk?.nazwa!}
            />
            <span>Na stanie: {gameData.dostepnosc} sztuk</span>
          </div>
          <p className="text-sm">
            {gameData.Rodzaj?.nazwa + " - " + gameData.Rodzaj?.opis}
          </p>
          <p className="text-2xl font-semibold">Opis:</p>
          <p className="text-lg">{gameData.opis}</p>
          <div className="flex mt-auto items-center justify-between md:flex-row flex-col">
            <p className="text-lg">
              Cena:{" "}
              <span className="font-bold">{gameData.cena?.toString()} zł</span>
            </p>
            <AddToCartButton
              gameId={gameId}
              gameName={gameData.nazwa}
              price={
                gameData.cena?.toFixed(2) ? Number(gameData.cena.toFixed(2)) : 0
              }
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {session && (
          <AddComment gameId={Number(gameId)} userId={session.user.id} />
        )}
        <SqlView sql={sqlQueryComments} />
        <h2 className="text-2xl font-semibold">Komentarze:</h2>
        {gameData.Komentarz.length === 0 ? (
          <p>Brak komentarzy.</p>
        ) : (
          gameData.Komentarz.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border rounded card transition-all relative"
            >
              {session?.user.id == comment.id_klienta ? (
                <form
                  action={DeleteCommentAction}
                  className="top-0 right-0 absolute"
                >
                  <input
                    type="text"
                    name="commentId"
                    id={`commentId-${comment.id}`}
                    value={comment.id}
                    readOnly
                    hidden
                  />
                  <button className="size-6 btn btn-circle btn-ghost grid place-items-center">
                    <FaX />
                  </button>
                </form>
              ) : null}
              <div className="flex items-center mb-2">
                <span className="font-semibold">{comment.Klient?.imie}</span>
                <Rating
                  rating={Number(comment.ocena.toString())}
                  disable
                  size="small"
                  name={`rating-comment-${comment.id}`}
                />
                <span className="text-sm opacity-70 ml-auto">
                  {comment.data_dodania.toDateString()}
                </span>
              </div>
              <p>{comment.tresc}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
