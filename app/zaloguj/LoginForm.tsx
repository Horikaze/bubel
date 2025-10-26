"use client";
import { singInAction, singUpAction } from "@/actions/authActions";
import { randomAlphaNumNode } from "@/utils/generators";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import SqlView from "../_components/SqlView";
// Typ dla całego formularza
export type LoginFormData = {
  name: string;
  surname: string;
  phone: string;
  zip: string;
  city: string;
  street: string;
  email: string;
  password: string;
};
export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    name: "",
    surname: "",
    phone: "",
    zip: "",
    city: "",
    street: "",
    email: "",
    password: "",
  });
  const [pending, setIsPending] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setSqlQuery(`
INSERT INTO \`KLIENT\` (\`id\`, \`id_konta\`, \`imie\`, \`nazwisko\`, \`email\`, \`telefon\`, \`miasto\`, \`kod_pocztowy\`, \`ulica\`)
VALUES (DEFAULT, '${randomAlphaNumNode(10)}', '${updated.name}', '${
        updated.surname
      }', '${updated.email}', '${updated.phone}', '${updated.city}', '${
        updated.zip
      }', '${updated.street}');`);

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsPending(true);
      let res;
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (isLogin) {
        res = await singInAction(data);
      } else {
        res = await singUpAction(data);
      }
      setIsPending(false);
      if (res.status) {
        window.location.reload();
      }
    } catch (error: any) {
      setIsPending(false);
      let errorMessage;
      if (isLogin) {
        errorMessage =
          error?.body?.message || error?.message || "Błąd podczas logowania";
        if (errorMessage == "Invalid email or password")
          errorMessage = "Nieprawidłowy email lub hasło";
      } else {
        errorMessage =
          error?.body?.message || error?.message || "Błąd podczas rejestracji";
        if (errorMessage == "Password too short")
          errorMessage = "Hasło jest za krótkie";
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {!isLogin && sqlQuery && (
        <div className="max-w-4xl">
          <SqlView sql={sqlQuery} />
        </div>
      )}
      <h1 className="font-semibold text-3xl mt-3">
        {isLogin ? "Zaloguj" : "Rejestruj"}
      </h1>
      <form className="card-body max-w-[400px] w-full" onSubmit={handleSubmit}>
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`btn btn-sm ${isLogin ? "btn-primary" : ""} flex-1`}
          >
            Zaloguj
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`btn btn-sm ${isLogin ? "" : "btn-primary"} flex-1`}
          >
            Rejestruj
          </button>
        </div>
        <fieldset className="fieldset w-full">
          {!isLogin && (
            <>
              <label className="label">Imię</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                maxLength={20}
                placeholder="Imię"
                disabled={pending}
              />
              <label className="label">Nazwisko</label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                maxLength={20}
                className="input w-full"
                placeholder="Nazwisko"
                disabled={pending}
              />
              <label className="label">Nr. Telefonu</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                maxLength={15}
                onChange={handleChange}
                className="input w-full"
                placeholder="Nr. Telefonu"
                disabled={pending}
              />
              <label className="label">Kod pocztowy</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                maxLength={10}
                className="input w-full"
                placeholder="Kod pocztowy"
                disabled={pending}
              />
              <label className="label">Miasto</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                maxLength={20}
                className="input w-full"
                placeholder="Miasto"
                disabled={pending}
              />
              <label className="label">Ulica</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                maxLength={20}
                onChange={handleChange}
                className="input w-full"
                placeholder="Ulica"
                disabled={pending}
              />
            </>
          )}
          <label className="floating-label">
            <span>Twój email</span>
            <input
              type="email"
              name="email"
              maxLength={30}
              value={formData.email}
              onChange={handleChange}
              className="input w-full"
              placeholder="mail@gmail.com"
              required
              disabled={pending}
            />
          </label>
          <label className="floating-label">
            <span>Hasło</span>
            <input
              type="password"
              name="password"
              maxLength={20}
              value={formData.password}
              onChange={handleChange}
              className="input w-full"
              placeholder="Hasło"
              required
              disabled={pending}
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn btn-neutral mt-4"
          >
            {pending && <FaSpinner className="animate-spin size-4" />}
            {isLogin ? "Zaloguj" : "Rejestruj"}
          </button>
        </fieldset>
      </form>
    </>
  );
}
