import db from "@/lib/prisma";
import Link from "next/link";
import React from "react";
import SqlView from "../_components/SqlView";

export default async function MyPurchases({ userId }: { userId: string }) {
  const purchases = await db.tranzakcja.findMany({
    where: {
      id_klienta: userId,
    },
    include: {
      Gry: true,
    },
    orderBy: { data_tranzakcji: "desc" },
  });
  const sqlQuery = `
SELECT *
FROM \`tranzakcja\`
WHERE \`id_klienta\` = '${userId}'
ORDER BY \`data_tranzakcji\` DESC;

SELECT *
FROM \`tranzakcjagra\`
WHERE \`id_tranzakcji\` IN (
  SELECT \`id\`
  FROM \`tranzakcja\`
  WHERE \`id_klienta\` = '${userId}'
);
`;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Moje zakupy</h2>

      <SqlView sql={sqlQuery} />
      <div className="flex flex-col gap-1">
        {purchases.length === 0 ? (
          <p>Brak zakupów.</p>
        ) : (
          purchases.map((purchase) => (
            <Link
              href={`/tranzakcja/${purchase.id}`}
              key={purchase.id}
              className="p-2 border rounded card hover:opacity-80 transition-all"
            >
              <p>ID Transakcji: {purchase.id}</p>
              <p>Data Zakupu: {purchase.data_tranzakcji.toDateString()}</p>
              <p>
                Liczba Gier:{" "}
                {purchase.Gry.map((game) => game.ilosc).reduce(
                  (a, b) => a + b,
                  0
                )}
              </p>
              <p>Kwota: {purchase.kwota.toString()} PLN</p>
              <p>
                Status:{" "}
                {purchase.status === 0
                  ? "Oczekująca"
                  : purchase.status === 1
                  ? "W drodze"
                  : "Anulowana"}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
