"use client";
import { updateAccountAction } from "@/actions/updateAccountActions";
import React, { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import SqlView from "../_components/SqlView";
import { LoginFormData } from "../zaloguj/LoginForm";
import toast from "react-hot-toast";

export default function UpdateAccount({
  def,
  userId,
}: {
  def: LoginFormData;
  userId: string;
}) {
  const [formData, setFormData] = useState<LoginFormData>(def);
  const [pending, setPending] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  let userID = userId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const escape = (v: string) => v.replace(/'/g, "''");

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      const fields: [string, string | undefined | null][] = [
        ["imie", updated.name],
        ["nazwisko", updated.surname],
        ["telefon", updated.phone],
        ["kod_pocztowy", updated.zip],
        ["miasto", updated.city],
        ["ulica", updated.street],
      ];

      const parts = fields
        .filter(([_, v]) => (v ?? "").toString().trim() !== "")
        .map(([col, v]) => `\`${col}\` = '${escape(String(v))}'`);

      if (parts.length > 0) {
        const query = `UPDATE \`KLIENT\` SET
  ${parts.join(",\n  ")}
WHERE \`KLIENT\`.\`id\` = '${escape(String(userID))}';`;
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
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      const res = await updateAccountAction(data);
      if (!res) throw new Error("Brak odpowiedzi z serwera");
      setPending(false);
    } catch (error) {
      setPending(false);
      toast.error("Wystąpił błąd podczas aktualizacji konta");
    }
  };
  return (
    <>
      <button
        onClick={() => dialogRef!.current!.showModal()}
        className="btn btn-primary place-self-start"
      >
        <p>Aktulizuj dane konta</p>
      </button>
      <dialog ref={dialogRef} className="modal">
        <form onSubmit={handleSubmit} className="modal-box flex flex-col">
          {sqlQuery && <SqlView sql={sqlQuery} />}
          <h3 className="font-bold text-lg">Aktulizacjia danych konta</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mt-2">
              <span className="w-26">Imię</span>
              <input
                type="text"
                defaultValue={formData.name}
                name="name"
                placeholder="Imię"
                onChange={handleChange}
                disabled={pending}
                className="input input-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-26">Nazwisko</span>
              <input
                type="text"
                defaultValue={formData.surname}
                placeholder="Nazwisko"
                disabled={pending}
                onChange={handleChange}
                name="surname"
                className="input input-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-26">Telefon</span>
              <input
                type="number"
                defaultValue={formData.phone}
                placeholder="Telefon"
                onChange={handleChange}
                disabled={pending}
                name="phone"
                className="input input-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-26">Miasto</span>
              <input
                type="text"
                defaultValue={formData.city}
                onChange={handleChange}
                placeholder="Miasto"
                disabled={pending}
                name="city"
                className="input input-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-26">Kod pocztowy</span>
              <input
                type="text"
                defaultValue={formData.zip}
                disabled={pending}
                onChange={handleChange}
                placeholder="Kod pocztowy"
                name="zip"
                className="input input-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-26">Ulica</span>
              <input
                type="text"
                defaultValue={formData.street}
                disabled={pending}
                placeholder="Ulica"
                onChange={handleChange}
                name="street"
                className="input input-sm"
              />
            </div>
          </div>
          <button disabled={pending} className="btn btn-primary ml-auto mt-3">
            {pending && <FaSpinner className="animate-spin size-4" />}
            Aktualizuj
          </button>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
