import React from "react";
export default function SqlView({ sql }: { sql: string }) {
  return (
    <div className="mockup-code w-full p-3">
      <code>{sql}</code>
    </div>
  );
}
