import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ children, className = '', glowColor }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Radial glow follow cursor */}
      {isHovered && (
        <div
          className="absolute pointer-events-none z-0 transition-opacity duration-300"
          style={{
            width: 300,
            height: 300,
            left: mousePos.x - 150,
            top: mousePos.y - 150,
            background: glowColor
              ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
