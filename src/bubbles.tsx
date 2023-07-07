"use client";

import { Bubble, ColorRGBA } from "./bubble";
import React from "react";

export default function Bubbles({
  quantity = 5,
  blur = 100, // px
  minSpeed = 5, // px/s
  maxSpeed = 25, // px/s
  minSize = 15, // window width %
  maxSize = 55, // window width %,
  colors,
  className,
}: {
  quantity?: number;
  blur?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minSize?: number;
  maxSize?: number;
  colors?: ColorRGBA[];
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [hasStarted, setHasStarted] = React.useState(false);
  const [screenSize, setScreenSize] = React.useState({ x: 0, y: 0 });
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);

  React.useEffect(() => {
    let bubbles: Bubble[] = [];
    for (let i = 0; i < quantity; i++) {
      bubbles.push(
        new Bubble({
          blur: blur,
          minSpeed: minSpeed,
          maxSpeed: maxSpeed,
          minSize: minSize,
          maxSize: maxSize,
          colors: colors,
        })
      );
    }

    setBubbles([...bubbles]);
    setHasStarted(true);
  }, [quantity, blur, minSpeed, maxSpeed, minSize, maxSize, colors]);

  React.useEffect(() => {
    if (bubbles.length <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let startTime = 0;
    const floatAnimId = requestAnimationFrame(function animate(currentTime) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dt = (currentTime - startTime) / 1000;

      bubbles.forEach((bubble) => {
        // check if in view
        const bubbleY = bubble.position.y + (bubble.size + bubble.blur) / 2;
        if (bubbleY < 0) {
          bubble.resetBubble();
          return;
        }

        // move bubble up
        const direction = bubble.getMoveDirection();
        bubble.position.x += direction.x * bubble.speed * dt;
        bubble.position.y += direction.y * bubble.speed * dt;

        // draw bubble
        ctx.beginPath();
        ctx.arc(
          bubble.position.x,
          bubble.position.y,
          bubble.size / 2,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(${bubble.color.r}, ${bubble.color.g}, ${bubble.color.b}, ${bubble.color.a})`;
        ctx.fill();
      });

      startTime = currentTime;
      requestAnimationFrame(animate);
    });

    function handleResize() {
      setScreenSize({ x: innerWidth, y: innerHeight });
    }
    handleResize();
    addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(floatAnimId);
      removeEventListener("resize", handleResize);
    };
  }, [bubbles]);

  return (
    <canvas
      ref={canvasRef}
      width={screenSize.x}
      height={screenSize.y}
      className={`-z-50 fixed top-0 left-0 transition-opacity duration-1000 ${className}`}
      style={{
        filter: `blur(${blur}px)`,
        opacity: hasStarted ? 1 : 0,
      }}
    />
  );
}
