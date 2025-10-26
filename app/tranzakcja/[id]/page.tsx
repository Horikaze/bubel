import SqlView from "@/app/_components/SqlView";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

export default async function Tranzakzja({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { id } = await params;
  const transaction = await db.tranzakcja.findUnique({
    where: { id: Number(id) },
    include: {
      Gry: {
        include: {
          Gra: true,
        },
      },
      MetodaPlatnosci: true,
    },
  });

  if (!transaction) {
    return notFound();
  }

  if (transaction.id_klienta !== session?.user.id) {
    return notFound();
  }
  const sqlQuery = `
SELECT * FROM \`tranzakcja\` AS t
WHERE t.id = ${id}
LIMIT 1;

SELECT * FROM \`metodaplatnosci\` AS m
WHERE m.id = (
  SELECT id_metody_platnosci FROM \`tranzakcja\` WHERE id = ${id}
)
LIMIT 1;

SELECT * FROM \`tranzakcjagra\` AS gt
WHERE gt.id_tranzakcji = ${id};

SELECT * FROM \`gra\` AS g
WHERE g.id IN (
  SELECT id_gra FROM \`tranzakcjagra\` WHERE id_tranzakcji = ${id}
);
`;
  return (
    <div className="flex flex-col gap-2">
      <SqlView sql={sqlQuery} />
      <h1 className="text-2xl font-semibold">Tranzakzja {transaction.id}</h1>
      <div className="flex flex-col gap-1">
        <p>Data tranzakcji: {transaction.data_tranzakcji.toDateString()}</p>
        <p>Kwota: {transaction.kwota.toString()} PLN</p>
        <p>Metoda płatności: {transaction.MetodaPlatnosci!.nazwa}</p>
        <p>
          Status:{" "}
          {transaction.status === 0
            ? "Oczekująca"
            : transaction.status === 1
            ? "W drodze"
            : "Anulowana"}
        </p>
        <div className="divider"></div>
        <h2 className="text-xl font-semibold">Zakupione gry:</h2>
        <div className="flex flex-col gap-1">
          {transaction.Gry.length === 0 ? (
            <p>Brak zakupionych gier.</p>
          ) : (
            transaction.Gry.map((game) => (
              <div key={game.id_gra} className="flex justify-between">
                <span>{game.Gra.nazwa}</span>
                <span>
                  {game.ilosc} x {game.Gra.cena!.toString()} PLN
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
