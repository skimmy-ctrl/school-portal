import { motion } from 'framer-motion';

type BackgroundPaperShadersProps = {
  className?: string;
  speed?: number;
};

export function BackgroundPaperShaders({
  className = '',
  speed = 1,
}: BackgroundPaperShadersProps) {
  const duration = 8 / speed;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none bg-[#eef2f7] ${className}`} aria-hidden="true">
      <motion.div
        className="absolute -top-28 left-[8%] h-96 w-96 rounded-full bg-[#9ca3af]/72 blur-[110px]"
        animate={{
          x: [0, 110, -90, 90, 0],
          y: [-140, -70, 0, 90, 150],
          scale: [1, 1.1, 0.95, 1.08, 1],
        }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[-7rem] right-[6%] h-[30rem] w-[30rem] rounded-full bg-[#4b5563]/62 blur-[125px]"
        animate={{
          x: [0, -120, 95, -80, 0],
          y: [-150, -70, 0, 95, 150],
          scale: [1, 0.92, 1.06, 0.96, 1],
        }}
        transition={{ duration: duration * 1.05, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-12rem] left-[20%] h-[28rem] w-[28rem] rounded-full bg-[#6b7280]/58 blur-[140px]"
        animate={{
          x: [0, 95, -85, 70, 0],
          y: [160, 75, 0, -80, -150],
          scale: [1, 1.04, 0.9, 1.06, 1],
        }}
        transition={{ duration: duration * 1.15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-7rem] right-[10%] h-80 w-80 rounded-full bg-[#374151]/62 blur-[100px]"
        animate={{
          x: [0, -75, 60, -50, 0],
          y: [145, 70, 0, -70, -145],
          scale: [1, 1.06, 0.94, 1.04, 1],
        }}
        transition={{ duration: duration * 0.95, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.42),transparent_40%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.3),transparent_45%)]"
        animate={{ opacity: [0.55, 0.95, 0.65, 0.9, 0.55] }}
        transition={{ duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 backdrop-blur-[3px]" />
    </div>
  );
}
