import React, { useRef, useState } from "react";
import { motion } from "motion/react";

/* --------------------------------------------------------------------------
   Magnetic wrapper — Dennis Snellenberg signature physics
   Attracts elements smoothly towards cursor on proximity with spring bounce
   -------------------------------------------------------------------------- */
export const Magnetic: React.FC<{
  children: React.ReactElement<{ style?: React.CSSProperties; className?: string }>;
  strength?: number;
  className?: string;
}> = ({ children, strength = 0.35, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 180, damping: 14, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
