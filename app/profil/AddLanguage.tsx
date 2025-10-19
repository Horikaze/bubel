"use client";

import { addGameProducerAction, addLanguage } from "@/actions/addGameAction";
import { uploadImagesAction } from "@/actions/uploadImages";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import SqlView from "../_components/SqlView";
import { FaSpinner } from "react-icons/fa6";

type AddLanguageType = {
  nazwa: string;
  skrot: string;
  images: string;
};

export default function AddLanguage() {
  const [formData, setFormData] = useState<Partial<AddLanguageType> | null>(
    null
  );
  const [sqlQuery, setSqlQuery] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    const escape = (v: string) => v.replace(/'/g, "''");
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const fields: [string, string | null | undefined][] = [
        ["nazwa", updated.nazwa],
        ["flaga", updated.images],
        ["skrot", updated.skrot],
      ];
      const validFields = fields.filter(([_, v]) => (v ?? "").trim() !== "");

      if (validFields.length > 0) {
        const columns = validFields.map(([col]) => `\`${col}\``).join(", ");
        const values = validFields
          .map(([_, v]) => `'${escape(String(v))}'`)
          .join(", ");

        const query = `INSERT INTO \`JEZYK\` (${columns}) VALUES (${values});`;
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
      setPending(true);
      const data = new FormData();
      if (!formData) return;
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      const imagesData = new FormData(e.currentTarget);
      const images = await uploadImagesAction(imagesData);

      const res = await addLanguage({
        nazwa: formData.nazwa || "",
        images: images[0] || "",
        skrot: formData.skrot || "",
      });
      setPending(false);
      toast.success("Dodano język");
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error("Błąd podczas dodawania języka");
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
        <h2 className="font-semibold text-2xl">Dodaj Język</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-40">Nazwa</span>
          <input
            required
            type="text"
            name="nazwa"
            maxLength={20}
            placeholder="Nazwa"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-40">Flaga</span>
          <input
            required
            type="file"
            name="images"
            accept="image/*"
            placeholder="Flaga"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Skrót</span>
          <input
            required
            type="text"
            name="skrot"
            maxLength={5}
            placeholder="Skrót"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <button className="btn btn-primary place-self-start" disabled={pending}>
          {pending && <FaSpinner className="animate-spin size-4" />}
          Dodaj producenta
        </button>
      </form>
    </>
  );
}
