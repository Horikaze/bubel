import db from "@/lib/prisma";
import { FaGamepad, FaLanguage, FaSpaceAwesome, FaUser } from "react-icons/fa6";
import AddGame from "./AddGame";
import AddLanguage from "./AddLanguage";
import AddProducer from "./AddProducer";
import AddType from "./AddType";

export default async function AdminSection({ userId }: { userId: string }) {
  const producers = await db.producent.findMany();
  const languages = await db.jezyk.findMany();
  const types = await db.rodzaj.findMany();
  return (
    <div>
      <div className="divider"></div>
      <p className="text-red-300 text-xs">
        To jest sekcja dostępna tylko dla administratorów.
      </p>
      <div className="tabs tabs-box mt-4">
        <label className="tab px-4">
          <input type="radio" name="lista" defaultChecked />
          <FaGamepad className="mr-2" />
          Dodaj Grę
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <AddGame
            userId={userId}
            producers={producers}
            languages={languages}
            types={types}
          />
        </div>
        <label className="tab px-4">
          <input type="radio" name="lista" />
          <FaUser className="mr-2" />
          Dodaj Producenta
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <AddProducer />
        </div>
        <label className="tab px-4">
          <input type="radio" name="lista" />
          <FaLanguage className="mr-2" />
          Dodaj Język
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <AddLanguage />
        </div>
        <label className="tab px-4">
          <input type="radio" name="lista" />
          <FaSpaceAwesome className="mr-2" />
          Dodaj Typ Gry
        </label>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <AddType />
        </div>
      </div>
    </div>
  );
}
