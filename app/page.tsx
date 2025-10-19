import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div>
      <Link href={"/listaGier"}>
        {session && <p>Witaj: {session?.user.name}</p>}
      </Link>
    </div>
  );
}
