"use client";

import { useRef, useState } from "react";
import SqlView from "../_components/SqlView";
import { addGameAction } from "@/actions/addGameAction";
import { jezyk, producent, rodzaj } from "@/db/schema";
import toast from "react-hot-toast";
import { FaInfo, FaSpinner } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { uploadImagesAction } from "@/actions/uploadImages";

type Gra = {
  nazwa: string | null;
  id_producenta: string | null;
  cena: string | null;
  id_jezyk: string | null;
  data_wydania: string | null;
  od_ilu_lat: string | null;
  id_rodzaj: string | null;
  opis: string | null;
  zdjecia: string | null;
  ocena: string | null;
  dostepnosc: string | null;
};
type Producers = typeof producent.$inferSelect;
type Languages = typeof jezyk.$inferSelect;
type GameTypes = typeof rodzaj.$inferSelect;
type AddGameProps = {
  userId: string;
  producers: Producers[];
  languages: Languages[];
  types: GameTypes[];
};

export default function AddGame({
  userId,
  producers,
  languages,
  types,
}: AddGameProps) {
  const [formData, setFormData] = useState<Partial<Gra>>({});
  const [sqlQuery, setSqlQuery] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    const escape = (v: string) => v.replace(/'/g, "''");

    // aktualizujemy formData
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Tworzymy pary kolumna -> wartość
      const fields: [string, string | null | undefined][] = [
        ["nazwa", updated.nazwa],
        ["cena", updated.cena],
        ["id_producenta", updated.id_producenta],
        ["id_jezyk", updated.id_jezyk],
        ["data_wydania", updated.data_wydania],
        ["od_ilu_lat", updated.od_ilu_lat],
        ["id_rodzaj", updated.id_rodzaj],
        ["opis", updated.opis],
        ["zdjecia", updated.zdjecia],
        ["ocena", updated.ocena],
        ["dostepnosc", updated.dostepnosc],
      ];

      // filtrujemy puste pola
      const validFields = fields.filter(([_, v]) => (v ?? "").trim() !== "");

      if (validFields.length > 0) {
        const columns = validFields.map(([col]) => `\`${col}\``).join(", ");
        const values = validFields
          .map(([_, v]) => `'${escape(String(v))}'`)
          .join(", ");

        const query = `INSERT INTO \`GRA\` (${columns}) VALUES (${values});`;
        setSqlQuery(query);
      } else {
        setSqlQuery("");
      }

      return updated;
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // setPending(true);
      const imagesData = new FormData(e.currentTarget);
      const images = await uploadImagesAction(imagesData);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value as string)
      );
      data.append("zdjecia", images.join(","));
      await addGameAction(data);
      toast.success("Dodano producenta");
      // formRef.current?.reset();
      // router.refresh();
      setPending(false);
    } catch (error) {
      toast.error((error as Error).message);
      setPending(false);
    }
  };

  return (
    <>
      {sqlQuery && (
        <div className="max-w-4xl">
          <SqlView sql={sqlQuery} />
        </div>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <h2 className="font-semibold text-2xl">Dodaj grę</h2>
        <p className="text-red-300 text-xs">
          To jest sekcja dostępna tylko dla administratorów.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-40">Tytuł</span>
          <input
            required
            type="text"
            maxLength={20}
            name="nazwa"
            placeholder="Tytuł gry"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-40">Cena</span>
          <input
            required
            type="number"
            name="cena"
            maxLength={10}
            placeholder="Cena"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <span className="w-40">Producent</span>
          <select
            defaultValue=""
            required
            className="select select-sm rounded-md pl-3"
            disabled={pending}
            name="id_producenta"
            onChange={handleChange}
          >
            <option value="" disabled={true}>
              Producent
            </option>
            {producers.map((producer) => (
              <option key={producer.id} value={producer.id}>
                {producer.nazwa}
              </option>
            ))}
          </select>
          <div className="tooltip absolute top-0 -right-5">
            <div className="tooltip-content">
              <span>SELECT * FROM `PRODUCENT`;</span>
            </div>
            <FaInfoCircle className="opacity-50 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <span className="w-40">Język</span>
          <select
            defaultValue=""
            required
            className="select select-sm rounded-md pl-3"
            disabled={pending}
            name="id_jezyk"
            onChange={handleChange}
          >
            <option value="" disabled={true}>
              Język
            </option>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.nazwa}
              </option>
            ))}
          </select>
          <div className="tooltip absolute top-0 -right-5">
            <div className="tooltip-content">
              <span>SELECT * FROM `JEZYK`;</span>
            </div>
            <FaInfoCircle className="opacity-50 cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Data wydania</span>
          <input
            required
            type="datetime-local"
            name="data_wydania"
            placeholder="Data wydania"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Od ilu lat</span>
          <input
            required
            type="number"
            name="od_ilu_lat"
            maxLength={3}
            placeholder="Od ilu lat"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2 relative">
          <span className="w-40">Rodzaj</span>
          <select
            defaultValue=""
            required
            className="select select-sm rounded-md pl-3"
            disabled={pending}
            name="id_rodzaj"
            onChange={handleChange}
          >
            <option value="" disabled={true}>
              Rodzaj
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nazwa}
              </option>
            ))}
          </select>
          <div className="tooltip absolute top-0 -right-5">
            <div className="tooltip-content">
              <span>SELECT * FROM `RODZAJ`;</span>
            </div>
            <FaInfoCircle className="opacity-50 cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Opis</span>
          <input
            required
            type="text"
            name="opis"
            maxLength={300}
            placeholder="Opis"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Zdjęcia</span>
          <input
            required
            type="file"
            multiple
            name="images"
            placeholder="Zdjęcia"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Ocena</span>
          <input
            required
            type="number"
            maxLength={3}
            name="ocena"
            placeholder="Ocena"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Dostępność</span>
          <input
            type="number"
            maxLength={3}
            required
            name="dostepnosc"
            placeholder="Dostępność"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <button className="btn btn-primary place-self-start" disabled={pending}>
          {pending && <FaSpinner className="animate-spin size-4" />}
          Dodaj grę
        </button>
      </form>
    </>
  );
}
