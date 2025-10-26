import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SqlView from "../_components/SqlView";
import GamesList from "./GamesList";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const sqlQueryAllGames = `SELECT * FROM \`GRA\`
  LEFT JOIN \`JEZYK\` ON \`GRA\`.\`id_jezyk\` = \`JEZYK\`.\`id\`;`;

  return (
    <div className="flex flex-col">
      {session && (
        <p className="text-3xl font-semibold">
          Witaj:{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {session?.user.name}
          </span>
        </p>
      )}
      <div className="flex flex-col gap-1 mt-4">
        <SqlView sql={sqlQueryAllGames} />
        <p>Nowości:</p>
        <GamesList />
      </div>
    </div>
  );
}
