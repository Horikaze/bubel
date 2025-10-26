"use client";
import { useCart } from "@/lib/zustand";
import React from "react";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";

type AddToCartButtonProps = {
  gameId: number;
  gameName: string;
  price: number;
};

export default function AddToCartButton({
  gameId,
  gameName,
  price,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => {
        addItem({ gameId, gameName, price });
        toast.success(`${gameName} dodane do koszyka!`);
      }}
      className="btn btn-accent btn-wide"
    >
      <FaShoppingCart /> Dodaj do koszyka
    </button>
  );
}
