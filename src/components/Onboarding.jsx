import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Onboarding({ onStart, inviterName }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('dhikrUserName', name.trim());
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-glow blur-[120px] rounded-full pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-md space-y-12"
      >
        <div className="text-center space-y-6">
          <h1 className="font-arabic text-4xl md:text-5xl leading-tight text-glow text-primary font-bold">
            وَفِي ذَلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ
          </h1>
          
          {inviterName ? (
            <p className="text-primary/90 text-lg md:text-xl font-medium bg-primary/10 py-3 px-4 rounded-2xl border border-primary/20 inline-block">
              لقد دعاك <span className="font-bold text-primary">{inviterName}</span> للتنافس في الصلاة على النبي ﷺ.
            </p>
          ) : (
            <p className="text-text-muted text-lg md:text-xl font-medium">
              تحدي الجمعة: تسابق مع أصحابك في الصلاة على النبي ﷺ.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك للمشاركة"
              className="w-full bg-surface/50 border border-white/10 rounded-2xl px-6 py-4 text-center text-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-text-main placeholder:text-text-muted/50 backdrop-blur-md"
              dir="rtl"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!name.trim()}
            className={cn(
              "w-full py-4 rounded-2xl text-xl font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]",
              name.trim() 
                ? "bg-primary text-background hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]" 
                : "bg-surface text-text-muted cursor-not-allowed"
            )}
          >
            ابدأ التحدي
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
