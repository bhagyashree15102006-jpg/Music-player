import React, { useMemo } from 'react';

export default function AtmosphericBackground() {
  // Generate random drifting autumn leaves
  const leaves = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + Math.random() * 5) % 100}%`,
      delay: `${(i * 1.8) % 18}s`,
      duration: `${14 + (i % 8) * 2.5}s`,
      size: 16 + (i % 4) * 6,
      rotate: Math.random() * 360,
      opacity: 0.25 + (i % 3) * 0.12,
      color: ['#d97706', '#b45309', '#92400e', '#78350f', '#ca8a04'][i % 5]
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle CRT Scanlines & Grain */}
      <div className="absolute inset-0 crt-overlay opacity-30" />

      {/* Drifting Dry Leaves (PRD Section 2) */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute -top-10 transition-transform"
          style={{
            left: leaf.left,
            animation: `driftDown ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
            opacity: leaf.opacity,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={leaf.color}
            className="w-full h-full drop-shadow-sm transform"
            style={{ transform: `rotate(${leaf.rotate}deg)` }}
          >
            {/* Retro stylised dry leaf */}
            <path d="M12 2C7 5 3 10 3 15c0 4 3.5 7 8 7 1 0 2-.2 3-.6 2-1 4-3 5-6 1-3 1-8-7-13.4zM12 4c5 4.5 5 8 4 10.5-1 2.2-2.5 3.8-4 4.5V4z" />
          </svg>
        </div>
      ))}

      {/* Embedded CSS for smooth leaf fall animation */}
      <style>{`
        @keyframes driftDown {
          0% {
            transform: translateY(-40px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(35vh) translateX(30px) rotate(120deg);
          }
          66% {
            transform: translateY(70vh) translateX(-25px) rotate(240deg);
          }
          100% {
            transform: translateY(105vh) translateX(20px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
