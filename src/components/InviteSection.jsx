import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function InviteSection({ currentUserName }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}?inviter=${encodeURIComponent(currentUserName)}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="glass-card rounded-3xl p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Share2 className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold text-text-main">
        تحدى أصحابك!
      </h3>
      
      <p className="text-text-muted">
        شارك الرابط مع أصدقائك وتنافسوا في الصلاة على النبي ﷺ. الدال على الخير كفاعله.
      </p>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopyLink}
        className={cn(
          "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
          copied 
            ? "bg-green-500/20 text-green-400 border border-green-500/50" 
            : "bg-surface border border-white/10 text-text-main hover:border-primary/50"
        )}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            تم نسخ الرابط!
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            انسخ رابط الدعوة
          </>
        )}
      </motion.button>
    </div>
  );
}
