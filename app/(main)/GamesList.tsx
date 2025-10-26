import db from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

export default async function GamesList() {
  const game = await db.gra.findMany({
    include: {
      Jezyk: true,
    },
  });
  const games = game;
  return (
    <div className="flex gap-2 flex-wrap md:justify-start justify-center">
      {games.map((g) => (
        <Link
          href={`gra/${g.id}`}
          key={g.id}
          className="bg-accent h-72 w-52  rounded-box overflow-hidden group relative text-white"
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
          <div className="inset-0 absolute opacity-0 group-hover:opacity-100 transition-all bg-gradient-to-b from-transparent via-to-black/20 to-black/60" />
          <div className="inset-0 bg-black/20 absolute flex flex-col justify-end p-2 text-end">
            <p className="">{g.cena?.toString() || ""} zł</p>
            <p className="font-bold text-sm">{g.nazwa}</p>
            <div className="h-0 group-hover:h-6 transition-all flex justify-between opacity-0 group-hover:opacity-100">
              <div className="flex justify-end items-center">
                <Image
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-5 h-auto"
                  alt="jezyk"
                  src={g.Jezyk?.flaga || "/flags/united-nations.png"}
                />
              </div>
              <div className="flex justify-end items-center">
                <FaStar className="text-yellow-300" />
                <span>{g.ocena?.toString() || "Brak ocen"}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
