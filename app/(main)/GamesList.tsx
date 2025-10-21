import { db } from "@/db/drizzle";
import { gra } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function GamesList() {
  const games = await db
    .select({
      id: gra.id,
      nazwa: gra.nazwa,
      cena: gra.cena,
      ocena: gra.ocena,
      zdjecia: gra.zdjecia,
    })
    .from(gra);

  return (
    <div className="flex gap-2">
      {games.map((g) => (
        <Link
          href={`gra/${g.id}`}
          key={g.id}
          className="bg-accent w-52 h-72 rounded-box overflow-hidden group"
        >
          {g.zdjecia && (
            <Image
              src={g.zdjecia.split(",")[0]}
              alt={g.nazwa}
              width="0"
              height="0"
              sizes="100vh"
              className="object-cover h-full w-full group-hover:scale-110 transition-all"
            />
          )}
        </Link>
      ))}
    </div>
  );
}
