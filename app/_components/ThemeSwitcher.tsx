"use client";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeSwitcher() {
  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input type="checkbox" className="theme-controller" value="fantasy" />

      <FaSun className="swap-off size-6 fill-current" />

      <FaMoon className="swap-on size-6 fill-current" />
    </label>
  );
}
