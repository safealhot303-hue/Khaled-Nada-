import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type ReferenceFaithfulIntroProps = {
  /** Replace this with your site's existing main-section reveal/navigation logic. */
  onReveal: () => void;
};

type IntroState = "ready" | "opening" | "leaving";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ReferenceFaithfulIntro({
  onReveal,
}: ReferenceFaithfulIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reconstructionRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLImageElement>(null);
  const flapRef = useRef<HTMLImageElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number | null>(null);

  const [state, setState] = useState<IntroState>("ready");

  const reveal = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    onReveal();
  };

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const reconstruction = reconstructionRef.current;
    const envelope = envelopeRef.current;

    if (!root || !scene || !reconstruction || !envelope) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resetParallax = () => {
      gsap.to(envelope, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (state !== "ready" || reduced.matches) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(envelope, {
          x: clamp(nx * 14, -10, 10),
          y: clamp(ny * 10, -8, 8),
          rotateY: clamp(nx * 2.2, -2.2, 2.2),
          rotateX: clamp(-ny * 1.8, -1.8, 1.8),
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    const onPointerLeave = () => resetParallax();

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [state]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const openEnvelope = () => {
    if (state !== "ready") return;

    setState("opening");

    const scene = sceneRef.current;
    const reconstruction = reconstructionRef.current;
    const envelope = envelopeRef.current;
    const body = bodyRef.current;
    const flap = flapRef.current;
    const seal = sealRef.current;
    const card = cardRef.current;
    const button = buttonRef.current;
    if (!scene || !reconstruction || !envelope || !body || !flap || !seal || !card || !button) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.timeline({
        onComplete: reveal,
      })
        .to(button, { scale: 0.96, opacity: 0, duration: 0.12 })
        .set(reconstruction, { autoAlpha: 1 })
        .to(envelope, { scale: 1.05, duration: 0.25, ease: "power2.out" })
        .to(flap, { rotateX: -132, duration: 0.32, transformOrigin: "50% 0%", ease: "power2.inOut" })
        .to(card, { y: "-42%", scale: 1.08, duration: 0.45, ease: "power2.out" })
        .to(card, { scale: 1.55, opacity: 0, duration: 0.28, ease: "power2.in" })
      return;
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: reveal,
    });

    tlRef.current = timeline;

    timeline
      // Stage 1: button press/fade.
      .to(button, {
        scale: 0.965,
        opacity: 0.12,
        duration: 0.12,
        ease: "power2.out",
      })
      .to(button, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      }, "<0.08")
      // Crossfade into a reconstructed DOM envelope made from the exact reference crops.
      .set(reconstruction, { autoAlpha: 1 })
      .fromTo(
        [body, flap, seal],
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: "power2.out" },
      )
      // Stage 2: focus / camera push.
      .to(scene, {
        scale: 1.025,
        filter: "blur(1.1px) brightness(0.99)",
        duration: 0.55,
        ease: "power2.out",
      }, "<")
      .to(envelope, {
        scale: 1.08,
        y: -10,
        duration: 0.55,
        ease: "power3.out",
      }, "<")
      // Stage 3: seal reacts, releases and disappears naturally.
      .to(seal, {
        y: -10,
        scale: 1.035,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(seal, {
        y: -24,
        opacity: 0,
        duration: 0.38,
        ease: "power2.in",
      })
      // Stage 4: flap opens on its real top hinge.
      .to(flap, {
        rotateX: -8,
        duration: 0.12,
        ease: "power2.out",
      })
      .to(flap, {
        rotateX: -148,
        y: -4,
        duration: 1.05,
        ease: "power3.inOut",
      })
      // Stage 5–6: card emerges and becomes dominant.
      .to(card, {
        y: "-26%",
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
      }, "-=0.35")
      .to(card, {
        y: "-54%",
        scale: 1.12,
        duration: 0.75,
        ease: "power2.out",
      })
      // Stage 7: physical-entry transition.
      .to(envelope, {
        opacity: 0.18,
        y: 22,
        scale: 0.96,
        duration: 0.55,
        ease: "power2.inOut",
      }, "-=0.2")
      .to(scene, {
        scale: 1.05,
        duration: 0.8,
        ease: "power2.in",
      }, "<")
      .to(card, {
        y: "-72%",
        scale: 1.75,
        duration: 0.95,
        ease: "power3.in",
      }, "-=0.7")
      .to(card, {
        opacity: 0,
        duration: 0.32,
        ease: "power2.in",
      }, "-=0.25");
  };

  const skip = () => {
    if (state === "leaving") return;
    setState("leaving");
    reveal();
  };

  return (
    <section
      ref={rootRef}
      className={`reference-intro reference-intro--${state}`}
      aria-label="مقدمة دعوة خالد وندى"
    >
      <div ref={sceneRef} className="reference-intro__scene">
        <img
          className="reference-intro__master"
          src="/reference/reference-1.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <div className="reference-intro__vignette" aria-hidden="true" />

        {/* Real DOM accessible controls positioned over the exact master composition. */}
        <button
          ref={buttonRef}
          type="button"
          className="reference-intro__open-hit"
          aria-label="افتح الظرف"
          onClick={openEnvelope}
        >
          <span className="sr-only">افتح الظرف</span>
        </button>

        <button
          ref={skipRef}
          type="button"
          className="reference-intro__skip-hit"
          aria-label="تخطي المقدمة"
          onClick={skip}
        >
          <span className="sr-only">تخطي</span>
        </button>

        {/* Hover affordance: a barely visible physical-light response around the envelope. */}
        <div className="reference-intro__hover-light" aria-hidden="true" />

        <div
          ref={reconstructionRef}
          className="reference-intro__reconstruction"
          aria-hidden="true"
        >
          <div ref={envelopeRef} className="reference-intro__envelope">
            <div className="reference-intro__cavity" />
            <img
              ref={bodyRef}
              src="/reference/envelope-body.png"
              className="reference-intro__body"
              alt=""
              draggable={false}
            />
            <img
              ref={flapRef}
              src="/reference/envelope-flap.png"
              className="reference-intro__flap"
              alt=""
              draggable={false}
            />
            <img
              ref={sealRef}
              src="/reference/wax-seal.png"
              className="reference-intro__seal"
              alt=""
              draggable={false}
            />
            <img
              ref={cardRef}
              src="/reference/invitation-card.png"
              className="reference-intro__card"
              alt=""
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {state === "ready" ? "المقدمة جاهزة." : "جاري فتح الدعوة."}
      </div>
    </section>
  );
}
