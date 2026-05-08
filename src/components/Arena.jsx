import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Arena({ personalCount, globalCount, onIncrement }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Add ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Call the increment handler
    onIncrement();
  }, [onIncrement]);

  const removeRipple = (id) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col items-center py-6 px-6 w-full max-w-lg mx-auto space-y-12">
      
      {/* Global Counter */}
      <div className="glass-card px-8 py-6 rounded-3xl text-center w-full">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">العداد الجماعي</h2>
        <div className="text-5xl font-bold text-glow text-primary tabular-nums">
          {globalCount.toLocaleString()}
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <p className="text-text-muted mb-2">وردك الحالي</p>
          <div className="text-4xl font-bold text-text-main tabular-nums">
            {personalCount.toLocaleString()}
          </div>
        </div>

        <motion.button
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-primary to-[#a88722] shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden touch-manipulation focus:outline-none"
        >
          {/* Inner ring for depth */}
          <div className="absolute inset-2 rounded-full border border-white/20" />
          
          <span className="font-arabic text-3xl sm:text-4xl text-background font-bold drop-shadow-md z-10 select-none">
            ﷺ
          </span>

          {/* Ripples */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onAnimationComplete={() => removeRipple(ripple.id)}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 100,
                  height: 100,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </AnimatePresence>
        </motion.button>
        <p className="text-sm text-text-muted mt-4 select-none">اضغط للصلاة على النبي</p>
      </div>
    </div>
  );
}
