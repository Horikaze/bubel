"use client";
import { useCart } from "@/lib/zustand";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function CartItems() {
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [totalPriceC, setTotalPrice] = useState<number>(0);
  const { removeItem, totalItems, totalPrice, items, setQuantity } = useCart();
  useEffect(() => {
    setItemsCount(totalItems() ?? 0);
    setTotalPrice(totalPrice() ?? 0);
  }, [items]);
  if (itemsCount === null) return null;

  //   dropdown-open
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FaCartShopping className="size-6" />
          <span className="badge badge-sm indicator-item">{itemsCount}</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-100 z-1 mt-3 w-80 shadow"
      >
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.gameId}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <span className="font-semibold">{item.gameName}</span>
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
                  <span className="ml-2">x {item.price} PLN</span>
                </div>
              </div>
              <button
                className="btn btn-sm btn-error"
                onClick={() => removeItem(item.gameId)}
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
        <div className="card-body">
          <span className="text-lg font-bold">
            {itemsCount
              ? `${itemsCount} ${
                  itemsCount === 1 ? "przedmiot" : "przedmiotów"
                }`
              : "Koszyk jest pusty"}
          </span>
          <span className="text-info">Cena całkowita: {totalPriceC}</span>
          <div className="card-actions">
            <Link href={"/kasa"} className="btn w-full">
              Do kasy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
