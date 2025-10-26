"use client";

import { checkoutAction } from "@/actions/checkoutActions";
import { useCart } from "@/lib/zustand";
import { MetodaPlatnosci } from "@prisma/client";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import SqlView from "../_components/SqlView";

export default function Payment({
  paymentMethods,
  userId,
}: {
  paymentMethods: MetodaPlatnosci[];
  userId: string;
}) {
  const [totalPriceC, setTotalPriceC] = useState<number>(0);
  const [totalItemsC, setTotalItemsC] = useState<number>(0);
  const [pending, setIsPending] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [sqlQuery, setSqlQuery] = useState("");

  const {
    items,
    setQuantity,
    totalItems,
    addItem,
    removeItem,
    clear,
    totalPrice,
  } = useCart();

  useEffect(() => {
    setTotalPriceC(totalPrice() ?? 0);
    setTotalItemsC(totalItems() ?? 0);
  }, [items]);
  const router = useRouter();
  const handleCheckout = async () => {
    try {
      if (items.length === 0) {
        toast.error("Twój koszyk jest pusty.");
        return;
      }
      if (!paymentMethodId) {
        toast.error("Wybierz metodę płatności.");
        return;
      }
      setIsPending(true);
      await checkoutAction({
        cartItems: items,
        paymentMethod: 1,
      });
      setIsPending(false);
      toast.success(
        "Dziękujemy za dokonanie zakupu! Twoje zamówienie zostało zrealizowane pomyślnie."
      );
      clear();
      router.push("/profil#zakupy");
    } catch (error: any) {
      console.log(error.message);
      setIsPending(false);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Wystąpił błąd podczas realizacji płatności.");
      }
    }
  };
  const sqlFindClient = `
SELECT * FROM \`klient\`
WHERE \`id\` = '${userId}'
LIMIT 1;
`;

  const sqlInsertTransaction = `
INSERT INTO \`tranzakcja\`
  (\`data_tranzakcji\`, \`id_klienta\`, \`status\`, \`id_metody_platnosci\`)
VALUES
  ('${new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}', '${userId}', 0, ${paymentMethodId});
`;

  const sqlInsertGamesInTransaction = `
INSERT INTO \`tranzakcjagra\`
  (\`id_tranzakcji\`, \`id_gra\`, \`ilosc\`)
VALUES
  ${items
    .map((item) => `(LAST_INSERT_ID(), ${item.gameId}, ${item.quantity})`)
    .join(", ")};
`;
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Kasa</h1>
      <div className="flex flex-col">
        {items.length === 0 ? (
          <p>Twój koszyk jest pusty.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.gameId}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <Link
                  href={`/gra/${item.gameId}`}
                  className="font-semibold link"
                >
                  {item.gameName}
                </Link>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>Ilość:</span>
                  <div className="join">
                    <button
                      className="btn btn-xs join-item"
                      onClick={() =>
                        setQuantity(item.gameId, item.quantity - 1)
                      }
                      aria-label="Zmniejsz ilość"
                    >
                      -
                    </button>
                    <span className="px-2 text-center join-item">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-xs join-item"
                      onClick={() =>
                        setQuantity(item.gameId, item.quantity + 1)
                      }
                      aria-label="Zwiększ ilość"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4">
                    Cena: {(item.price * item.quantity).toFixed(2)} zł
                  </span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-error"
                onClick={() => removeItem(item.gameId)}
              >
                Usuń
              </button>
            </div>
          ))
        )}

        {items.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold">
              Łącznie ({totalItemsC}{" "}
              {totalItemsC === 1 ? "przedmiot" : "przedmioty"}):{" "}
              {totalPriceC ? totalPriceC.toFixed(2) : "0.00"} zł
            </span>
            <select
              onChange={(e) => setPaymentMethodId(Number(e.target.value))}
              defaultValue=""
              className="select appearance-none pl-3 ml-auto mr-2"
            >
              <option value="" disabled={true}>
                Podaj metodę płatności
              </option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.nazwa}
                </option>
              ))}
            </select>
            <div className="tooltip mr-2">
              <div className="tooltip-content">
                <span>SELECT * FROM `metodaplatnosci`</span>
              </div>
              <FaInfoCircle className="opacity-50 cursor-pointer" />
            </div>
            <button
              className="btn btn-primary"
              disabled={pending}
              onClick={handleCheckout}
            >
              {pending && <FaSpinner className="animate-spin size-4" />}
              Przejdź do płatności
            </button>
          </div>
        )}
      </div>
      <SqlView
        sql={sqlFindClient + sqlInsertTransaction + sqlInsertGamesInTransaction}
      />
    </div>
  );
}
