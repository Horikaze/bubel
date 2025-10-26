import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">404 - Strona nie znaleziona</h1>
      <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
      <Link href="/" className="text-blue-500 underline">
        Powrót do strony głównej
      </Link>
    </div>
  );
}
