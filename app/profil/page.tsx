import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SqlView from "../_components/SqlView";
import AdminSection from "./AdminSection";
import MyPurchases from "./MyPurchases";
import UpdateAccount from "./UpdateAccount";

export default async function Profil() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const userData = await db.klient.findFirst({
    where: {
      id: session.user.id,
    },
  });
  if (!userData) redirect("/login");

  const sqlQuery = `SELECT * FROM \`KLIENT\`
      WHERE \`KLIENT\`.\`id_konta\` = \'${session?.user.id}\';`;
  return (
    <div className="flex flex-col gap-2">
      <SqlView sql={sqlQuery} />
      <div className="flex flex-col">
        <h2 className="font-semibold text-2xl">Szczegóły konta:</h2>
        <div className="flex flex-col gap-1">
          <p>ID użytkownika: {userData.id}</p>
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
        userId={userData.id}
      />
      {session.user.role == "admin" ? (
        <AdminSection userId={session.user.id} />
      ) : null}
      <div className="divider"></div>
      <MyPurchases userId={session.user.id} />
    </div>
  );
}
