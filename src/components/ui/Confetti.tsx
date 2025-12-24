import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

const CONFETTI_COLORS = [
  '#22c55e', // Green
  '#eab308', // Yellow
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#f97316', // Orange
  '#8b5cf6', // Purple
];

export function Confetti({ trigger, duration = 3000 }: { trigger: boolean; duration?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger && !active) {
      setActive(true);
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));
      setPieces(newPieces);

      setTimeout(() => {
        setActive(false);
        setPieces([]);
      }, duration);
    }
  }, [trigger, active, duration]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
