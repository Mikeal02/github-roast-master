import { useRef, useState, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  tiltMax?: number;
  borderGlow?: boolean;
}

export function GlowCard({
  children,
  className = '',
  glowColor,
  intensity = 'medium',
  tiltMax = 6,
  borderGlow = true,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 250 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltMax, -tiltMax]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltMax, tiltMax]), springConfig);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const sizes = { low: 200, medium: 350, high: 500 };
  const opacities = { low: '0.08', medium: '0.15', high: '0.25' };
  const size = sizes[intensity];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      glowX.set(e.clientX - rect.left);
      glowY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY, glowX, glowY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Cursor-following radial glow */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none z-0"
          style={{
            width: size,
            height: size,
            x: useTransform(glowX, (v) => v - size / 2),
            y: useTransform(glowY, (v) => v - size / 2),
            background: glowColor
              ? `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--primary) / ${opacities[intensity]}) 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Border glow effect */}
      {borderGlow && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(600px circle at ${x}px ${y}px, hsl(var(--primary) / 0.1), transparent 40%)`
            ),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Edge highlight line */}
      {borderGlow && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
          style={{
            boxShadow: `inset 0 0 0 1px hsl(var(--primary) / 0.15)`,
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(400px circle at ${x}px ${y}px, hsl(var(--primary) / 0.06), transparent 50%)`
            ),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Specular highlight */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `radial-gradient(ellipse 50% 30% at ${(x as number) * 100}% ${(y as number) * 100}%, hsl(0 0% 100% / 0.04), transparent)`
            ),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
