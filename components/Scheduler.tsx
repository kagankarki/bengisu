"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MapPicker from "./MapPicker";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import type { DatePlan, SelectedPlace } from "@/lib/types";

const fieldRow = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Scheduler({
  onSubmit,
}: {
  onSubmit: (plan: DatePlan) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState<SelectedPlace | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const ready = Boolean(date && time && place);

  const handleSubmit = () => {
    if (!ready || submitting || !place) return;
    setSubmitting(true);
    onSubmit({
      date,
      time,
      place: place.name,
      lat: place.lat,
      lng: place.lng,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-[2.4rem] font-medium leading-tight tracking-[-0.015em] text-espresso-800 sm:text-5xl"
      >
        Harika! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.6 }}
        className="mt-3 text-base text-espresso-500"
      >
        Ne zaman, saat kaçta ve nerede müsaitsin?
      </motion.p>

      <div className="glass mt-9 w-full rounded-[1.75rem] p-6 text-left sm:p-8">
        <motion.div custom={0} variants={fieldRow} initial="hidden" animate="show">
          <DatePicker value={date} onChange={setDate} />
        </motion.div>

        <div className="hairline my-6" />

        <motion.div custom={1} variants={fieldRow} initial="hidden" animate="show">
          <TimePicker value={time} onChange={setTime} />
        </motion.div>

        <div className="hairline my-6" />

        <motion.div custom={2} variants={fieldRow} initial="hidden" animate="show">
          <MapPicker onSelect={setPlace} />
        </motion.div>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={!ready || submitting}
        whileHover={ready ? { scale: 1.03 } : undefined}
        whileTap={ready ? { scale: 0.97 } : undefined}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="btn-primary focus-ring mt-8 w-full rounded-full px-8 py-4 text-base font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? "Gönderiliyor…" : "Planı gönder"}
      </motion.button>
    </div>
  );
}
