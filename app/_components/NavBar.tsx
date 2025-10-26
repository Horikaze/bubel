import { signOutAction } from "@/actions/authActions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import { FaArrowRightToBracket, FaCartShopping, FaUser } from "react-icons/fa6";
import ShowSqlSwitch from "./ShowSqlSwitch";
import ThemeSwitcher from "./ThemeSwitcher";
import CartItems from "./CartItems";

export default async function NavBar() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <nav className="navbar bg-base-100 shadow-sm flex justify-between">
      <Link href={"/"} className="btn btn-ghost text-xl">
        12311
      </Link>
      <div className="flex gap-2 items-center">
        <div className="flex gap-2">
          SQL:
          <ShowSqlSwitch />
          <ThemeSwitcher />
        </div>
        <CartItems />
        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <FaUser className="size-6" />
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {session ? (
                <>
                  <li>
                    <Link href={"/profil"}>Profil</Link>
                  </li>
                  <li>
                    <form className="p-0 size-full" action={signOutAction}>
                      <button className="py-[4px] px-[10px] cursor-pointer">
                        Wyloguj
                      </button>
                    </form>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
        ) : (
          <Link href={"/zaloguj"} className="btn btn-ghost">
            <FaArrowRightToBracket className="size-5" />
            Zaloguj
          </Link>
        )}
      </div>
    </nav>
  );
}
