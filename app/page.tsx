"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "@/components/ColorPicker";
import Greeting from "@/components/Greeting";
import Question from "@/components/Question";
import Scheduler from "@/components/Scheduler";
import ThankYou from "@/components/ThankYou";
import { applyTheme, themeBackground, type Theme } from "@/lib/themes";
import type { DatePlan } from "@/lib/types";

type Step = "color" | "greeting" | "question" | "scheduler" | "thanks";

const stepVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
};

/** A wash of the chosen colour spreading out from the tapped swatch. */
interface Reveal {
  theme: Theme;
  x: number;
  y: number;
  /** radius that covers the whole viewport from (x, y) */
  radius: number;
  phase: "in" | "out";
}

export default function Home() {
  const [step, setStep] = useState<Step>("color");
  const [plan, setPlan] = useState<DatePlan | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);

  // Each step starts at the top — otherwise after submitting the (tall)
  // scheduler on a phone you'd land below the short thank-you card.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const pickColor = (theme: Theme, { x, y }: { x: number; y: number }) => {
    if (reveal) return;
    const radius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) + 40;
    setReveal({ theme, x, y, radius, phase: "in" });
  };

  return (
    <>
      <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center [justify-content:safe_center] px-5 py-12">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {step === "color" && <ColorPicker onPick={pickColor} />}

            {step === "greeting" && (
              <Greeting onDone={() => setStep("question")} />
            )}

            {step === "question" && (
              <Question onYes={() => setStep("scheduler")} />
            )}

            {step === "scheduler" && (
              <Scheduler
                onSubmit={(data) => {
                  setPlan(data);
                  setStep("thanks");
                }}
              />
            )}

            {step === "thanks" && plan && <ThankYou plan={plan} />}
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Colour reveal: grows from the swatch, the theme switches underneath
          while it fully covers the screen, then it gently fades away. */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            key="reveal"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-50"
            style={{ background: themeBackground(reveal.theme) }}
            initial={{
              clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)`,
              opacity: 1,
            }}
            animate={{
              clipPath: `circle(${reveal.radius}px at ${reveal.x}px ${reveal.y}px)`,
              opacity: reveal.phase === "in" ? 1 : 0,
            }}
            transition={
              reveal.phase === "in"
                ? { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
                : { duration: 0.7, ease: "easeOut" }
            }
            onAnimationComplete={() => {
              if (reveal.phase === "in") {
                applyTheme(reveal.theme);
                setStep("greeting");
                setReveal({ ...reveal, phase: "out" });
              } else {
                setReveal(null);
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
