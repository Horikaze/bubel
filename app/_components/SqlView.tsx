"use client";
import { useShowSql } from "@/lib/zustand";
import React from "react";
export default function SqlView({ sql }: { sql: string }) {
  const { showSql, toggleSql, setSql } = useShowSql();
  if (!showSql) return null;
  return (
    <div className="mockup-code w-full p-3">
      <code>{sql}</code>
    </div>
  );
}
