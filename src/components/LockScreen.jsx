import { motion } from 'framer-motion';

export default function LockScreen({ lastFridayCount = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-glow blur-[150px] rounded-full pointer-events-none opacity-30" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md text-center space-y-10"
      >
        <div className="glass-card p-10 rounded-3xl space-y-8">
          <div className="text-6xl mb-6">🔒</div>
          
          <h1 className="font-arabic text-3xl leading-relaxed text-text-main">
            انتهى تحدي هذه الجمعة، نلقاكم الجمعة القادمة
          </h1>
          
          <div className="pt-6 border-t border-white/10 space-y-2">
            <p className="text-text-muted text-sm uppercase tracking-wider">Last Friday's Total</p>
            <p className="text-4xl font-bold text-primary text-glow tabular-nums">
              {lastFridayCount > 0 ? lastFridayCount.toLocaleString() : "..."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
