import SqlView from "@/app/_components/SqlView";
import db from "@/lib/prisma";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";

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
  const gameData = await db.gra.findUnique({
    where: { id: gameId },
    include: {
      Producent: {
        select: {
          nazwa: true,
          logo: true,
        },
      },
      Komentarz: true,
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
  const ratingNum = gameData.ocena ? Number(gameData.ocena.toString()) : null;
  const ratingText =
    ratingNum !== null
      ? Number.isInteger(ratingNum)
        ? ratingNum.toFixed(1)
        : String(ratingNum)
      : "Brak Ocen";
  return (
    <div className="flex flex-col gap-2">
      <SqlView sql={sqlQueryGame} />

      <div className="flex p-10 justify-between">
        <div className="flex-1">
          <div className="h-[32rem] bg-red-200 w-[24rem] rounded-box">
            Zdjęcie
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h1 className="font-semibold text-3xl">{gameData.nazwa}</h1>
          <div className="flex gap-2">
            {gameData.ocena ? (
              <Rating rating={Number(gameData.ocena.toString())} disable />
            ) : null}
            <span className="text-lg">{ratingText}</span>
          </div>
          <p className="opacity-80 text-sm">
            Data wydania: {gameData.data_wydania?.toLocaleDateString()}{" "}
            Producent: {gameData.Producent?.nazwa}
          </p>
          <div className="flex gap-1">
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
          </div>
          <p className="text-sm">
            {gameData.Rodzaj?.nazwa + " - " + gameData.Rodzaj?.opis}
          </p>
          <p className="text-2xl font-semibold">Opis:</p>
          <p className="text-lg">{gameData.opis}</p>
          <div className="flex mt-auto items-center justify-between">
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
        <SqlView sql={sqlQueryComments} />
      </div>
    </div>
  );
}
type RatingProps = {
  rating: number; // np. 3.5
  disable?: boolean;
};
export function Rating({ rating, disable }: RatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const checkedIndex = Math.round(clamped * 2); // 0..10

  return (
    <div className="rating rating-lg rating-half">
      <input
        type="radio"
        name="rating-8"
        className="rating-hidden"
        aria-hidden="true"
        readOnly
      />
      {Array.from({ length: 5 }).map((_, i) => {
        const half1Index = i * 2 + 1;
        const half2Index = i * 2 + 2;
        return (
          <React.Fragment key={i}>
            <input
              disabled={disable}
              type="radio"
              name="rating-8"
              className="mask mask-star-2 mask-half-1 bg-orange-400"
              aria-label={`${i + 0.5} star`}
              defaultChecked={checkedIndex === half1Index}
              readOnly
            />
            <input
              type="radio"
              disabled={disable}
              name="rating-8"
              className="mask mask-star-2 mask-half-2 bg-orange-400"
              aria-label={`${i + 1} star`}
              defaultChecked={checkedIndex === half2Index}
              readOnly
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
