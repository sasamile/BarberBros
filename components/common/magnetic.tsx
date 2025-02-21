"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface MagneticProps {
  children: React.ReactElement;
}

export function Magnetic({ children }: MagneticProps) {
  const magnetic = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const magneticElement = magnetic.current;

    if (!magneticElement) return;

    const xTo = gsap.quickTo(magneticElement, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(magneticElement, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, top, left } =
        magneticElement.getBoundingClientRect();

      const x = (clientX - (left + width / 2)) * 0.3;
      const y = (clientY - (top + height / 2)) * 0.3;

      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    magneticElement.addEventListener("mousemove", handleMouseMove);
    magneticElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      magneticElement.removeEventListener("mousemove", handleMouseMove);
      magneticElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return React.createElement("div", { ref: magnetic }, children);
}
