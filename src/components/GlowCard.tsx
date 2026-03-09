import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlowCard({ children, className = '', glowColor, intensity = 'medium' }: GlowCardProps) {
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

  const sizes = { low: 200, medium: 300, high: 450 };
  const opacities = { low: '0.06', medium: '0.12', high: '0.2' };
  const size = sizes[intensity];

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
            width: size,
            height: size,
            left: mousePos.x - size / 2,
            top: mousePos.y - size / 2,
            background: glowColor
              ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--primary) / ${opacities[intensity]}) 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
      )}
      {/* Subtle border highlight on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.06), transparent 50%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
