"use client";

import { addGameType } from "@/actions/gameAction";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import SqlView from "../_components/SqlView";

type AddTypeType = {
  nazwa: string;
  opis: string;
};

export default function AddType() {
  const [formData, setFormData] = useState<Partial<AddTypeType> | null>(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    const escape = (v: string) => v.replace(/'/g, "''");
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const fields: [string, string | null | undefined][] = [
        ["nazwa", updated.nazwa],
        ["opis", updated.opis],
      ];
      const validFields = fields.filter(([_, v]) => (v ?? "").trim() !== "");

      if (validFields.length > 0) {
        const columns = validFields.map(([col]) => `\`${col}\``).join(", ");
        const values = validFields
          .map(([_, v]) => `'${escape(String(v))}'`)
          .join(", ");

        const query = `INSERT INTO \`RODZAJ\` (${columns}) VALUES (${values});`;
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
      const res = await addGameType({
        nazwa: formData.nazwa || "",
        opis: formData.opis || "",
      });
      setPending(false);
      toast.success("Dodano rodzaj gry");
      formRef.current?.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
      setPending(false);
      toast.error("Błąd podczas dodawania rodzaju gry");
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
        <h2 className="font-semibold text-2xl">Dodaj Rodzaj Gry</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-40">Rodzaj</span>
          <input
            required
            type="text"
            name="nazwa"
            maxLength={20}
            placeholder="Rodzaj"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-40">Opis</span>
          <textarea
            required
            name="opis"
            maxLength={200}
            placeholder="Opis..."
            onChange={handleChange}
            disabled={pending}
            className="textarea textarea-sm h-24 max-h-52"
          />
        </div>

        <button className="btn btn-primary place-self-start" disabled={pending}>
          {pending && <FaSpinner className="animate-spin size-4" />}
          Dodaj Rodzaj
        </button>
      </form>
    </>
  );
}
