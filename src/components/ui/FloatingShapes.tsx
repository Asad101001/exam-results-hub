import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: 'circle' | 'square' | 'triangle' | 'hexagon';
  color: string;
  speed: number;
  delay: number;
}

const COLORS = [
  'hsl(160, 60%, 38%)', // Primary
  'hsl(42, 90%, 55%)',  // Accent
  'hsl(145, 60%, 40%)', // Success
];

const generateShapes = (count: number): Shape[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 40,
    rotation: Math.random() * 360,
    type: ['circle', 'square', 'triangle', 'hexagon'][Math.floor(Math.random() * 4)] as Shape['type'],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: 15 + Math.random() * 25,
    delay: Math.random() * 10,
  }));
};

export function FloatingShapes({ count = 8 }: { count?: number }) {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    setShapes(generateShapes(count));
  }, [count]);

  const renderShape = (shape: Shape) => {
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
      animationDuration: `${shape.speed}s`,
      animationDelay: `${shape.delay}s`,
      backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
      opacity: 0.08,
    };

    const baseClasses = 'absolute animate-float pointer-events-none';

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className={`${baseClasses} rounded-full`}
            style={style}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            className={`${baseClasses} rounded-lg`}
            style={{ ...style, transform: `rotate(${shape.rotation}deg)` }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className={`${baseClasses}`}
            style={{
              ...style,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              opacity: 0.06,
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            key={shape.id}
            className={`${baseClasses}`}
            style={{
              ...style,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map(renderShape)}
    </div>
  );
}
