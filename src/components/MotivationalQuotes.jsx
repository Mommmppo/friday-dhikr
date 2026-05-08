import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "من صلى علي صلاة واحدة صلى الله عليه عشر صلوات",
  "إن الله وملائكته يصلون على النبي يا أيها الذين آمنوا صلوا عليه وسلموا تسليما",
  "البخيل من ذُكرت عنده فلم يصل علي",
  "أولى الناس بي يوم القيامة أكثرهم علي صلاة",
  "أكثروا من الصلاة علي في يوم الجمعة"
];

export default function MotivationalQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Cycle quotes every 10 seconds
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-center px-4 py-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8 }}
          className="font-arabic text-xl md:text-2xl text-primary text-glow font-bold leading-relaxed"
        >
          {quotes[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
