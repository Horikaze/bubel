import { db } from "@/db/drizzle";
import { klient } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import SqlView from "../_components/SqlView";
import UpdateAccount from "./UpdateAccount";
import AddGame from "./AddGame";
import AddProducer from "./AddProducer";
import AddLanguage from "./AddLanguage";

export default async function Profil() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userData = await db.query.klient.findFirst({
    where: eq(klient.id_konta, session?.user.id),
  });
  if (!userData) redirect("/login");

  const producers = await db.query.producent.findMany();
  const languages = await db.query.jezyk.findMany();

  const sqlQuery = `SELECT \`id\`, \`id_konta\`, \`imie\`, \`email\`, \`nazwisko\`, \`telefon\`, \`miasto\`, \`kod_pocztowy\`, \`ulica\` 
      FROM \`KLIENT\` 
      WHERE \`KLIENT\`.\`id_konta\` = \'${session?.user.id}\';`;
  return (
    <div className="flex flex-col items-start gap-2">
      <SqlView sql={sqlQuery} />
      <div className="flex flex-col">
        <h2 className="font-semibold text-2xl">Szczegóły konta:</h2>
        <div className="flex flex-col gap-1">
          <p>ID użytkownika: {userData.id}</p>
          <p>ID konta: {session?.user.id}</p>
          <p>Imię: {userData.imie}</p>
          <p>Nazwisko: {userData.nazwisko || "Nie podano"}</p>
          <p>Email: {userData.email || "Nie podano"}</p>
          <p>Telefon: {userData.telefon || "Nie podano"}</p>
          <p>Miasto: {userData.miasto || "Nie podano"}</p>
          <p>Kod pocztowy: {userData.kod_pocztowy || "Nie podano"}</p>
          <p>Ulica: {userData.ulica || "Nie podano"}</p>
        </div>
      </div>
      <UpdateAccount
        def={{
          name: userData.imie,
          surname: userData.nazwisko || "",
          phone: userData.telefon || "",
          zip: userData.kod_pocztowy || "",
          city: userData.miasto || "",
          street: userData.ulica || "",
          email: userData.email || "",
          password: "",
        }}
        userId={userData.id_konta}
      />
      {session.user.role == "admin" ? (
        <>
          <AddGame
            userId={session.user.id}
            producers={producers}
            languages={languages}
          />
          <AddProducer />
          <AddLanguage />
        </>
      ) : null}
    </div>
  );
}
