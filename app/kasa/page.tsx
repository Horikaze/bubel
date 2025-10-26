import db from "@/lib/prisma";
import Payment from "./Payment";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Kasa() {
  const session = await auth.api.getSession({ headers: await headers() });
  const paymentMethod = await db.metodaPlatnosci.findMany();
  return <Payment paymentMethods={paymentMethod} userId={session?.user.id || ""} />;
}
