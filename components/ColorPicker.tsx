"use client";

import { motion } from "framer-motion";
import CoffeeMark from "./CoffeeMark";
import { THEMES, type Theme } from "@/lib/themes";

/** First screen: pick a theme (Siyah / Beyaz / Pembe) the whole page adopts. */
export default function ColorPicker({
  onPick,
}: {
  onPick: (theme: Theme, origin: { x: number; y: number }) => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-9"
      >
        <CoffeeMark size={72} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[2.6rem] font-medium leading-[1.1] tracking-[-0.015em] text-espresso-800 sm:text-6xl"
      >
        Bir tema seç
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.6 }}
        className="mt-4 font-display text-lg italic text-espresso-500"
      >
        Siyah, beyaz ya da pembe.
      </motion.p>

      <div className="mt-12 flex justify-center gap-6 sm:gap-9">
        {THEMES.map((theme, i) => (
          <motion.button
            key={theme.id}
            type="button"
            aria-label={`${theme.name} tema`}
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.35 + i * 0.08,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              const swatch = e.currentTarget.querySelector("[data-swatch]");
              const r = (swatch ?? e.currentTarget).getBoundingClientRect();
              onPick(theme, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
            className="focus-ring group flex w-20 flex-col items-center gap-3 rounded-2xl py-1"
          >
            <span
              data-swatch
              className="relative h-16 w-16 rounded-full ring-1 ring-black/[0.06] transition-transform duration-300"
              style={{ backgroundImage: theme.swatch, boxShadow: theme.swatchShadow }}
            >
              {/* soft gloss, brightens on hover */}
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_26%,rgb(255_255_255/0.5),transparent_50%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="text-sm font-medium tracking-wide text-espresso-600">
              {theme.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
