import { singUpAction } from "@/actions/authActions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import LoginForm from "./LoginForm";

export default async function Zaloguj() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/");
  return (
    <div className="flex-1 items-center justify-center flex-col flex mt-40 w-full">
      <LoginForm />
    </div>
  );
}
