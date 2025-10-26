import React from "react";

type RatingProps = {
  rating: number; // np. 3.5
  disable?: boolean;
  size?: "small" | "large";
  name: string;
};

export default function Rating({ rating, disable, size, name }: RatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const rounded = Math.round(clamped * 2);

  return (
    <div
      className={`rating ${
        size === "small" ? "rating-sm" : "rating-lg"
      } rating-half`}
    >
      <input type="radio" name={name} className="rating-hidden" readOnly />
      {Array.from({ length: 5 }).map((_, i) => {
        const half1 = i * 2 + 1;
        const half2 = i * 2 + 2;
        return (
          <React.Fragment key={i}>
            <input
              type="radio"
              name={name}
              disabled={disable}
              className="mask mask-star-2 mask-half-1 bg-orange-400"
              aria-label={`${i + 0.5} star`}
              value={i + 0.5}
              defaultChecked={rounded === half1}
              readOnly
            />
            <input
              type="radio"
              name={name}
              disabled={disable}
              className="mask mask-star-2 mask-half-2 bg-orange-400"
              aria-label={`${i + 1} star`}
              value={i + 1}
              defaultChecked={rounded === half2}
              readOnly
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
