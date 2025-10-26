"use client";
import {
  addGameProducerAction,
  AddProducerType,
} from "@/actions/gameAction";
import { uploadImagesAction } from "@/actions/uploadImages";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import SqlView from "../_components/SqlView";
import { FaSpinner } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function AddProducer() {
  const [formData, setFormData] = useState<Partial<AddProducerType> | null>(
    null
  );
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
        ["logo", updated.images],
      ];
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
      setPending(true);
      const data = new FormData();
      if (!formData) return;
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      const imagesData = new FormData(e.currentTarget);
      const images = await uploadImagesAction(
        imagesData.getAll("images") as File[]
      );

      const res = await addGameProducerAction({
        nazwa: formData.nazwa || "",
        images: images[0] || "",
        opis: formData.opis || "",
      });
      setPending(false);
      formRef.current?.reset();
      toast.success("Dodano producenta");
      router.refresh();
    } catch (error) {
      setPending(false);
      toast.error("Wystąpił błąd podczas dodawania producenta");
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
        <h2 className="font-semibold text-2xl">Dodaj Producenta</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-40">Nazwa</span>
          <input
            required
            type="text"
            name="nazwa"
            maxLength={100}
            placeholder="Nazwa"
            onChange={handleChange}
            disabled={pending}
            className="input input-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="w-40">Opis</span>
          <textarea
            required
            maxLength={500}
            name="opis"
            placeholder="Opis"
            onChange={handleChange}
            disabled={pending}
            className="input min-h-20 max-h-52 input-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-40">Obraz</span>
          <input
            required
            type="file"
            name="images"
            accept="image/*"
            placeholder="Język"
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
