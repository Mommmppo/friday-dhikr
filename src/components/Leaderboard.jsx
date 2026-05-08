import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Trophy } from 'lucide-react';

export default function Leaderboard({ leaderboard, currentUserName, inviterName }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  return (
    <div className="w-full h-full">
      <div className="glass-card rounded-3xl overflow-hidden p-6 h-full flex flex-col">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          لوحة الشرف
        </h3>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {leaderboard.map((user, index) => {
            const isTop3 = index < 3;
            const isCurrentUser = user.name === currentUserName;
            const isInviter = user.name === inviterName;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: 20 }} // coming from right since RTL
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-all",
                  isTop3 
                    ? "bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                    : "bg-white/5 border border-white/5",
                  isCurrentUser && "ring-2 ring-primary bg-primary/10",
                  isInviter && !isCurrentUser && "ring-1 ring-amber-500 bg-amber-500/10"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-lg font-bold w-6 text-center",
                    isTop3 ? "text-primary" : "text-text-muted"
                  )}>
                    {index + 1}
                  </span>
                  <span className={cn(
                    "font-medium flex items-center gap-2",
                    isCurrentUser ? "text-primary" : (isInviter ? "text-amber-400" : "text-text-main")
                  )}>
                    {user.name}
                    {isCurrentUser && <span className="text-xs text-text-muted bg-surface/80 px-2 py-0.5 rounded-full">(أنت)</span>}
                    {isInviter && !isCurrentUser && <span className="text-xs text-text-muted bg-surface/80 px-2 py-0.5 rounded-full">(صديقك)</span>}
                  </span>
                </div>
                <span className={cn(
                  "font-bold tabular-nums",
                  isTop3 ? "text-primary" : "text-text-main"
                )}>
                  {user.count.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
