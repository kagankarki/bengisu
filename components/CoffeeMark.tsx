"use client";

import { useId } from "react";
import { motion } from "framer-motion";

/**
 * A calm, minimal coffee cup with a gently rising steam line.
 * Used as the visual anchor throughout the flow (no hearts).
 */
export default function CoffeeMark({ size = 72 }: { size?: number }) {
  // useId() contains ":" which can break SVG url(#…) references.
  const cupFill = `cup-${useId().replace(/:/g, "")}`;

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* soft warm halo */}
      <span
        aria-hidden
        className="absolute inset-[-35%] rounded-full bg-[radial-gradient(closest-side,rgba(201,180,155,0.45),rgba(201,180,155,0)_70%)] blur-md"
      />
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="relative drop-shadow-[0_10px_22px_rgba(80,60,44,0.2)]"
      >
        <defs>
          <linearGradient id={cupFill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3ede3" />
          </linearGradient>
        </defs>
        {/* steam */}
        <motion.path
          d="M26 14c2-3-2-5 0-8"
          stroke="#b39a80"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0, 0.9, 0.4], pathLength: 1, y: [-1, -3, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M34 14c2-3-2-5 0-8"
          stroke="#c9b49b"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0, 0.8, 0.3], pathLength: 1, y: [-1, -4, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        {/* cup */}
        <path
          d="M14 26h30v10a13 13 0 0 1-13 13h-4A13 13 0 0 1 14 36V26Z"
          fill={`url(#${cupFill})`}
          stroke="#503c2c"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* coffee surface */}
        <path
          d="M17.5 29.5h23"
          stroke="#8a6d52"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* handle */}
        <path
          d="M44 29h4a6 6 0 0 1 0 12h-3"
          fill="none"
          stroke="#503c2c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* saucer */}
        <path
          d="M12 54h34"
          stroke="#503c2c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
