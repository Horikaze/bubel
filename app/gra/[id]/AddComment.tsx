"use client";
import { AddCommentAction } from "@/actions/gameAction";
import Rating from "@/app/_components/Rating";
import SqlView from "@/app/_components/SqlView";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
export default function AddComment({
  gameId,
  userId,
}: {
  gameId: number;
  userId: string;
}) {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      const checkedInput = e.currentTarget.querySelector<HTMLInputElement>(
        'input[type="radio"]:checked'
      );
      const rating = checkedInput ? Number(checkedInput.value) : 0;
      if (!comment || rating === 0) {
        toast.error("Musisz wpisać komentarz i wybrać ocenę!");
        setPending(false);
        return;
      }
      await AddCommentAction(gameId, comment, rating);
      toast.success("Komentarz dodany pomyślnie.");
      setComment("");
      setRatingValue(0);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        "Błąd podczas dodawania komentarza. Możliwe że masz już dodany komentarz."
      );
    } finally {
      setPending(false);
    }
  };
  const AddCommentSQLDynamic = `
START TRANSACTION;
INSERT INTO \`komentarz\` (id_gry, id_klienta, tresc, ocena, data_dodania)
VALUES ('${gameId}', '${userId}', '${comment}', 4, NOW());

UPDATE \`gra\` g
JOIN (
    SELECT id_gry, AVG(ocena) AS avg_ocena
    FROM \`komentarz\`
    WHERE id_gry = '${gameId}'
    GROUP BY id_gry
) k ON g.id = k.id_gry
SET g.ocena = k.avg_ocena;

COMMIT;
`;
  return (
    <div className="flex flex-col gap-2">
      <SqlView sql={AddCommentSQLDynamic} />
      <h2 className="text-2xl font-semibold">Dodaj komentarz:</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="textarea textarea-bordered w-full max-h-52"
          placeholder="Napisz swój komentarz..."
        />
        <Rating
          rating={ratingValue}
          name={`rating-add-${gameId}`}
          disable={false}
          size="large"
        />
        <button disabled={pending} type="submit" className="btn btn-primary">
          {pending && <FaSpinner className="animate-spin size-4 mr-2" />}
          Dodaj komentarz
        </button>
      </form>
    </div>
  );
}
