import React, { useEffect, useRef, useState } from "react";

export default function AnimatedPetals() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const pointerQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const updateEnabled = () => {
            setEnabled(pointerQuery.matches && !motionQuery.matches);
        };

        updateEnabled();
        pointerQuery.addEventListener("change", updateEnabled);
        motionQuery.addEventListener("change", updateEnabled);

        return () => {
            pointerQuery.removeEventListener("change", updateEnabled);
            motionQuery.removeEventListener("change", updateEnabled);
        };
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el || !enabled) return;

        const petals = Array.from(el.querySelectorAll<HTMLElement>(".petal"));
        let raf = 0;
        let pointer = { x: -9999, y: -9999 };

        function onMove(e: PointerEvent) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (!raf) raf = requestAnimationFrame(loop);
        }

        function loop() {
            raf = 0;
            petals.forEach((p) => {
                const rect = p.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = cx - pointer.x;
                const dy = cy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const maxDist = 220;
                if (dist < maxDist) {
                    const force = (1 - dist / maxDist) * 34;
                    const tx = (dx / dist) * force;
                    const ty = (dy / dist) * force;
                    p.style.transform = `translate(${tx}px, ${ty}px) rotate(${tx * 0.2}deg)`;
                    p.style.opacity = `${0.9}`;
                } else {
                    p.style.transform = "";
                    p.style.opacity = "";
                }
            });
        }

        window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
            window.removeEventListener("pointermove", onMove as any);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div ref={containerRef} className="animated-petals" aria-hidden>
            <span className="petal p1" />
            <span className="petal p2" />
            <span className="petal p3" />
            <span className="petal p4" />
            <span className="petal p5" />
            <span className="petal p6" />
            <span className="petal p7" />
            <span className="petal p8" />
            <span className="petal p9" />
            <span className="petal p10" />
            <span className="petal p11" />
            <span className="petal p12" />
            <span className="petal p13" />
            <span className="petal p14" />
            <span className="petal p15" />
            <span className="petal p16" />
        </div>
    );
}
